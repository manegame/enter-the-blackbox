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
  trackingbox/       Camera/mock tracking, GIDs, floor projection, and zones
deploy/
  coolify/           Public-internet deployment configuration
```

The Runner and TrackingBox stay on the venue network. Coolify hosts the phone
frontend, PocketBase, and the personal-audio stack. TrackingBox is imported at
the Runner's validated upstream commit `95d0928`.

Service-specific development and operations instructions live in each
directory's README.

## Run locally

Use Python 3.11. With pyenv, install the committed version once:

```bash
pyenv install -s 3.11.13
make setup
```

Then keep these running in separate terminals from the monorepo root:

```bash
make tracking   # synthetic audience; no camera or GPU
make runner     # venue game server and admin UI on :8100
```

For a real performance, first install TrackingBox's ML dependencies and pass
the calibrated venue configuration:

```bash
make tracking-ml
make tracking TRACKER_CONFIG=/absolute/path/to/venue-config.json
```

## Deploy

The canonical public deployment is
[`deploy/coolify/docker-compose.yml`](deploy/coolify/docker-compose.yml). It
builds the frontend, PocketBase, Icecast, Liquidsoap, and the audio bridge from
this repository. See [`deploy/coolify/README.md`](deploy/coolify/README.md) for
the required domains, secrets, persistent volumes, and migration procedure.

## Imported history

The full histories of `blackbox-frontend`, `blackbox-runner`,
`blacbox-ice-soap-snake`, and TrackingBox through the pinned revision remain
reachable in this repository. The former repositories are retained as
migration sources and should be archived after the monorepo deployment has
been verified.
