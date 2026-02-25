export type LaunchStatus = 'PENDING' | 'PAID' | 'LAUNCHING' | 'LAUNCHED' | 'FAILED';

export interface VideoPreview {
  tiktokVideoId: string;
  authorUsername: string;
  authorDisplayName: string;
  thumbnailUrl: string;
  caption: string;
  viewCount: number;
  likeCount: number;
  tiktokPageUrl: string;
  suggestedName: string;
  suggestedTicker: string;
  suggestedDescription: string;
}

export interface BuildLaunchParams {
  videoUrl: string;
  payerAddress?: string;
  customName?: string;
  customTicker?: string;
  customDescription?: string;
  customWebsite?: string;
  customTwitter?: string;
  devBuySol?: number;
}

export interface BuildLaunchResponse {
  launchId: number;
  transaction: string;
  mintAddress: string;
  poolAddress: string;
  dbcConfigKey: string;
  metadataUri: string;
  imageUrl: string;
  blockhash: string;
}

export interface ConfirmLaunchParams {
  launchId: number;
  signature: string;
  poolAddress: string;
  metadataUri: string;
  dbcConfigKey: string;
  imageUrl?: string;
}

export interface ConfirmLaunchResponse {
  status: 'LAUNCHED';
  tokenAddress: string;
  signature: string;
}

export interface LaunchStatusResponse {
  id: number;
  status: LaunchStatus;
  tokenAddress: string | null;
  errorMessage: string | null;
  type: string;
}
