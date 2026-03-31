FROM node:lts-alpine AS deps
WORKDIR /app
COPY package.json ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY apps/server/package.json apps/server/package.json
COPY packages ./packages
RUN npm install

FROM node:lts-alpine AS build
WORKDIR /app
COPY --from=deps /app ./
COPY packages/api/tsconfig*json packages/api/
COPY packages/typings/tsconfig*json packages/typings/
COPY tsconfig*json ./
RUN npm run build:packages

FROM node:lts-alpine AS prod
WORKDIR /app
COPY --from=build /app ./
COPY apps/frontend apps/frontend
CMD ["/bin/sh", "-c", "cd apps/frontend && npm run build && npm run serve"]
