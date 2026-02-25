import type { MemnrApiClient } from '../api/memnr-client.js';
import type { ApiResponse } from '../types/api.js';
import type {
  VideoPreview,
  BuildLaunchParams,
  BuildLaunchResponse,
  ConfirmLaunchParams,
  ConfirmLaunchResponse,
  LaunchStatusResponse,
} from '../types/launch.js';

export class TokenLaunchService {
  constructor(private readonly api: MemnrApiClient) {}

  /** Preview a TikTok video — fetches metadata and suggests token name/ticker. */
  async previewVideo(videoUrl: string): Promise<VideoPreview> {
    const res = await this.api.post<ApiResponse<VideoPreview>>('/api/sdk/launch/preview', { videoUrl });
    return res.data!;
  }

  /**
   * Build an atomic launch transaction.
   * The server builds the tx, partially signs it (platform authority + mint keypair),
   * and returns it for the caller to add their signature and send.
   */
  async buildLaunchTransaction(params: BuildLaunchParams): Promise<BuildLaunchResponse> {
    const res = await this.api.post<ApiResponse<BuildLaunchResponse>>('/api/sdk/launch/build-tx', params);
    return res.data!;
  }

  /**
   * Confirm a launch after the user has signed and sent the transaction.
   * This verifies the on-chain tx, initializes fee-share config, and creates the token record.
   */
  async confirmLaunch(params: ConfirmLaunchParams): Promise<ConfirmLaunchResponse> {
    const res = await this.api.post<ApiResponse<ConfirmLaunchResponse>>('/api/sdk/launch/confirm', params);
    return res.data!;
  }

  /** Check the status of a launch by ID. */
  async getStatus(launchId: number): Promise<LaunchStatusResponse> {
    const res = await this.api.get<ApiResponse<LaunchStatusResponse>>(`/api/sdk/launch/${launchId}/status`);
    return res.data!;
  }
}
