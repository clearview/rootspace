#!/bin/bash
set -e

pwd && ls && echo "Starting the command from entrypoint.sh"
exec "$@"
