import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClubApiService } from '../shared/club-api.service';

interface ClientsQuery {
  limit?: number;
  offset?: number;
}

@Injectable()
export class ClientsService {
  constructor(private readonly clubApi: ClubApiService) {}

  async fetchClients({ limit, offset }: ClientsQuery, authorization?: string) {
    const baseUrl = process.env.SIIN_API_BASE_URL || 'https://testing.clubhx.cl';
    const endpoint = '/api/v1/client/';
    if (!baseUrl) {
      throw new InternalServerErrorException('SIIN_API_BASE_URL no está definido');
    }

    try {
      const resp = await this.clubApi.request('get', endpoint, {
        baseURL: baseUrl,
        query: {
          ...(typeof limit === 'number' ? { limit } : {}),
          ...(typeof offset === 'number' ? { offset } : {}),
        },
        headers: {
          Accept: 'application/json',
          ...(authorization ? { Authorization: authorization } : {}),
        },
        useAuthHeader: authorization ? false : undefined,
      });

      if (resp.status === 200 && resp.data) return resp.data;
      throw new InternalServerErrorException('Fallo al obtener clientes desde SIIn');
    } catch {
      throw new InternalServerErrorException('No se pudo contactar al servicio de clientes');
    }
  }
}


