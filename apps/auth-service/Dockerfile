# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps

RUN npm install -g pnpm@10.19.0

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/auth-service/package.json ./apps/auth-service/

RUN pnpm install --filter @monorepo/auth-service... --frozen-lockfile --prefer-offline

# ============================================
# Stage 2: Builder
# ============================================
FROM node:20-alpine AS builder

RUN npm install -g pnpm@10.19.0

WORKDIR /app

# Copia tudo da stage de deps
COPY --from=deps /app ./

# Copia código fonte
COPY apps/auth-service ./apps/auth-service
COPY turbo.json ./

WORKDIR /app/apps/auth-service

# Build usando pnpm
RUN pnpm turbo run build --filter=@monorepo/auth-service

# ============================================
# Stage 3: Production - Instala apenas prod dependencies
# ============================================
FROM node:20-alpine AS prod-deps

RUN npm install -g pnpm@10.19.0

WORKDIR /app

# Copia apenas package.json files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/auth-service/package.json ./apps/auth-service/

# Instala APENAS dependências de produção
RUN pnpm install --prod --filter @monorepo/auth-service... --frozen-lockfile --prefer-offline

# ============================================
# Stage 4: Production Runner
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copia o build
COPY --from=builder /app/apps/auth-service/dist ./apps/auth-service/dist
COPY --from=builder /app/apps/auth-service/package.json ./apps/auth-service/package.json

# Copia dependências de PRODUÇÃO (com symlinks resolvidos)
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/packages ./packages
COPY --from=prod-deps /app/apps/auth-service/node_modules ./apps/auth-service/node_modules

WORKDIR /app/apps/auth-service

EXPOSE 3002

CMD ["node", "dist/src/main.js"]