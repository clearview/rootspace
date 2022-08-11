#!/bin/bash
set -e

pwd && ls && ls web && echo "Starting the command from entrypoint.sh"
exec "$@"
