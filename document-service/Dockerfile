FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,id=npm-cache,target=/root/.npm,sharing=locked \
    npm ci --prefer-offline --no-audit --no-fund --fetch-timeout=300000 --fetch-retries=8

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY src ./src
RUN DATABASE_URL="postgresql://postgres:dummy@localhost:5432/document_db" npx prisma generate
RUN npm run build
RUN npm prune --omit=dev --no-audit --no-fund

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh
RUN mkdir -p /app/uploads
EXPOSE 3004
CMD ["./docker-entrypoint.sh"]
