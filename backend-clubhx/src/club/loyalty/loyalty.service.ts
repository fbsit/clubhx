// src/loyalty/loyalty-module.service.ts
import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere, DataSource } from "typeorm";
import { LoyaltyPoint } from "./entity/loyalty-point";
import { LoyaltyTransaction } from "./entity/loyalty-transaction";
import { CreateLoyaltyPointDto } from "./dto/create-loyalty-point.dto";
import { UpdateLoyaltyPointDto } from "./dto/update-loyalty-point.dto";

@Injectable()
export class LoyaltyModuleService {
    constructor(
      @InjectRepository(LoyaltyPoint)
      private readonly repo: Repository<LoyaltyPoint>,
      private readonly dataSource: DataSource
    ) {}
  
    // === API estilo Medusa ===
  
    async listLoyaltyPoints(
      where: FindOptionsWhere<LoyaltyPoint>
    ): Promise<LoyaltyPoint[]> {
      return this.repo.find({ where });
    }
  
    async createLoyaltyPoints(dto: CreateLoyaltyPointDto): Promise<LoyaltyPoint> {
      const entity = this.repo.create({
        customer_id: dto.customer_id,
        points: dto.points ?? 0,
      });
      return this.repo.save(entity);
    }
  
    async updateLoyaltyPoints(dto: UpdateLoyaltyPointDto): Promise<LoyaltyPoint> {
      const entity = await this.repo.findOneBy({ id: dto.id });
      if (!entity) {
        throw new NotFoundException("LoyaltyPoint not found");
      }
      if (typeof dto.points === "number") entity.points = dto.points;
      await this.repo.save(entity);
      return entity;
    }
  
    /**
     * Suma puntos al registro del cliente. Si no existe, lo crea.
     * Usa transacción + bloqueo PESSIMISTIC_WRITE para evitar condiciones de carrera.
     */
    async addPoints(customerId: string, points: number): Promise<LoyaltyPoint> {
      return this.dataSource.transaction(async (manager) => {
        const repo = manager.getRepository(LoyaltyPoint);
  
        // Bloquea el registro (si existe) mientras se actualiza
        let lp = await repo.findOne({
          where: { customer_id: customerId },
          lock: { mode: "pessimistic_write" },
        });
  
        if (lp) {
          lp.points = (lp.points ?? 0) + points;
          await repo.save(lp);
          return lp;
        }
  
        lp = repo.create({ customer_id: customerId, points });
        await repo.save(lp);
        return lp;
      });
    }
  
    async deductPoints(customerId: string, points: number): Promise<LoyaltyPoint> {
      const toSpend = Math.floor(points || 0);
      const existingPoints = await this.listLoyaltyPoints({ customer_id: customerId });
      if (toSpend <= 0 || existingPoints.length === 0 || (existingPoints[0].points ?? 0) < toSpend) {
        throw new ForbiddenException("Insufficient loyalty points");
      }

      return await this.dataSource.transaction(async (manager) => {
        // Update balance
        const repo = manager.getRepository(LoyaltyPoint);
        const lp = await repo.findOneByOrFail({ id: existingPoints[0].id });
        lp.points = (lp.points ?? 0) - toSpend;
        await repo.save(lp);

        // Record negative transaction for consistency with expiry logic
        const txRepo = manager.getRepository(LoyaltyTransaction);
        const tx = txRepo.create({
          customer_id: customerId,
          points_delta: -toSpend,
          metadata: { reason: 'reward_redeem' },
        });
        await txRepo.save(tx);

        return lp;
      });
    }
  
    async getPoints(customerId: string): Promise<number> {
      const points = await this.listLoyaltyPoints({ customer_id: customerId });
      const base = points[0]?.points || 0;
      const expiryMonths = Number(process.env.LOYALTY_EXPIRY_MONTHS || 0);
      if (!expiryMonths || expiryMonths <= 0) return base;

      const txRepo = this.dataSource.getRepository(LoyaltyTransaction);
      const txs = await txRepo.find({ where: { customer_id: customerId }, order: { created_at: 'ASC' } });
      type Lot = { points: number; earnedAt: Date };
      const lots: Lot[] = [];
      const now = new Date();
      const addMonths = (d: Date, m: number) => new Date(d.getFullYear(), d.getMonth() + m, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
      for (const tx of txs) {
        if (tx.points_delta > 0) {
          lots.push({ points: tx.points_delta, earnedAt: tx.created_at });
        } else if (tx.points_delta < 0) {
          let toSpend = -tx.points_delta;
          while (toSpend > 0 && lots.length > 0) {
            const lot = lots[0];
            const spend = Math.min(lot.points, toSpend);
            lot.points -= spend;
            toSpend -= spend;
            if (lot.points <= 0) lots.shift();
          }
        }
        // prune expired lots
        for (let i = lots.length - 1; i >= 0; i--) {
          const expiresAt = addMonths(lots[i].earnedAt, expiryMonths);
          if (expiresAt <= now) lots.splice(i, 1);
        }
      }
      return lots.reduce((sum, l) => sum + l.points, 0);
    }

    async getUpcomingExpirations(customerId: string, monthsAhead = 6): Promise<{ month: string; expires: number }[]> {
      const expiryMonths = Number(process.env.LOYALTY_EXPIRY_MONTHS || 0);
      if (!expiryMonths || expiryMonths <= 0) return [];
      const txRepo = this.dataSource.getRepository(LoyaltyTransaction);
      const txs = await txRepo.find({ where: { customer_id: customerId }, order: { created_at: 'ASC' } });
      type Lot = { points: number; earnedAt: Date };
      const lots: Lot[] = [];
      for (const tx of txs) {
        if (tx.points_delta > 0) lots.push({ points: tx.points_delta, earnedAt: tx.created_at });
        if (tx.points_delta < 0) {
          let toSpend = -tx.points_delta;
          while (toSpend > 0 && lots.length > 0) {
            const lot = lots[0];
            const spend = Math.min(lot.points, toSpend);
            lot.points -= spend;
            toSpend -= spend;
            if (lot.points <= 0) lots.shift();
          }
        }
      }
      const now = new Date();
      const buckets = new Map<string, number>();
      for (const lot of lots) {
        const expiresAt = new Date(lot.earnedAt);
        expiresAt.setMonth(expiresAt.getMonth() + expiryMonths);
        if (expiresAt <= now) continue;
        const key = `${expiresAt.getFullYear()}-${String(expiresAt.getMonth() + 1).padStart(2, '0')}`;
        buckets.set(key, (buckets.get(key) || 0) + lot.points);
      }
      const results: { month: string; expires: number }[] = [];
      for (let i = 0; i < monthsAhead; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        results.push({ month: key, expires: buckets.get(key) || 0 });
      }
      return results;
    }
  
    async calculatePointsFromAmount(amount: number): Promise<number> {
      // Conversion: 1 point = 1,000 CLP in purchases
      // Round down to nearest whole point
      const points = Math.floor((amount || 0) / 1000);

      if (points < 0) {
        throw new BadRequestException("Amount cannot be negative");
      }

      return points;
    }
  
    async calculateCurrencyFromPoints(points: number): Promise<number> {
      // Convert points back to currency
      const CLP_PER_POINT = 1000; // 1 point = 1,000 CLP
      return points * CLP_PER_POINT;
    }

    /**
     * Earn points with an explicit points value (already calculated by caller).
     * Creates a loyalty transaction and updates the customer's balance atomically.
     */
    async earnPointsForOrderExplicit(params: { customerId: string; points: number; orderId?: string; metadata?: any }): Promise<{ awarded: number }> {
      const { customerId, points, orderId, metadata } = params;
      const toAward = Math.floor(points || 0);
      if (toAward <= 0) return { awarded: 0 };

      return await this.dataSource.transaction(async (manager) => {
        const lpRepo = manager.getRepository(LoyaltyPoint);
        const txRepo = manager.getRepository(LoyaltyTransaction);

        let lp = await lpRepo.findOne({ where: { customer_id: customerId }, lock: { mode: 'pessimistic_write' } });
        if (lp) {
          lp.points = (lp.points ?? 0) + toAward;
          await lpRepo.save(lp);
        } else {
          lp = lpRepo.create({ customer_id: customerId, points: toAward });
          await lpRepo.save(lp);
        }

        const tx = txRepo.create({
          customer_id: customerId,
          points_delta: toAward,
          ...(orderId ? { order_id: orderId } : {}),
          metadata: { reason: 'order_earned', ...(metadata || {}) },
        });
        await txRepo.save(tx);

        return { awarded: toAward };
      });
    }

    async earnPointsForOrder(params: { customerId: string; amountCLP: number; orderId?: string; metadata?: any }): Promise<{ awarded: number }> {
      const { customerId, amountCLP, orderId, metadata } = params;
      const toAward = await this.calculatePointsFromAmount(amountCLP);
      if (toAward <= 0) return { awarded: 0 };

      return await this.dataSource.transaction(async (manager) => {
        const lpRepo = manager.getRepository(LoyaltyPoint);
        const txRepo = manager.getRepository(LoyaltyTransaction);

        let lp = await lpRepo.findOne({ where: { customer_id: customerId }, lock: { mode: 'pessimistic_write' } });
        if (lp) {
          lp.points = (lp.points ?? 0) + toAward;
          await lpRepo.save(lp);
        } else {
          lp = lpRepo.create({ customer_id: customerId, points: toAward });
          await lpRepo.save(lp);
        }

        const tx = txRepo.create({
          customer_id: customerId,
          points_delta: toAward,
          ...(orderId ? { order_id: orderId } : {}),
          metadata: { reason: 'order_earned', amountCLP, ...(metadata || {}) },
        });
        await txRepo.save(tx);

        return { awarded: toAward };
      });
    }
  
    // === Integración con Cart/Promotions (requiere entidades adicionales) ===
    // TODO: Implementar cuando se agreguen las entidades Cart, Promotion, CartPromotion
  
    /*
    async removeExistingLoyaltyFromCart(cartId: string) {
      // Implementation pending Cart, Promotion, CartPromotion entities
    }
  
    async redeemPointsOnCart(params: {
      cartId: string;
      customerId: string;
      pointsToRedeem: number;
      ttlMinutes?: number;
    }): Promise<{ promotionId: string; discountValue: number }> {
      // Implementation pending Cart, Promotion, CartPromotion entities
    }
  
    async confirmOrderAndDeductPoints(params: {
      orderId: string;
      cartId: string;
      customerId: string;
    }) {
      // Implementation pending Cart, Promotion, CartPromotion entities
    }
  
    async refundPointsForOrder(params: {
      orderId: string;
      customerId: string;
      pointsToReturn: number;
    }) {
      // Implementation pending Cart, Promotion, CartPromotion entities
    }
    */
  }
