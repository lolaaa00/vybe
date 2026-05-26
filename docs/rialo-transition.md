# Rialo Transition Plan

Vybe currently runs as a production-ready web app foundation on Next.js, Supabase, GitHub OAuth, Spotify OAuth, and an interim Base Sepolia chain configuration for future wallet/badge experiments.

Base Sepolia is only the temporary EVM test target. The durable product source of truth remains Supabase until Rialo exposes a public developer network and stable SDK/contracts.

## Interim Chain

- Network: Base Sepolia
- Chain ID: `84532`
- Hex chain ID: `0x14a34`
- RPC: `https://sepolia.base.org`
- Native currency: ETH

## Rialo Stack To Rebuild On

When Rialo is live for builders, Vybe should be rebuilt on this Rialo stack:

1. Rialo Omni Account for unified web2/web3 user identity and account abstraction.
2. Rialo IPC for identity, privacy, compliance, consent, and section-level disclosure rules.
3. Rialo Edge / native web calls for GitHub, Spotify, and future internet account data pulls without a fragile middleware tower.
4. Rialo Workflow and reactive/async transactions for scheduled platform refresh, passport regeneration, revocation, and notification workflows.
5. Rialo REX / confidential compute for private reputation scoring over sensitive connected-account data.
6. Rialo Stream or validator-attested data paths where a passport claim needs verifiable external data provenance.
7. Rialo Read Path for low-latency public passport reads and proof/status lookups.

## Migration Shape

- Keep the current Next.js UI.
- Keep Supabase as the web product database during the transition.
- Add an adapter layer only when Rialo has public SDK/API details.
- Move privacy-sensitive computation first, not the whole app at once.
- Later, move public claims, revocation state, attestations, and async refresh workflows onto Rialo.
