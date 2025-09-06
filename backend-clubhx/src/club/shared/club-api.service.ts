import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ClubApiService {
  private readonly logger = new Logger(ClubApiService.name);
  private readonly defaultBaseUrl =
    process.env.CLUB_API_BASE_URL ?? 'https://testing.clubhx.cl';
  // Remove hardcoded default token; require explicit Authorization header per request
  private readonly defaultAuthHeader: string | undefined = process.env.CLUB_API_TOKEN || undefined;

  constructor(private readonly http: HttpService) {}

  async request<T = unknown>(
    method: AxiosRequestConfig['method'],
    path: string,
    options: {
      query?: Record<string, string | number | boolean | null | undefined>;
      body?: unknown;
      headers?: Record<string, string | ReadonlyArray<string>>;
      baseURL?: string;
      useAuthHeader?: boolean; // allow disabling default Authorization header
    } = {},
  ): Promise<AxiosResponse<T>> {
    const { query, body, headers, baseURL, useAuthHeader } = options;
    const config: AxiosRequestConfig = {
      method,
      url: path,
      params: query,
      data: body,
      headers: {
        ...(useAuthHeader === false || !this.defaultAuthHeader
          ? {}
          : { Authorization: this.defaultAuthHeader }),
        ...(headers ?? {}),
      },
      baseURL: baseURL ?? this.defaultBaseUrl,
      withCredentials: true,
      validateStatus: () => true,
    };

    this.logger.debug(
      `Outbound ${method?.toUpperCase()} ${config.baseURL ?? ''}${path}`,
    );

    const response = await firstValueFrom(this.http.request<T>(config));
    return response;
  }
}
