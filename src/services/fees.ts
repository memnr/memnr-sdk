import type { MemnrApiClient } from '../api/memnr-client.js';
import type { ApiResponse } from '../types/api.js';
import type { ClaimableResponse, ClaimResponse, FeeClaimRecord } from '../types/fee.js';

export class FeesService {
  constructor(private readonly api: MemnrApiClient) {}

  /** Get claimable fee positions for the API key's wallet. */
  async getClaimable(): Promise<ClaimableResponse> {
    const res = await this.api.get<ApiResponse<ClaimableResponse>>('/api/sdk/fees/claimable');
    return res.data!;
  }

  /**
   * Build claim transaction(s) for the API key's wallet.
   * Returns base64-encoded transactions that need to be signed and sent.
   */
  async buildClaim(tokenAddresses?: string[]): Promise<ClaimResponse> {
    const res = await this.api.post<ApiResponse<ClaimResponse>>('/api/sdk/fees/claim', {
      tokenAddresses,
    });
    return res.data!;
  }

  /** Get fee claim history. */
  async getHistory(): Promise<FeeClaimRecord[]> {
    const res = await this.api.get<ApiResponse<FeeClaimRecord[]>>('/api/sdk/fees/history');
    return res.data!;
  }
}
