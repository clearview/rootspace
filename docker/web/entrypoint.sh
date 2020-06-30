#!/bin/bash
set -e
cd /srv/ && \
pwd && \
ls . && \
echo "Installing packages... $(yarn install)"
echo "Building web...  $(yarn build)"
exec "$@"
