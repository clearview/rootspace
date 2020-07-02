#!/bin/bash
set -e

if test -f "$NOMAD_TASK_DIR/.env" ; then
    cp $NOMAD_TASK_DIR/.env /srv/api/.env
fi

cd /srv/api && \
printenv | sort && \
cat /srv/api/.env && \
echo "Installing packages... $(yarn install)"
echo "Building... $(yarn build)"
exec "$@"
