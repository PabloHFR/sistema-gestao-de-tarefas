# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps

RUN npm install -g pnpm@10.19.0

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/notifications-service/package.json ./apps/notifications-service/

RUN pnpm install --filter @monorepo/notifications-service... --frozen-lockfile --prefer-offline

# ============================================
# Stage 2: Builder
# ============================================
FROM node:20-alpine AS builder

RUN npm install -g pnpm@10.19.0

WORKDIR /app

# Copia tudo da stage de deps
COPY --from=deps /app ./

# Copia código fonte
COPY apps/notifications-service ./apps/notifications-service
COPY turbo.json ./

WORKDIR /app/apps/notifications-service

# Build usando pnpm
RUN pnpm turbo run build --filter=@monorepo/notifications-service

# ============================================
# Stage 3: Production - Instala apenas prod dependencies
# ============================================
FROM node:20-alpine AS prod-deps

RUN npm install -g pnpm@10.19.0

WORKDIR /app

# Copia apenas package.json files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/notifications-service/package.json ./apps/notifications-service/

# Instala APENAS dependências de produção
RUN pnpm install --prod --filter @monorepo/notifications-service... --frozen-lockfile --prefer-offline

# ============================================
# Stage 4: Production Runner
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copia o build
COPY --from=builder /app/apps/notifications-service/dist ./apps/notifications-service/dist
COPY --from=builder /app/apps/notifications-service/package.json ./apps/notifications-service/package.json

# Copia dependências de PRODUÇÃO (com symlinks resolvidos)
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/packages ./packages
COPY --from=prod-deps /app/apps/notifications-service/node_modules ./apps/notifications-service/node_modules

WORKDIR /app/apps/notifications-service

EXPOSE 3004

CMD ["node", "dist/src/main.js"]