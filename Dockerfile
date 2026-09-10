FROM node:22-alpine AS build

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .

ARG VITE_POCKETBASE_URL
ARG VITE_AUDIO_STREAM_BASE
ENV VITE_POCKETBASE_URL=$VITE_POCKETBASE_URL
ENV VITE_AUDIO_STREAM_BASE=$VITE_AUDIO_STREAM_BASE
ENV DEPLOY_TARGET=static
RUN pnpm build

FROM caddy:2.10-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/build /srv

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/health >/dev/null || exit 1
