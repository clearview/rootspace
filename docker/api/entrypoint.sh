#!/bin/bash
set -e

if test -f "$NOMAD_TASK_DIR/.env" ; then
    cp $NOMAD_TASK_DIR/.env /srv/api/.env
fi

cd /srv/api && \
cat /srv/api/.env && \
echo "Installing packages... $(yarn install --silent)"
echo "Building... $(yarn build)"
exec "$@"