#!/bin/bash

echo "Début du déploiement..."

docker build -t portfolio-clecart .

docker stop portfolio-container || true
docker rm portfolio-container || true

docker run -d -p 80:80 --name portfolio-container portfolio-clecart

echo "Déploiement terminé ! Le site est disponible sur http://localhost"
