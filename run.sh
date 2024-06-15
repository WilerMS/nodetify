#!/bin/bash

if [ "$1" == "--dev" ]; then
    if [ "$2" == "--build" ]; then
        cd app/
        npm install || { echo "Error during npm install execution"; exit 1; }
        cd ../docker
        docker-compose -f docker-compose-dev.yml up --build || { echo "Error during docker-compose execution"; exit 1; }
    fi
    cd ./docker
    docker-compose -f docker-compose-dev.yml up || { echo "Error during docker-compose execution"; exit 1; }
elif [ "$1" == "--prod" ]; then
    cd ./docker
    docker-compose up --build || { echo "Error during docker-compose execution"; exit 1; }
else
    echo "Missing deploy mode flag: $0 --dev | --prod"
    exit 1
fi