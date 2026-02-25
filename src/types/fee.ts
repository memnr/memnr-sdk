export interface ClaimablePosition {
  tokenAddress: string;
  ticker: string;
  available: number;
  totalEarned: number;
  totalClaimed: number;
  isGraduated: boolean;
  isExpired: boolean;
  expiresAt: string | null;
}

export interface ClaimableResponse {
  totalClaimable: number;
  positions: ClaimablePosition[];
}

export interface ClaimResponse {
  transactions: string[];
  estimatedAmount: number;
}

export interface FeeClaimRecord {
  id: number;
  signature: string;
  dbcAmount: number;
  dammAmount: number;
  totalAmount: number;
  createdAt: string;
}

export interface FeeShareConfigData {
  baseMint: string;
  authorityBump: number;
  configBump: number;
  admin: string;
  creator: string;
  creatorBps: number;
  dbcPool: string;
  dbcConfig: string;
  dammV2Pool: string;
  partnerLpNftMint: string;
  isGraduated: boolean;
  totalHarvestedLamports: bigint;
  creatorEarnedLamports: bigint;
  creatorClaimedLamports: bigint;
  platformClaimedLamports: bigint;
  lastHarvestAt: bigint;
  expiryDurationSeconds: bigint;
  createdAt: bigint;
}

export interface ClaimableAmounts {
  creatorAvailable: number;
  platformAvailable: number;
  totalHarvested: number;
  isExpired: boolean;
  expiresAt: Date | null;
}
