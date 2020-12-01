#!/bin/bash

echo -e "Enter command: "
echo -e " 1) seed:config"
echo -e " 2) seed:run"
echo -e " 3) schema:drop"
echo -e " 4) schema:sync"
read COMMAND

case $COMMAND in

  1)
    echo -e "Running typeorm-seeding/dist/cli.js seed:config"
    docker exec -it root_api bash -c "npx ts-node-script -s ./node_modules/typeorm-seeding/dist/cli.js config"
    ;;

  2)
    echo -e "Running typeorm-seeding/dist/cli.js seed"
    docker exec -it root_api bash -c "npx ts-node-script -s ./node_modules/typeorm-seeding/dist/cli.js seed"
    ;;

  3)
    echo -e "Running typeorm/cli.js schema:drop"
    docker exec -it root_api bash -c "npx ts-node-script -s ./node_modules/typeorm/cli.js schema:drop"
    ;;

  4)
    echo -e "Running typeorm/cli.js schema:sync"
    docker exec -it root_api bash -c "npx ts-node-script -s ./node_modules/typeorm/cli.js schema:sync"
    ;;

  *)
    echo -e "Unknown command"
    ;;
esac