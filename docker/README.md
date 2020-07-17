# Docker

## Run Docker dev env

### Hosts file
`127.0.0.1       localhost api db mailhog`

### Project's root folder
- Create .env file from .env.example

### API
- Create .env fils from .env.example
- `yarn install`

### WEB
- Create .env file from .env.example
- `docker-compose up -d`

### Dozzle
- Visit http://localhost:9999 to watch container logs

### Mailhog
- Visit http://mailhog:8025 to access/test emails in development environment

### Docker scripts
- Use docker/cli.sh to run api cli commands in docker: `docker/cli.sh`


# Infra
* 
