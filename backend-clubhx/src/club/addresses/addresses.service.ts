import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerAddressEntity } from './address.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(CustomerAddressEntity)
    private readonly repo: Repository<CustomerAddressEntity>,
  ) {}

  list(customerId: string) {
    return this.repo.find({ where: { customerId }, order: { isDefault: 'DESC', updated_at: 'DESC' } });
  }

  async create(customerId: string, payload: Partial<CustomerAddressEntity>) {
    const toSave = this.repo.create({ ...payload, customerId, isDefault: Boolean(payload.isDefault) });
    const saved = await this.repo.save(toSave);
    if (saved.isDefault) {
      await this.repo.createQueryBuilder()
        .update(CustomerAddressEntity)
        .set({ isDefault: false })
        .where('customerId = :cid AND id != :id', { cid: customerId, id: saved.id })
        .execute();
    }
    return saved;
  }

  async update(id: string, payload: Partial<CustomerAddressEntity>) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Address not found');
    const updated = await this.repo.save({ ...existing, ...payload });
    if (payload.isDefault === true) {
      await this.repo.createQueryBuilder()
        .update(CustomerAddressEntity)
        .set({ isDefault: false })
        .where('customerId = :cid AND id != :id', { cid: updated.customerId, id: updated.id })
        .execute();
    }
    return updated;
  }

  async delete(id: string) {
    await this.repo.delete(id);
    return { success: true };
  }

  async setDefault(id: string) {
    const addr = await this.repo.findOne({ where: { id } });
    if (!addr) throw new NotFoundException('Address not found');
    await this.repo.update(id, { isDefault: true });
    await this.repo.createQueryBuilder()
      .update(CustomerAddressEntity)
      .set({ isDefault: false })
      .where('customerId = :cid AND id != :id', { cid: addr.customerId, id })
      .execute();
    return this.repo.findOne({ where: { id } });
  }
}


