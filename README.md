# Vybe

Vybe is an internet passport app. Users authenticate with Supabase, connect real accounts like GitHub, Spotify, X, and Discord, generate saved passport sections from connected data, control section privacy, and share a public passport page.

## Local Setup

1. Install dependencies:

```bash
npm.cmd install
```

2. Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
TOKEN_ENCRYPTION_KEY=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/oauth/spotify/callback
X_CLIENT_ID=
X_CLIENT_SECRET=
X_REDIRECT_URI=http://localhost:3000/api/oauth/x/callback
X_SCOPES=tweet.read users.read follows.read offline.access
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_REDIRECT_URI=http://localhost:3000/api/oauth/discord/callback
DISCORD_SCOPES=identify connections guilds
NEXT_PUBLIC_CHAIN_NAME=Base Sepolia
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_CHAIN_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_CHAIN_EXPLORER_URL=https://sepolia.basescan.org
```

3. Apply the Supabase migrations in `migrations/` in order.

4. Configure Supabase Auth with Google as a provider and add:

```txt
http://localhost:3000/auth/callback
```

as an allowed redirect URL.

5. Configure OAuth app callback URLs:

```txt
GitHub:  http://localhost:3000/api/oauth/github/callback
Spotify: http://localhost:3000/api/oauth/spotify/callback
X:       http://localhost:3000/api/oauth/x/callback
Discord: http://localhost:3000/api/oauth/discord/callback
```

6. Run the app:

```bash
npm.cmd run dev
```

## Verification

```bash
npm.cmd run lint
npm.cmd run build
npm.cmd test
```

## Privacy Model

Passport sections can be `public`, `private`, or `hidden`.

Public passport pages only load sections where `visibility = public` and the owner has enabled public sharing. Connected account tokens are stored in encrypted server-only columns and are not selected by browser clients.

## Interim Chain

Vybe is configured for Base Sepolia as the temporary EVM test chain for wallet and badge experiments. The current product source of truth remains Supabase until Rialo exposes a public developer network. See `docs/rialo-transition.md`.
