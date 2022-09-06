#!/bin/bash
set -e

echo "Check connection to API_ENDPOINT... $(nc -zv $API_ENDPOINT 443)"
cat .env
pwd && ls && ls web && echo "Starting the command from entrypoint.sh"
exec "$@"
