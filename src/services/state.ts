import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { FEE_SHARE_PROGRAM_ID, FEE_SHARE_CONFIG_SEED, FEE_SHARE_AUTHORITY_SEED } from '../constants.js';
import type { FeeShareConfigData, ClaimableAmounts } from '../types/fee.js';

const programId = new PublicKey(FEE_SHARE_PROGRAM_ID);

/** Derive the FeeShareConfig PDA for a given base mint. */
export function deriveFeeShareConfig(baseMint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(FEE_SHARE_CONFIG_SEED), baseMint.toBuffer()],
    programId,
  );
}

/** Derive the FeeShareAuthority PDA for a given base mint. */
export function deriveFeeShareAuthority(baseMint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(FEE_SHARE_AUTHORITY_SEED), baseMint.toBuffer()],
    programId,
  );
}

/** Parse a FeeShareConfig account's raw data buffer. */
export function parseFeeShareConfig(data: Buffer): FeeShareConfigData {
  let offset = 8; // skip discriminator

  const baseMint = new PublicKey(data.subarray(offset, offset + 32)).toBase58();
  offset += 32;

  const authorityBump = data.readUInt8(offset);
  offset += 1;

  const configBump = data.readUInt8(offset);
  offset += 1;

  const admin = new PublicKey(data.subarray(offset, offset + 32)).toBase58();
  offset += 32;

  const creator = new PublicKey(data.subarray(offset, offset + 32)).toBase58();
  offset += 32;

  const creatorBps = data.readUInt16LE(offset);
  offset += 2;

  const dbcPool = new PublicKey(data.subarray(offset, offset + 32)).toBase58();
  offset += 32;

  const dbcConfig = new PublicKey(data.subarray(offset, offset + 32)).toBase58();
  offset += 32;

  const dammV2Pool = new PublicKey(data.subarray(offset, offset + 32)).toBase58();
  offset += 32;

  const partnerLpNftMint = new PublicKey(data.subarray(offset, offset + 32)).toBase58();
  offset += 32;

  const isGraduated = data.readUInt8(offset) !== 0;
  offset += 1;

  const totalHarvestedLamports = data.readBigUInt64LE(offset);
  offset += 8;

  const creatorEarnedLamports = data.readBigUInt64LE(offset);
  offset += 8;

  const creatorClaimedLamports = data.readBigUInt64LE(offset);
  offset += 8;

  const platformClaimedLamports = data.readBigUInt64LE(offset);
  offset += 8;

  const lastHarvestAt = data.readBigInt64LE(offset);
  offset += 8;

  const expiryDurationSeconds = data.readBigInt64LE(offset);
  offset += 8;

  const createdAt = data.readBigInt64LE(offset);

  return {
    baseMint,
    authorityBump,
    configBump,
    admin,
    creator,
    creatorBps,
    dbcPool,
    dbcConfig,
    dammV2Pool,
    partnerLpNftMint,
    isGraduated,
    totalHarvestedLamports,
    creatorEarnedLamports,
    creatorClaimedLamports,
    platformClaimedLamports,
    lastHarvestAt,
    expiryDurationSeconds,
    createdAt,
  };
}

/** Compute claimable amounts from a parsed FeeShareConfig. */
export function getClaimableAmount(config: FeeShareConfigData): ClaimableAmounts {
  const creatorAvailable =
    Number(config.creatorEarnedLamports - config.creatorClaimedLamports) / LAMPORTS_PER_SOL;

  const platformTotal =
    Number(config.totalHarvestedLamports) - Number(config.creatorEarnedLamports);
  const platformAvailable =
    (platformTotal - Number(config.platformClaimedLamports)) / LAMPORTS_PER_SOL;

  const totalHarvested = Number(config.totalHarvestedLamports) / LAMPORTS_PER_SOL;

  const now = Math.floor(Date.now() / 1000);
  const expiryTimestamp =
    Number(config.lastHarvestAt) + Number(config.expiryDurationSeconds);
  const isExpired = now > expiryTimestamp;
  const expiresAt = expiryTimestamp > 0 ? new Date(expiryTimestamp * 1000) : null;

  return {
    creatorAvailable: Math.max(0, creatorAvailable),
    platformAvailable: Math.max(0, platformAvailable),
    totalHarvested,
    isExpired,
    expiresAt,
  };
}

export class StateService {
  constructor(private readonly connection: Connection) {}

  /** Fetch and parse a FeeShareConfig from chain by base mint address. */
  async fetchFeeShareConfig(baseMint: PublicKey): Promise<FeeShareConfigData | null> {
    const [configPda] = deriveFeeShareConfig(baseMint);
    const accountInfo = await this.connection.getAccountInfo(configPda);
    if (!accountInfo) return null;
    return parseFeeShareConfig(accountInfo.data as Buffer);
  }

  /** Batch-fetch multiple FeeShareConfig accounts. */
  async fetchMultipleFeeShareConfigs(
    baseMints: PublicKey[],
  ): Promise<(FeeShareConfigData | null)[]> {
    const pdas = baseMints.map((m) => deriveFeeShareConfig(m)[0]);
    const accounts = await this.connection.getMultipleAccountsInfo(pdas);
    return accounts.map((acc) => {
      if (!acc) return null;
      return parseFeeShareConfig(acc.data as Buffer);
    });
  }

  /** Derive + return PDA addresses for a given base mint. */
  getPDAs(baseMint: PublicKey) {
    const [config, configBump] = deriveFeeShareConfig(baseMint);
    const [authority, authorityBump] = deriveFeeShareAuthority(baseMint);
    return { config, configBump, authority, authorityBump };
  }
}
