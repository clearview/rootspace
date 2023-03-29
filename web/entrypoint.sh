#!/bin/bash
echo "Path to the Yarn cache directory path: $(yarn cache dir)."
echo "The number of installed node modules: $(yarn cache list | wc -l)."
echo "Set the yarn cache folder: $(yarn config set cache-folder /usr/src/cache/.yarn)."
echo "The number of installed node modules: $(yarn cache list | wc -l)."

NODE_ENV=development yarn install --production=false
yarn run build

exec "$@"
