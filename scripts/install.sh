#!/usr/bin/env bash

## Install Docker & Node and launch the containers

curl -sSL https://get.docker.com/ | sh &&\
curl -fsSL https://deb.nodesource.com/setup_19.x | sudo -E bash - &&\
sudo apt-get install -y nodejs &&\
git clone https://github.com/Athlon1600/chat.git &&\
cd chat &&\
npm run docker:production
