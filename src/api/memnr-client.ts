import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { DEFAULT_API_URL } from '../constants.js';

export class MemnrApiClient {
  private readonly http: AxiosInstance;

  constructor(apiKey: string, baseURL?: string) {
    this.http = axios.create({
      baseURL: baseURL || DEFAULT_API_URL,
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 60_000,
    });
  }

  async get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.http.get<T>(path, config);
    return res.data;
  }

  async post<T>(path: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.http.post<T>(path, body, config);
    return res.data;
  }

  async delete<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.http.delete<T>(path, config);
    return res.data;
  }
}
