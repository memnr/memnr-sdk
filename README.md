# @memnr/sdk

TypeScript SDK for the [memnr](https://memnr.app) platform. Launch TikTok memecoins on Solana, read token data, and interact with on-chain fee share programs.

## Install

```bash
npm install @memnr/sdk @solana/web3.js
```

## Quick Start

```typescript
import { MemnrSDK } from '@memnr/sdk';
import { Connection, Keypair, VersionedTransaction } from '@solana/web3.js';

const sdk = new MemnrSDK('memnr_sk_...', new Connection('https://api.mainnet-beta.solana.com'));
const wallet = Keypair.fromSecretKey(/* ... */);

// List tokens
const { items } = await sdk.tokens.list({ sortBy: 'newest', pageSize: 10 });

// Preview a TikTok video
const preview = await sdk.tokenLaunch.previewVideo('https://tiktok.com/@user/video/123');

// Build launch transaction (server builds + partially signs)
const { launchId, transaction, poolAddress, dbcConfigKey, metadataUri } =
  await sdk.tokenLaunch.buildLaunchTransaction({
    videoUrl: 'https://tiktok.com/@user/video/123',
    payerAddress: wallet.publicKey.toBase58(),
    customTicker: 'MYTK',
  });

// Sign and send
const tx = VersionedTransaction.deserialize(Buffer.from(transaction, 'base64'));
tx.sign([wallet]);
const sig = await sdk.solana.sendAndConfirm(tx);

// Confirm with API
await sdk.tokenLaunch.confirmLaunch({
  launchId,
  signature: sig,
  poolAddress,
  dbcConfigKey,
  metadataUri,
});
```

## API Key

Get an API key at [memnr.app](https://memnr.app) after logging in. Keys are scoped to a wallet address and support rate limiting (default 60 req/min).

## Services

### `sdk.tokens`
- `list(params?)` — Paginated token list
- `getByAddress(address)` — Token detail
- `getStats()` — Platform-wide stats

### `sdk.tokenLaunch`
- `previewVideo(url)` — Preview a TikTok video
- `buildLaunchTransaction(params)` — Build an atomic launch tx
- `confirmLaunch(params)` — Confirm after signing + sending
- `getStatus(launchId)` — Check launch status

### `sdk.fees`
- `getClaimable()` — Claimable fee positions for the API key's wallet
- `buildClaim(tokenAddresses?)` — Build claim transaction(s)
- `getHistory()` — Fee claim history

### `sdk.state`
- `fetchFeeShareConfig(baseMint)` — Read on-chain FeeShareConfig
- `fetchMultipleFeeShareConfigs(baseMints)` — Batch read
- `getPDAs(baseMint)` — Derive PDA addresses

### `sdk.solana`
- `sendAndConfirm(tx, options?)` — Send + confirm a transaction
- `getBalance(address)` — SOL balance

## On-Chain Program

The fee share program is deployed at `MEM1FmjMd394WXGFx8yU5C5F5Q2oqLW3Ckyb2ADW9TT`. See [memnr-idl](https://github.com/memnr/memnr-idl) for the Anchor IDL.

## License

MIT
