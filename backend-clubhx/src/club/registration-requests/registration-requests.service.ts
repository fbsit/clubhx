import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistrationRequestEntity } from './entity/registration-request';

@Injectable()
export class RegistrationRequestsService {
  constructor(@InjectRepository(RegistrationRequestEntity) private readonly repo: Repository<RegistrationRequestEntity>) {}

  create(body: Partial<RegistrationRequestEntity>) {
    const req = this.repo.create({ ...body, status: 'pending' });
    return this.repo.save(req);
  }

  list() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async approve(id: string, adminComments?: string) {
    const req = await this.repo.findOne({ where: { id } });
    if (!req) throw new NotFoundException('Request not found');
    req.status = 'approved';
    req.reviewedAt = new Date();
    req.reviewedBy = 'admin';
    req.adminComments = adminComments || null;
    return this.repo.save(req);
  }

  async reject(id: string, adminComments?: string) {
    const req = await this.repo.findOne({ where: { id } });
    if (!req) throw new NotFoundException('Request not found');
    req.status = 'rejected';
    req.reviewedAt = new Date();
    req.reviewedBy = 'admin';
    req.adminComments = adminComments || null;
    return this.repo.save(req);
  }
}


