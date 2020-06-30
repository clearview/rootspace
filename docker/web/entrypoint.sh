#!/bin/bash
set -e
cd /srv/member && \
echo "Installing packages... $(yarn install)"
echo "Building member...  $(yarn build)"
cd /srv/org && \
echo "Installing packages... $(yarn install)"
echo "Building org...  $(yarn build)"
exec "$@"
