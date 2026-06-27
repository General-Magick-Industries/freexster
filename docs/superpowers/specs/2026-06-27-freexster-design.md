# Freexster Design

Date: 2026-06-27
Status: Approved direction, pre-implementation
Working title: Freexster
Repository target: `General-Magick-Industries/freexster`

## North Star

Freexster aims to become a full trust network for private and public communications:

- private correspondence with SimpleX-style no-global-identifier privacy;
- public topic channels with verifiable provenance and stewardship;
- canister-backed registries for identities, channels, clients, and trust metadata;
- agent-ready identities, permissions, audit trails, and future wallets;
- public-good sustainability without positioning the project as a commercial extraction engine.

The project should be humble in tone. It can be community-oriented and public-good aligned without claiming to be a "gift" or overstating what the technology guarantees.

## V1 Product Shape

Freexster v1 is an inbox-first, desktop-first communications console with three connected surfaces:

1. Private inbox.
   - SimpleX-backed private correspondence through a local desktop runner/adapter.
   - Email-like structure: message requests, labels, filters, drafts, archive, search-ready metadata, optional subjects.
   - Chat-like immediacy: fast replies, threaded timelines, and private replies from public contexts.

2. Public topic channels.
   - Curated, approved public channels from day one.
   - Closer to Reddit-style durable topic spaces than X-style personal feeds.
   - Founder-stewarded launch with a visible "request a channel" path.
   - No permissionless channel creation until moderation, spam, and cycle costs are understood.

3. Trust layer.
   - ICP-backed registry for identities, user nodes, clients, channels, stewardship, verification, public posts, moderation metadata, and future agent identities.
   - Certified public reads where appropriate.
   - Privacy-preserving defaults for sensitive metadata.

Agents are designed into the information architecture but execution is deferred. The UI can include an Agents area and `@agent` affordance, but v1 does not depend on Claude, OpenAI, or custom agent integrations.

## V1 Includes

- Desktop app shell: Inbox, Channels, Replies, Agents, Wallet, Settings.
- Local SimpleX adapter boundary.
- Local encrypted storage for private inbox data.
- ICP registry canister.
- ICP public channel canister model.
- ICP-hosted homepage/download site.
- Public channel read and post flows for approved channels.
- Channel request flow.
- Author/channel verification display.
- Moderation and cost-control primitives.
- Design-ready agent permissions and audit model.

## V1 Excludes

- Permissionless channel creation.
- Full Claude/OpenAI/custom agent execution.
- Independent AI agent wallets/accounts.
- Mobile-first implementation.
- Claims that ICP canisters host the SimpleX client itself.
- Claims of official SimpleX affiliation.
- Claims that confidential subnets replace end-to-end encryption.

## Architecture

Freexster has four main layers.

### Desktop App

The desktop app is the primary v1 experience. It owns:

- private inbox UI;
- SimpleX local runner/client integration;
- local encrypted message store;
- drafts, labels, filters, archive, and search indexes;
- public channel reading/posting;
- channel request UI;
- identity and registry management;
- future-facing Agents, Wallet, and Settings surfaces.

Desktop-first is intentional because SimpleX runner integration is likely easiest there.

### SimpleX Local Adapter

Private communication should use a local SimpleX runner/adapter. The adapter boundary should make it possible to replace or upgrade the SimpleX integration without rewriting the app shell.

Freexster should not attempt to run the SimpleX client inside an ICP canister. Canisters are deterministic, message-driven WebAssembly services and are not a good fit for long-lived arbitrary networking or local private message handling. ICP should verify, publish, and coordinate trust, not become a plaintext mail server.

### ICP Canisters

ICP canisters provide public and verifiable infrastructure:

- registry canister;
- topic-channel canisters or channel modules;
- certified public post indexes;
- channel requests;
- moderation/stewardship state;
- canister-backed verification records;
- future encrypted settings and agent permissions.

Use confidential/SEV subnets where appropriate and available, especially for canisters handling sensitive user-node metadata. Treat them as defense-in-depth, not a substitute for end-to-end encryption or local privacy.

Use certified variables/Merkle proofs for public data that should be read quickly but verified cryptographically.

Use vetKeys selectively for encrypted user settings, channel applications, recovery flows, agent permissions, and future shared encrypted state. Do not use vetKeys for authentication; use Internet Identity/passkeys/wallet identity for that.

### Homepage And Web App

The public site should be ICP-hosted and likely use `nuosmagicko.com`.

The homepage should provide:

- desktop download first;
- later Android/iOS downloads when ready;
- project explanation;
- public topic channel reading;
- channel request entry point;
- registry/trust lookup;
- clear privacy boundaries.

The web app can support public and registry features, but the private SimpleX inbox requires the downloaded app.

## UX Direction

Freexster should feel useful before the user understands the architecture.

Influences to adopt:

- Gmail: labels, filters, archive, drafts, search, inbox ergonomics.
- Slack: channel clarity, professional information density, readable sidebars.
- Discord: persistent community spaces, roles, topic continuity.
- Reddit: topic-first public channels and durable threaded discussion.
- X: replies, repost references, public conversation flow.
- Proton Mail: privacy clarity, aliases/contact surface discipline, trust cues.
- Claude/OpenAI: future agent participation, task context, and conversational action patterns.
- OpenChat/ICP: wallet-native identity and on-chain ownership.

Avoid crypto-app weirdness. The tone should be calm, legible, and practical. Avoid a landing-page-first product; the first screen should be the actual app experience.

## Public Channel Launch Model

V1 public channels are curated and approved.

Launch posture:

- founder-stewarded channels first;
- visible public channel request path;
- explicit channel charters and posting rules;
- quotas and rate limits;
- moderation queue;
- cycle-cost monitoring;
- no permissionless channel creation until abuse and cost data justify it.

This allows Freexster to learn moderation and sustainability patterns before opening broad public write surfaces.

## Agents

Freexster should be agent-ready but not agent-led in v1.

V1 design model:

- Agents tab exists in the app shell.
- `@agent` affordance can appear in composers.
- Agent permissions are modeled from the start.
- Agent actions require auditability.
- User-controlled sub-letterboxes are part of the future model.
- Independent permissionless agent accounts are part of the north star, not v1.

Future model:

- user-controlled agent sub-letterboxes;
- Claude/OpenAI/custom/local agent integrations;
- independent agent identities;
- agent ICP wallets;
- agent public channels;
- scoped ecommerce and payment authority;
- provenance labels for agent-authored or agent-assisted content.

## Trust And Security

Freexster should make narrow, honest promises.

Private messages:

- stay off-chain;
- are handled by SimpleX/local app flows;
- keep SimpleX secrets and local inbox indexes on the user device;
- should not be stored as plaintext canister state.

Public data:

- is public, not private;
- should be certified where practical;
- includes channel posts, channel rules, author proofs, registry records, moderation actions, and repost references.

Canister security:

- reject anonymous callers on protected update methods;
- guard admin and moderation methods;
- quota all user-controlled storage;
- rate-limit public writes;
- monitor cycles and freezing thresholds;
- use backup controllers or governance for production;
- avoid storing secrets in canister state;
- do not rely on `inspect_message` as a security boundary.

Registry:

- maps principals to Freexster identities, user-node canisters, app signing keys, SimpleX contact proofs, channel roles, moderation authority, and future agent identities;
- should be append-auditable where useful;
- should avoid making sensitive social graphs public by default.

## Naming And Positioning

Working project title: Freexster.

Rationale:

- more ownable and distinctive than Freexer;
- carries the Free X social/public vibe without being only an X clone;
- can support nouns like Freexster channels, Freexster nodes, and Freexster agents.

Availability signals seen during brainstorming were encouraging but not definitive. Before launch, run registrar, trademark, app store, and package namespace checks.

Positioning:

- "private inbox + public topic channels + trust registry";
- not "official SimpleX";
- not "a crypto social app";
- not "GM's commercial messaging product";
- not "a gift" as headline language.

## Sustainability

Freexster should not be designed primarily to make money for General Magick Industries. It should still acknowledge that ICP cycles, hosting, builds, moderation, and support have real costs.

Possible sustainable models, only when needed:

- transparent donations or grants;
- community cycle sponsorship;
- channel stewardship budgets;
- optional paid high-volume public channels;
- future SNS/community governance if usage justifies it;
- mechanisms that make the public-good infrastructure stronger rather than extracting from users.

## Adversarial Review

### Risk: Building Five Products

Freexster could collapse under inbox, social, agents, wallet, and registry scope.

Mitigation: v1 is private inbox, curated public channels, and registry. Agents and wallets are designed into the model but mostly deferred.

### Risk: SimpleX Integration Complexity

Bundling or managing a SimpleX runner may be harder than expected.

Mitigation: desktop-first, isolate the SimpleX adapter, start with the smallest usable private-inbox flow, and keep the public/channel features useful even while SimpleX integration matures.

### Risk: Privacy Overclaims

Overstating SEV, vetKeys, ICP certification, or SimpleX guarantees would damage trust.

Mitigation: write privacy copy as precise boundaries: local/private, public/certified, encrypted/selective, confidential-subnet defense-in-depth.

### Risk: Spam And Moderation

Public channels invite abuse, noise, and cost attacks.

Mitigation: curated channels, manual approval, quotas, rate limits, moderation queue, cycle monitoring, and public channel charters.

### Risk: Canister Cost Growth

If public content or registry writes grow quickly, the project may need funding.

Mitigation: measure cycles from day one, add storage quotas, separate high-cost features, and publish a sustainability policy before costs become urgent.

### Risk: Centralized Control

If GM controls everything forever, the public-good positioning may feel hollow.

Mitigation: start founder-stewarded for safety, but publish a credible path toward steward councils, transparent governance, or SNS-style decentralization when usage warrants it.

### Risk: Trademark Or Brand Conflict

Freexster may conflict with existing marks or app names.

Mitigation: treat as working title until formal checks are complete.

### Risk: Agent Misbehavior

Future agents could leak data, impersonate users, post spam, or spend funds incorrectly.

Mitigation: agent permissions, visible provenance, user-controlled budgets, audit logs, default-off integrations, and no autonomous wallet authority in v1.

## Implementation Sequence

1. Repository and design spec.
2. Architecture plan.
3. Static ICP-hostable homepage/download concept.
4. Desktop app prototype shell.
5. Registry canister prototype.
6. Public curated channel prototype.
7. SimpleX local adapter proof of concept.
8. Trust/proof display.
9. End-to-end v1 private/public flow.
10. Agent model placeholders and audit UI.

Implementation should not start until this design spec is reviewed and the implementation plan is approved.

## Source Context

Important source context reviewed during brainstorming:

- SimpleX repository and docs: `https://github.com/simplex-chat/simplex-chat`
- ICP confidential subnet proposal signal: `https://dashboard.internetcomputer.org/proposal/142397`
- ICP subnet dashboard: `https://dashboard.internetcomputer.org/network/subnets`
- ICP vetKeys documentation: `https://docs.internetcomputer.org/concepts/vetkeys/`
- ICP certified variables guidance: `https://docs.internetcomputer.org/guides/backends/certified-variables/`
- Claude Tag / agent participation signal: `https://www.anthropic.com/news/introducing-claude-tag`
- ChatGPT Projects and Agent references: OpenAI help center
- Slack, Discord, X, WhatsApp, Gmail, Proton Mail, and OpenChat product references
