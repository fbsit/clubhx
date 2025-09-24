import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorEntity } from './entity/vendor';
import { VendorGoalEntity } from './entity/vendor-goal';
import { ClubApiService } from '../shared/club-api.service';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(VendorEntity) private readonly repo: Repository<VendorEntity>,
    @InjectRepository(VendorGoalEntity) private readonly goalRepo: Repository<VendorGoalEntity>,
    private readonly clubApi: ClubApiService,
  ) {}

  async list(authorization?: string): Promise<VendorEntity[]> {
    // Fetch from provider: /api/v1/person/ (requires auth header for scoping in provider)
    try {
      const headers = authorization
        ? { Authorization: authorization.startsWith('Bearer ') ? `Token ${authorization.slice(7)}` : authorization }
        : undefined;
      const resp = await this.clubApi.request('get', '/api/v1/person/', { headers, useAuthHeader: headers ? false : undefined });
      if (resp.status === 200 && Array.isArray(resp.data)) return resp.data as unknown as VendorEntity[];
    } catch {}
    // Fallback to local DB
    return this.repo.find();
  }

  async get(id: string): Promise<VendorEntity> {
    const v = await this.repo.findOne({ where: { id } });
    if (!v) throw new NotFoundException('Vendor not found');
    return v;
  }

  listGoals(vendorId: string): Promise<VendorGoalEntity[]> {
    return this.goalRepo.find({ where: { vendorId }, order: { created_at: 'DESC' } as any });
  }

  async setGoal(vendorId: string, period: string, salesTarget: number): Promise<VendorGoalEntity> {
    // Provider expects seller, year, month, goal
    const [yearStr, monthStr] = period.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    try {
      const resp = await this.clubApi.request('post', '/api/v1/sellerassignsalesgoal/', {
        body: { seller: vendorId, year, month, goal: salesTarget },
      });
      if (resp.status === 200 || resp.status === 201) {
        // Also persist locally for history
        const goal = this.goalRepo.create({ vendorId, period, salesTarget });
        return this.goalRepo.save(goal);
      }
      throw new InternalServerErrorException('Fallo al asignar meta en proveedor');
    } catch {
      throw new InternalServerErrorException('No se pudo contactar al servicio de metas');
    }
  }

  async setBulkGoals(vendorIds: string[], period: string, salesTarget: number): Promise<number> {
    const records = vendorIds.map((id) => this.goalRepo.create({ vendorId: id, period, salesTarget }));
    await this.goalRepo.save(records);
    return records.length;
  }
}


