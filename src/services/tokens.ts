import type { MemnrApiClient } from '../api/memnr-client.js';
import type { PaginatedResponse } from '../types/api.js';
import type { Token, TokenStats, TokenListParams } from '../types/token.js';

export class TokensService {
  constructor(private readonly api: MemnrApiClient) {}

  /** List tokens with pagination. */
  async list(params?: TokenListParams): Promise<PaginatedResponse<Token>> {
    return this.api.get<PaginatedResponse<Token>>('/api/sdk/tokens', { params });
  }

  /** Get a single token by mint address. */
  async getByAddress(address: string): Promise<Token> {
    return this.api.get<Token>(`/api/sdk/tokens/${address}`);
  }

  /** Get platform-wide stats. */
  async getStats(): Promise<TokenStats> {
    return this.api.get<TokenStats>('/api/sdk/tokens/stats');
  }
}
