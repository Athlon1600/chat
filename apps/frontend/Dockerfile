FROM node:lts-alpine

# install simple http server for serving static content
RUN npm install -g http-server

WORKDIR /app

# copy everything
COPY . .

USER root

RUN npm install

RUN npm run build:packages
RUN npm run build --workspace frontend

EXPOSE 8080

CMD [ "http-server", "apps/frontend/dist", "-p 8080" ]
