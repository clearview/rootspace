#!/bin/bash
set -e

cd /srv && \
printenv | sort && \
echo "Writing GOOGLE_CLIENT_ID to .env file... $(echo "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" >> .env)"
exec "$@"
