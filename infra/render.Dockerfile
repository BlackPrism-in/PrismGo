# PrismGo on one service (Render): the API also serves the web app (WEB_DIST_DIR).
# Build from the repo root:  docker build -f infra/render.Dockerfile .
FROM node:22-bookworm-slim AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH
RUN corepack enable && apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /repo

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/web/package.json apps/web/
COPY apps/api/package.json apps/api/prisma.config.ts apps/api/
COPY apps/api/prisma apps/api/prisma
RUN pnpm install --frozen-lockfile --filter @prismgo/api... --filter @prismgo/web...
COPY packages/shared packages/shared
COPY apps/api apps/api
COPY apps/web apps/web
# Browser-side keys are public by nature; restrict them by domain in the provider console.
ARG VITE_GOOGLE_MAPS_API_KEY=""
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
RUN pnpm --filter @prismgo/shared build && pnpm --filter @prismgo/api build && pnpm --filter @prismgo/web build
RUN pnpm --filter @prismgo/api deploy --prod --legacy /out \
  && cp -r apps/api/dist apps/api/prisma apps/api/prisma.config.ts apps/api/scripts /out/ \
  && mkdir -p /out/src/tracking && cp -r apps/api/src/generated /out/src/ \
  && cp -r apps/api/src/tracking/vendor /out/src/tracking/ \
  && cp -r apps/web/dist /out/web \
  && cp apps/api/docker-entrypoint.sh /out/

FROM base AS runtime
ENV NODE_ENV=production PRISMA_HIDE_UPDATE_MESSAGE=1 WEB_DIST_DIR=/app/web
WORKDIR /app
COPY --from=build /out ./
RUN chmod +x docker-entrypoint.sh && chown -R node:node /app
USER node
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
