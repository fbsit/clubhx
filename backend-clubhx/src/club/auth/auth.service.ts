import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { ClubApiService } from '../shared/club-api.service';

@Injectable()
export class AuthService {
  constructor(private readonly clubApi: ClubApiService) {}

  /**
   * Forwards credentials to external SII auth API and returns token
   */
  async login({ username, password }: LoginDto): Promise<{ token: string }> {
    const baseUrl = process.env.CLUB_API_BASE_URL || 'https://testing.clubhx.cl';
    const endpoint = '/api/auth-token/';

    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      const response = await this.clubApi.request<{ token?: string }>('post', endpoint, {
        baseURL: baseUrl || undefined,
        body: params.toString(),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        // Auth token endpoint debe ir sin Authorization por defecto
        useAuthHeader: false,
      });

      if (response.status === 200 && response.data?.token) {
        return { token: response.data.token };
      }

      if (response.status === 400 || response.status === 401) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      throw new InternalServerErrorException('Fallo al autenticar con SIIn');
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('No se pudo contactar al servicio de autenticación');
    }
  }
}


