#!/bin/bash
set -e

cd /srv && \
echo "Check connection to REDIS... $(nc -zv $REDIS_HOST $REDIS_PORT)"
echo "Check connection to POSTGRES... $(nc -zv $POSTGRES_HOST $POSTGRES_PORT)"
echo "Writing GOOGLE_CLIENT_ID to .env file... $(echo "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" >> .env)"
echo "Writing GOOGLE_CLIENT_SECRET to .env file... $(echo "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET" >> .env)"
echo "Writing POSTGRES to .env file... $(echo "POSTGRES=postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB" >> .env)"
echo "Writing REDIS_HOST to .env file... $(echo "REDIS_HOST=$REDIS_HOST" >> .env)"
echo "Writing REDIS_PORT to .env file... $(echo "REDIS_PORT=$REDIS_PORT" >> .env)"
echo "Writing SENDGRID_API_KEY to .env file... $(echo "SENDGRID_API_KEY=$SENDGRID_API_KEY" >> .env)"
echo "Writing S3_ACCESS_KEY to .env file... $(echo "S3_ACCESS_KEY=$S3_ACCESS_KEY" >> .env)"
echo "Writing S3_SECRET_KEY to .env file... $(echo "S3_SECRET_KEY=$S3_SECRET_KEY" >> .env)"
echo "Writing SENTRY_DSN to .env file... $(echo "SENTRY_DSN=$SENTRY_DSN" >> .env)"
echo "Writing ARENA_USERNAME to .env file... $(echo "ARENA_USERNAME=$ARENA_USERNAME" >> .env)"
echo "Writing ARENA_PASSWORD to .env file... $(echo "ARENA_PASSWORD=$ARENA_PASSWORD" >> .env)"
exec "$@"
