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

FROM node:lts-alpine AS dev
WORKDIR /app
COPY --from=build /app ./
COPY . .
EXPOSE 8080
CMD npm run serve --workspace frontend

FROM node:lts-alpine as prod
WORKDIR /app
RUN npm install -g http-server
COPY --from=build /app ./
COPY . .
EXPOSE 8080
CMD ["/bin/sh", "-c", "npm run build && http-server apps/frontend/dist -p 8080"]
