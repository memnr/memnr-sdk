import { Connection, type Commitment } from '@solana/web3.js';
import { MemnrApiClient } from './api/memnr-client.js';
import { TokensService } from './services/tokens.js';
import { TokenLaunchService } from './services/token-launch.js';
import { FeesService } from './services/fees.js';
import { StateService } from './services/state.js';
import { SolanaService } from './services/solana.js';

export interface MemnrSDKOptions {
  /** Override the default API base URL. */
  apiUrl?: string;
  /** Solana commitment level. Default: 'confirmed'. */
  commitment?: Commitment;
}

export class MemnrSDK {
  /** Token list, detail, and stats (read-only). */
  readonly tokens: TokensService;

  /** Preview videos, build launch transactions, and confirm launches. */
  readonly tokenLaunch: TokenLaunchService;

  /** Check claimable fee positions and build claim transactions. */
  readonly fees: FeesService;

  /** On-chain PDA derivation and FeeShareConfig reads. */
  readonly state: StateService;

  /** Solana send/confirm helpers. */
  readonly solana: SolanaService;

  constructor(
    apiKey: string,
    connection: Connection,
    options?: MemnrSDKOptions,
  ) {
    const api = new MemnrApiClient(apiKey, options?.apiUrl);
    this.tokens = new TokensService(api);
    this.tokenLaunch = new TokenLaunchService(api);
    this.fees = new FeesService(api);
    this.state = new StateService(connection);
    this.solana = new SolanaService(connection);
  }
}
