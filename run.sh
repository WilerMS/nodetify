#!/bin/bash

if [ "$1" == "--dev" ]; then
    COMPOSE_FILE="docker-compose-dev.yml"
    cd app/
    npm install || { echo "Error during npm install execution"; exit 1; }
    cd ../docker
elif [ "$1" == "--prod" ]; then
    COMPOSE_FILE="docker-compose.yml"
    cd ./docker
else
    echo "Missing deploy mode flag: $0 --dev | --prod"
    exit 1
fi

docker-compose -f "$COMPOSE_FILE" up --build || { echo "Error during docker-compose execution"; exit 1; }