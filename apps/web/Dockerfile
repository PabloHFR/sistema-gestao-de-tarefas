# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps

RUN npm install -g pnpm@10.19.0

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/web/package.json ./apps/web/

RUN pnpm install --filter @monorepo/web... --frozen-lockfile --prefer-offline

# ============================================
# Stage 2: Builder
# ============================================
FROM node:20-alpine AS builder

RUN npm install -g pnpm@10.19.0

WORKDIR /app

COPY --from=deps /app ./
COPY apps/web ./apps/web
COPY turbo.json ./

# Build dependências (ex: packages/types)
RUN pnpm run build --filter @monorepo/types

# Agora builda o app web
WORKDIR /app/apps/web
RUN pnpm run build


# ============================================
# Stage 3: Production Runner
# ============================================
FROM nginx:alpine AS runner

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
