# AGNTDEV generated-bot runtime image (template).
#
# A generated bot repo depends on @agntdev/bot-toolkit and provides its own
# src/ + tsconfig.json + package.json. The Dev-stage codegen (docs/pivot M0-6)
# scaffolds the repo around this Dockerfile.
#
# The BotFather token is injected at RUNTIME as a secret (BOT_TOKEN), never baked
# into an image layer. Polling vs webhook is selected at deploy time (M1-7).

FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
# Generated bot entrypoint. BOT_TOKEN is read from the environment/secret.
CMD ["node", "dist/main.js"]
