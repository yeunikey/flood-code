# ---------- Base ----------
FROM node:20 AS base
WORKDIR /app

# ---------- Dependencies ----------
FROM base AS deps
COPY package*.json pnpm-lock.yaml* ./

RUN npm install -g pnpm

RUN npm install -g @nestjs/cli
RUN pnpm install

# ---------- Build ----------
FROM base AS build
RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# ---------- Production ----------
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3001
CMD ["node", "dist/main.js"]
