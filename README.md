# Enter the Blackbox

Monorepo for the audience phone experience, the venue game Runner, the
personal-audio service, PocketBase persistence, and public deployment files.

## Layout

```text
apps/
  frontend/          Audience-facing SvelteKit application
  runner/            Venue game server, admin UI, tracking integration
services/
  audio/             Icecast, Liquidsoap, and authenticated audio bridge
  pocketbase/        Pinned PocketBase image and versioned schema migrations
deploy/
  coolify/           Public-internet deployment configuration
```

The Runner and TrackingBox stay on the venue network. Coolify hosts the phone
frontend, PocketBase, and the personal-audio stack.

Service-specific development and operations instructions live in each
directory's README.
