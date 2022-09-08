#!/bin/bash
set -e

cat web/.env
echo "Starting the command from entrypoint.sh"
exec "$@"
