# Coolify deployment

The phone application is a static SPA served by Caddy. It talks directly to
public PocketBase and the public personal-audio gateway; it does not expose or
connect directly to the venue runner or TrackingBox.

## Create the resource

1. In Coolify, create a Docker Compose application from this repository.
2. Set the Compose location to `/apps/frontend/docker-compose.coolify.yml`.
3. Assign the `frontend` service an HTTPS domain using internal port `80`, for
   example `https://play.example.org:80`.
4. Add both variables below as build variables and deploy:

```env
VITE_POCKETBASE_URL=https://pocketbase.example.org
VITE_AUDIO_STREAM_BASE=https://audio.example.org
```

These values are deliberately public and baked into the browser bundle. Never
put PocketBase superuser credentials or the audio bridge bearer token here.

Verify `https://play.example.org/health`, then open the root URL and confirm it
redirects to a sticky `/p/seat-…` route. The Caddy fallback serves all player
routes through `index.html`.
