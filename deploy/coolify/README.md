# Coolify deployment

This Compose resource deploys every public component from the monorepo. The
venue Runner and TrackingBox remain private and connect outbound.

## Create the resource

1. In Coolify, create a Docker Compose resource from this repository.
2. Set the Compose file to `/deploy/coolify/docker-compose.yml`.
3. Copy the variables from `deploy/coolify/.env.example` into Coolify. Replace
   every placeholder secret and set the real PocketBase and audio domains.
   Set `ICECAST_HOSTNAME` to the audio domain's hostname only, for example
   `audio.example.org` (no `https://`, path, or port).
4. Assign HTTPS domains to:
   - `frontend`, internal port `80`, for example `play.example.org`;
   - `pocketbase`, internal port `8090`, for example `pb.example.org`;
   - `bridge`, internal port `8090`, for example `audio.example.org`.
5. Keep `icecast` and `liquidsoap` private. Do not assign them domains.
6. Ensure both `pocketbase-data` and `audio-data` are persistent and backed up.
7. Deploy.

PocketBase applies every pending file in
`services/pocketbase/pb_migrations/` during startup. On a fresh volume, create
the first superuser once from the PocketBase service terminal:

```bash
/pb/pocketbase superuser upsert admin@example.com 'replace-with-a-long-password' --dir=/pb/pb_data
```

When adopting an existing PocketBase deployment, back up and attach its current
data volume at `/pb/pb_data` before the first monorepo deployment. The baseline
migration preserves existing collections and records.

## Connect the venue Runner

Set the following in `apps/runner/.env`:

```env
POCKETBASE_URL=https://pb.example.org
POCKETBASE_ADMIN_EMAIL=admin@example.com
POCKETBASE_ADMIN_PASSWORD=<superuser-password>
AUDIO_BRIDGE_URL=https://audio.example.org
AUDIO_PUBLIC_URL=https://audio.example.org
AUDIO_BRIDGE_TOKEN=<same-BRIDGE_TOKEN-as-Coolify>
```

## Verify

```bash
curl https://play.example.org/health
curl https://pb.example.org/api/health
curl https://audio.example.org/health
curl -H "Authorization: Bearer $BRIDGE_TOKEN" https://audio.example.org/status
```
