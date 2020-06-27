#!/bin/bash
nomad_file=docker-compose-nomad.yml
consul_file=docker-compose-consul.yml
env_file=.env.docker

printf 'Pruning Docker images... \n\n'

docker image prune --force

printf 'Pulling Docker images... \n\n'

docker-compose \
--env-file=${env_file} \
-f ${nomad_file} \
-f ${consul_file} pull \
--quiet

printf 'Building Docker images... \n\n'

docker-compose \
--env-file=${env_file} \
-f ${nomad_file} \
-f ${consul_file} build \
--quiet

printf 'Creating and starting Docker containers... \n\n'

docker-compose \
--env-file=${env_file} \
-p root_nomad \
-f ${nomad_file} up \
--force-recreate \
-d

docker-compose \
--env-file=${env_file} \
-p root_consul \
-f ${consul_file} up \
-d
