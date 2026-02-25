export type LaunchType = 'PERMISSIONLESS' | 'HASHTAG';

export interface TokenVideo {
  tiktokVideoId: string;
  authorUsername: string;
  authorDisplayName: string;
  followerCount: number;
  caption: string;
  videoUrl: string;
  tiktokPageUrl: string;
  thumbnailUrl: string;
  likeCount: number;
  viewCount: number;
  cdnUnavailable: boolean;
}

export interface Token {
  tokenAddress: string;
  name: string;
  ticker: string;
  imageUrl: string;
  videoId: number;
  poolAddress: string | null;
  configKey: string | null;
  metadataUri: string | null;
  creatorUid: string | null;
  launchType: LaunchType | null;
  launcherAddress: string | null;
  price: number | null;
  priceChange24h: number | null;
  marketCap: number | null;
  volume24h: number | null;
  totalVolumeUsd: number | null;
  liquidity: number | null;
  holders: number | null;
  allTimeHigh: number | null;
  athTimestamp: string | null;
  feeShareConfig: string | null;
  feeShareAuthority: string | null;
  perTokenDbcConfig: string | null;
  isGraduated: boolean;
  graduatedAt: string | null;
  launchedAt: string;
  lastPollAt: string | null;
  video: TokenVideo;
}

export interface TokenStats {
  totalTokens: number;
  totalVolumeUsd: number;
  totalVolume24h: number;
  totalCreators: number;
  tokensLast24h: number;
}

export interface TokenListParams {
  page?: number;
  pageSize?: number;
  sortBy?: 'newest' | 'marketCap' | 'volume';
  cursor?: string;
}
