#!/bin/bash
set -e

cd /srv && \
echo "Writing GOOGLE_CLIENT_ID to .env file... $(echo "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" >> .env)"
echo "Writing GOOGLE_CLIENT_SECRET to .env file... $(echo "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET" >> .env)"
echo "Writing POSTGRES to .env file... $(echo "POSTGRES=postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB" >> .env)"
echo "Writing REDIS_HOST to .env file... $(echo "REDIS_HOST=$REDIS_HOST" >> .env)"
echo "Writing REDIS_PORT to .env file... $(echo "REDIS_PORT=$REDIS_PORT" >> .env)"
exec "$@"
