FROM node:lts-alpine

# install simple http server for serving static content
RUN npm install -g http-server

WORKDIR /app

COPY package.json ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY apps/server/package.json apps/server/package.json
COPY packages ./packages
RUN npm install

# copy everything
COPY . .

RUN npm run build:packages

EXPOSE 8080

# environment variables not available until this step
CMD ["/bin/sh", "-c", "npm run build && http-server apps/frontend/dist -p 8080"]
