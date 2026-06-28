# Freexster Foundation Boundaries

This document records the implementation boundary of the first Freexster vertical slice.

## Real In This Slice

- React desktop-first app shell.
- Homepage surface for download and public trust copy.
- Deterministic domain model and fixtures.
- Mock Freexster client with adapter interfaces.
- Tauri desktop wrapper.
- Native status command returning mocked desktop status.
- Channel request flow that records requests without creating public channels.

## Mocked In This Slice

- SimpleX runner connection.
- ICP registry.
- Certified public reads.
- Public channel canisters.
- Confidential subnet deployment.
- vetKeys.
- Agent execution.

## Product Boundaries Preserved

- Private messages are represented as local SimpleX-backed threads.
- Public channels are curated and approved.
- Channel requests do not create channels automatically.
- Agents are visible in the information architecture but disabled for execution.
- The trust panel separates SimpleX route status, registry status, and channel stewardship.

## Next Implementation Plans

- SimpleX local runner proof of concept.
- ICP registry canister prototype.
- ICP public channel canister prototype.
- Certified variable verification in the frontend.
- vetKeys encrypted settings prototype.
- Desktop installer and update pipeline.
