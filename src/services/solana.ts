import {
  Connection,
  type Commitment,
  type SendOptions,
  type VersionedTransaction,
} from '@solana/web3.js';

export class SolanaService {
  constructor(private readonly connection: Connection) {}

  /** Send a signed VersionedTransaction and confirm it. */
  async sendAndConfirm(
    tx: VersionedTransaction,
    options?: SendOptions & { commitment?: Commitment },
  ): Promise<string> {
    const commitment = options?.commitment || 'confirmed';
    const signature = await this.connection.sendRawTransaction(
      tx.serialize(),
      {
        skipPreflight: options?.skipPreflight ?? false,
        maxRetries: options?.maxRetries ?? 3,
        preflightCommitment: commitment,
      },
    );

    await this.connection.confirmTransaction(signature, commitment);
    return signature;
  }

  /** Get the SOL balance (in SOL, not lamports) for a wallet address. */
  async getBalance(address: string): Promise<number> {
    const { PublicKey, LAMPORTS_PER_SOL } = await import('@solana/web3.js');
    const balance = await this.connection.getBalance(new PublicKey(address));
    return balance / LAMPORTS_PER_SOL;
  }
}
