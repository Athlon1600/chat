# Chat Application

![GitHub last commit](https://img.shields.io/github/last-commit/athlon1600/chat)
![Top language](https://img.shields.io/github/languages/top/athlon1600/chat)
![Lines of code](https://img.shields.io/tokei/lines/github/athlon1600/chat)

Highly customizable chat server/application that is easy to deploy, and can be 
integrated with any sort of website. 
Host your own **chat server** on your own terms.

May be used by Twitch streamers who want to host their own chat server
away from Twitch infrastructure and moderation.

## Live demo

- https://chat-athlon1600.netlify.app/

Playground for developers showing things you can do using HTTP/Websocket API.

- https://chat-athlon1600.netlify.app/lofi.html

A more real-world example showing chat embedded alongside a live stream.

![Imgur](https://i.imgur.com/8unZ1yl.png)

## :warning: Work in progress...

This project is still in its beta stage. Nothing is guaranteed until v1.0.0.

## 🔥 Features

- First-class TypeScript support - IDE should be doing half the work for you
- Single repository (why monorepo? https://monorepo.tools/)
- :whale: Dockerized
- Not tied to any particular infrastructure or service - we are in a world where AWS, Firebase and Twitch do not exist
- Infinitely scalable with minimal changes
- Minimal dependencies

## Repository Structure

Entire application is **self-contained** within this single repository
which has many advantages during development.

## :whale2: Local Development using Docker

Two things you need installed first:

- Node.js (>=16) - https://nodejs.org/
- Docker - https://www.docker.com/products/docker-desktop/

Now run these commands:

```shell
git clone https://github.com/Athlon1600/chat
cd chat
npm run docker:dev
```

This will take a while, but once up and running
you will be able to access the following services
on your local computer:

- localhost:8080 = frontend
- localhost:3000 = server/backend
- localhost:9000 = adminer (for browsing/editing db contents)
- localhost:3309 = mySQL database
- localhost:6379 = Redis


## :construction: To-do list

- Build a proper `/admin` backend instead of doing management directly via database (adminer).
- https://typedoc.org/
- https://palantir.github.io/tslint/usage/cli/
