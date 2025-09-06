import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingZoneEntity } from './entity/shipping-zone';

@Injectable()
export class ShippingZonesService {
  constructor(@InjectRepository(ShippingZoneEntity) private readonly repo: Repository<ShippingZoneEntity>) {}

  list() {
    return this.repo.find();
  }

  create(body: Partial<ShippingZoneEntity>) {
    const zone = this.repo.create({ ...body });
    return this.repo.save(zone);
  }

  async update(id: string, body: Partial<ShippingZoneEntity>) {
    const exists = await this.repo.findOne({ where: { id } });
    if (!exists) throw new NotFoundException('Zone not found');
    await this.repo.update(id, body as any);
    return this.repo.findOne({ where: { id } });
  }

  async toggle(id: string, active: boolean) {
    await this.repo.update(id, { active } as any);
    return this.repo.findOne({ where: { id } });
  }

  delete(id: string) {
    return this.repo.delete(id).then(() => undefined);
  }
}


