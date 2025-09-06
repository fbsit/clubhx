import { Body, Controller, Get, Param, Post } from '@nestjs/common';

type CreditLimitRequest = {
  id: string;
  customerId: string;
  customerName: string;
  requestedBy: string;
  requestedByName?: string;
  requestedLimit: number;
  status: 'pending' | 'approved' | 'rejected';
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedByName?: string;
  requestDate: string;
  reviewDate?: string;
};

const requests: CreditLimitRequest[] = [];

@Controller('api/v1/credit-requests')
export class CreditRequestsController {
  @Get()
  list() {
    return requests;
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return requests.find((r) => r.id === id);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string, @Body('notes') notes?: string) {
    const r = requests.find((x) => x.id === id);
    if (!r) return { id };
    r.status = 'approved';
    r.reviewNotes = notes;
    r.reviewDate = new Date().toISOString().split('T')[0];
    r.reviewedBy = 'admin';
    r.reviewedByName = 'Administrador';
    return r;
  }

  @Post(':id/reject')
  reject(@Param('id') id: string, @Body('notes') notes?: string) {
    const r = requests.find((x) => x.id === id);
    if (!r) return { id };
    r.status = 'rejected';
    r.reviewNotes = notes;
    r.reviewDate = new Date().toISOString().split('T')[0];
    r.reviewedBy = 'admin';
    r.reviewedByName = 'Administrador';
    return r;
  }
}


