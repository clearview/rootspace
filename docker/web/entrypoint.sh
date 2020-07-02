#!/bin/bash
set -e

if test -f "$NOMAD_TASK_DIR/.env" ; then
    cp $NOMAD_TASK_DIR/.env /srv/.env
fi


cd /srv/
ls .
echo "Installing packages... $(yarn install)"
echo "Building web...  $(NODE_OPTIONS="--max-old-space-size=512" VUE_MEMORY_LIMIT=512 yarn build)"
exec "$@"
