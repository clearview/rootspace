#!/bin/bash
set -e

cd /srv/api && \
printenv | sort && \
echo "Installing packages... $(yarn install --production=false)"
echo "Building... $(yarn build)"
exec "$@"
