import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VendorsService } from './vendors.service';

@Controller('api/v1/vendors')
export class VendorsController {
  constructor(private readonly service: VendorsService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Get(':id/goals')
  listGoals(@Param('id') id: string) {
    return this.service.listGoals(id);
  }

  @Post(':id/goals')
  setGoal(
    @Param('id') id: string,
    @Body() body: { period: string; salesTarget: number },
  ) {
    return this.service.setGoal(id, body.period, body.salesTarget);
  }

  @Post('goals/bulk')
  bulkGoals(@Body() body: { vendorIds: string[]; period: string; salesTarget: number }) {
    return this.service.setBulkGoals(body.vendorIds, body.period, body.salesTarget).then((updated) => ({ updated }));
  }
}


