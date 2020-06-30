#!/bin/bash
set -e
cd /srv/
ls .
echo "Installing packages... $(yarn install)"
echo "Building web...  $(yarn build)"
exec "$@"
