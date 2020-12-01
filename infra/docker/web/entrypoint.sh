#!/bin/bash
set -e

cd /srv/
ls .
echo "Installing packages... $(yarn install)"
echo "Building web...  $(NODE_OPTIONS="--max-old-space-size=200" VUE_MEMORY_LIMIT=200 yarn build)"
exec "$@"
