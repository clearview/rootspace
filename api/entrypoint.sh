#!/bin/bash
yarn cache dir
yarn cache list | wc -l
yarn config set cache-folder /usr/src/cache/.yarn
yarn cache list | wc -l

export NODE_ENV=development && \
    yarn install --production=false && \
    yarn run build

exec "$@"
