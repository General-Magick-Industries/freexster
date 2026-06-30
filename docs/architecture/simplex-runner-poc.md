# SimpleX Runner POC

Freexster's first SimpleX integration checks readiness for a local SimpleX CLI runner. It does not read messages, send messages, manage SimpleX profiles, or start/stop `simplex-chat`.

Sources:

- SimpleX CLI docs: https://simplex.chat/docs/cli.html
- SimpleX bot API docs: https://github.com/simplex-chat/simplex-chat/blob/stable/bots/README.md

## Configuration

- `FREEXSTER_SIMPLEX_CHAT_PATH`: optional path to `simplex-chat` or `simplex-chat.exe`.
- `FREEXSTER_SIMPLEX_CHAT_PORT`: optional port, default `5225`.
- Start SimpleX separately with `simplex-chat -p 5225`.

Freexster probes `ws://127.0.0.1:<port>` by checking whether the local TCP port accepts a connection. The settings surface displays the configured URL, binary path state, and local startup command.

## Security Boundary

The SimpleX CLI WebSocket API is treated as unauthenticated local infrastructure. Freexster only probes `127.0.0.1` and does not accept a remote host in this slice.

## Out Of Scope

- Sending or reading SimpleX messages.
- Starting or killing SimpleX processes.
- Managing SimpleX profiles or databases.
- Exposing SimpleX APIs to the hosted web build.
- Remote SimpleX WebSocket hosts.

## Next Slice

The next SimpleX slice should add a user-approved command bridge with a typed request/response model, explicit localhost-only enforcement, and tests around command serialization before any inbox messages are displayed from a real SimpleX profile.
