#!/bin/bash
set -e

if test -f "$NOMAD_TASK_DIR/.env" ; then
    cp $NOMAD_TASK_DIR/.env /srv/.env
fi


cd /srv/
ls .
echo "Installing packages... $(yarn install)"
echo "Building web...  $(yarn build)"
exec "$@"
