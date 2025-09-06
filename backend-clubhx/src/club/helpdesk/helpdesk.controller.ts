import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ClubApiService } from '../shared/club-api.service';

@Controller('helpdesk')
export class HelpdeskController {
  constructor(private readonly api: ClubApiService) {}

  @Get('/datatables_ticket_list/:query')
  async datatables(@Param('query') query: string, @Res() res: Response) {
    const upstream = await this.api.request(
      'get',
      `/helpdesk/datatables_ticket_list/${encodeURIComponent(query)}`,
    );
    return res.status(upstream.status).send(upstream.data);
  }

  @Get('/timeline_ticket_list/:query')
  async timeline(@Param('query') query: string, @Res() res: Response) {
    const upstream = await this.api.request(
      'get',
      `/helpdesk/timeline_ticket_list/${encodeURIComponent(query)}`,
    );
    return res.status(upstream.status).send(upstream.data);
  }
}


