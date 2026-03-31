## Assumes path context as repo root

FROM node:lts-alpine AS dep
WORKDIR /app
COPY package.json ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY apps/server/package.json apps/server/package.json
COPY packages ./packages
RUN npm install

FROM node:lts-alpine AS build
WORKDIR /app
COPY --from=dep /app ./
RUN npm run build:packages

FROM node:lts-alpine AS prod
WORKDIR /app
COPY --from=build /app ./
COPY apps/ ./apps
CMD ["/bin/sh", "-c", "npm run build --workspace server && npm run start --workspace server"]

