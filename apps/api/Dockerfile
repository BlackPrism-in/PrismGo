# PrismGo API. Build from the repo root:  docker build -f apps/api/Dockerfile .
FROM node:22-bookworm-slim AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH
RUN corepack enable && apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /repo

FROM base AS build
# Manifests first so dependency install is cached between code changes.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/web/package.json apps/web/
COPY apps/api/package.json apps/api/prisma.config.ts apps/api/
COPY apps/api/prisma apps/api/prisma
RUN pnpm install --frozen-lockfile --filter @prismgo/api...
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN pnpm --filter @prismgo/shared build && pnpm --filter @prismgo/api build
# Self-contained production install of the API and its workspace deps.
RUN pnpm --filter @prismgo/api deploy --prod --legacy /out \
  && cp -r apps/api/dist apps/api/prisma apps/api/prisma.config.ts apps/api/scripts /out/ \
  && mkdir -p /out/src/tracking && cp -r apps/api/src/generated /out/src/ \
  && cp -r apps/api/src/tracking/vendor /out/src/tracking/ \
  && cp apps/api/docker-entrypoint.sh /out/

FROM base AS runtime
ENV NODE_ENV=production PRISMA_HIDE_UPDATE_MESSAGE=1
WORKDIR /app
COPY --from=build /out ./
RUN chmod +x docker-entrypoint.sh && chown -R node:node /app
USER node
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://localhost:4000/api/v1/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
