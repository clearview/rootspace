FROM node:12

COPY yarn.lock .
COPY package.json .

RUN yarn --prod --frozen-lockfile

COPY . .