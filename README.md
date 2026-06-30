# Freexster

Freexster is a working-title project for an inbox-first, desktop-first communications app built around SimpleX private messaging and ICP-backed public trust infrastructure.

The north star is a full trust network for private correspondence, curated public topic channels, verified identities, future agent participation, and public-good sustainability. The first version stays deliberately smaller: private inbox, curated public channels, and a canister-backed registry/verification layer.

Status: tested React/Tauri foundation slice implemented; SimpleX local runner readiness probe implemented; production messaging/ICP deployment flow still pending.

## Initial Direction

- Desktop app first.
- Private messages through a local SimpleX runner/adapter.
- Public topic channels through ICP canisters.
- ICP-hosted homepage and download site, likely under `nuosmagicko.com`.
- Agents designed into the identity/permission model, with execution deferred.
- Public channel creation curated at launch, with a visible request path.

See the design spec in `docs/superpowers/specs/2026-06-27-freexster-design.md`.

## First Implementation Slice

The first implementation slice builds a tested React/Tauri foundation with mocked SimpleX and ICP adapters. It is not yet a production private messenger or deployed ICP dapp.

Run locally:

```powershell
npm install
npm test
npm run build
npm run tauri dev
```

See `docs/architecture/foundation-boundaries.md` for what is real versus mocked in this slice.

## SimpleX Runner POC

The desktop app can inspect local readiness for a SimpleX CLI runner on `127.0.0.1`. This is a status probe only; Freexster does not start SimpleX or send/read messages yet.

Optional local configuration:

```powershell
$env:FREEXSTER_SIMPLEX_CHAT_PATH="C:\path\to\simplex-chat.exe"
$env:FREEXSTER_SIMPLEX_CHAT_PORT="5225"
simplex-chat -p 5225
```

See `docs/architecture/simplex-runner-poc.md` for the security boundary and next bridge plan.
