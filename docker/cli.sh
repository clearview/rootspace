#!/bin/bash

docker exec -it root_api bash -c "npx ts-node-script -s cli.ts $*"