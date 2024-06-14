#!/bin/bash

if [ "$1" == "--dev" ]; then
    COMPOSE_FILE="docker-compose-dev.yml"
    cd app/
    npm install || { echo "Error during npm install execution"; exit 1; }
elif [ "$1" == "--prod" ]; then
    COMPOSE_FILE="docker-compose.yml"
else
    echo "Missing deploy mode flag: $0 --dev | --prod"
    exit 1
fi

cd ../docker
docker-compose -f "$COMPOSE_FILE" up || { echo "Error during docker-compose execution"; exit 1; }