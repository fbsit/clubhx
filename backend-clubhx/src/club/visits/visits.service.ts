import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { VisitEntity } from './entity/visit';
import { ClubApiService } from '../shared/club-api.service';

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(VisitEntity) private readonly repo: Repository<VisitEntity>,
    private readonly clubApi: ClubApiService,
  ) {}

  async list(params: { from?: string; to?: string; salesPersonId?: string; customerId?: string; seller?: string }) {
    // New: fetch real agenda from provider when seller is provided
    if (params.seller || params.salesPersonId) {
      const seller = params.seller || params.salesPersonId;
      try {
        const resp = await this.clubApi.request('get', '/api/v1/clientvisit/', {
          query: { seller },
        });
        if (resp.status === 200) return resp.data as unknown as VisitEntity[];
        throw new InternalServerErrorException('Fallo al obtener agenda de visitas');
      } catch {
        throw new InternalServerErrorException('No se pudo contactar al servicio de visitas');
      }
    }

    // Legacy/local fallback if no seller param provided
    const where: any = {};
    if (params.salesPersonId) where.salesPersonId = params.salesPersonId;
    if (params.customerId) where.customerId = params.customerId;
    if (params.from && params.to) where.date = Between(new Date(params.from), new Date(params.to));
    return this.repo.find({ where, order: { date: 'ASC' } });
  }

  create(payload: Partial<VisitEntity>) {
    const v = this.repo.create({ ...payload, date: payload.date ? new Date(payload.date as any) : new Date() } as any);
    return this.repo.save(v);
  }

  async update(id: string, patch: Partial<VisitEntity>) {
    await this.repo.update(id, patch as any);
    return this.repo.findOne({ where: { id } });
  }

  delete(id: string) {
    return this.repo.delete(id).then(() => undefined);
  }
}


