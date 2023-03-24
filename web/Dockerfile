FROM node:14-bullseye

WORKDIR /opt/project

COPY yarn.lock .
COPY package.json .

RUN yarn install --network-timeout 100000

ADD . .

RUN yarn install && yarn build


# project files to be added by mounting a volume

CMD ["yarn", "serve"]
