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
      const existingPoints = await this.listLoyaltyPoints({
        customer_id: customerId,
      });
  
      if (existingPoints.length === 0 || (existingPoints[0].points ?? 0) < points) {
        // MedusaError.Types.NOT_ALLOWED -> ForbiddenException (o BadRequest si prefieres 400)
        throw new ForbiddenException("Insufficient loyalty points");
      }
  
      return await this.updateLoyaltyPoints({
        id: existingPoints[0].id,
        points: (existingPoints[0].points ?? 0) - points,
      });
    }
  
    async getPoints(customerId: string): Promise<number> {
      const points = await this.listLoyaltyPoints({
        customer_id: customerId,
      });
  
      return points[0]?.points || 0;
    }
  
    async calculatePointsFromAmount(amount: number): Promise<number> {
      // Convert amount to points using a standard conversion rate
      // For example, $1 = 1 point
      // Round down to nearest whole point
      const points = Math.floor(amount);
  
      if (points < 0) {
        // MedusaError.Types.INVALID_DATA -> BadRequestException
        throw new BadRequestException("Amount cannot be negative");
      }
  
      return points;
    }
  
    async calculateCurrencyFromPoints(points: number): Promise<number> {
      // Convert points back to currency
      const POINTS_TO_CURRENCY_RATE = 1; // 1 point = $1
      return points * POINTS_TO_CURRENCY_RATE;
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
