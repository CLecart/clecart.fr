#!/bin/bash

# Script de déploiement pour le portfolio

echo "Début du déploiement..."

# Construire l'image Docker
echo "Construction de l'image Docker..."
docker build -t portfolio-clecart .

# Arrêter le conteneur existant s'il existe
echo "Arrêt du conteneur existant s'il existe..."
docker stop portfolio-container || true
docker rm portfolio-container || true

# Lancer le nouveau conteneur
echo "Démarrage du nouveau conteneur..."
docker run -d -p 80:80 --name portfolio-container portfolio-clecart

echo "Déploiement terminé ! Le site est disponible sur http://localhost"
