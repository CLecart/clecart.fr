#!/bin/bash

# Script de déploiement amélioré avec vérifications et rollback
set -euo pipefail

# Configuration
PROJECT_NAME="clecart-portfolio"
IMAGE_NAME="clecart-portfolio"
CONTAINER_NAME="clecart-portfolio-container"
PORT="8080"
BACKUP_TAG="backup-$(date +%Y%m%d-%H%M%S)"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Fonction de rollback
rollback() {
    log_warning "Rollback en cours..."
    if docker image inspect "${IMAGE_NAME}:${BACKUP_TAG}" >/dev/null 2>&1; then
        docker stop $CONTAINER_NAME || true
        docker rm $CONTAINER_NAME || true
        docker run -d -p $PORT:80 --name $CONTAINER_NAME "${IMAGE_NAME}:${BACKUP_TAG}"
        log_success "Rollback terminé avec succès"
    else
        log_error "Impossible de rollback - pas de backup disponible"
    fi
    exit 1
}

# Trap pour rollback en cas d'erreur
trap rollback ERR

log_info "🚀 Début du déploiement de $PROJECT_NAME"

# Vérifier que Docker est installé et fonctionne
if ! command -v docker &> /dev/null; then
    log_error "Docker n'est pas installé ou n'est pas dans le PATH"
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    log_error "Docker n'est pas en cours d'exécution"
    exit 1
fi

# Sauvegarder l'image actuelle si elle existe
if docker image inspect $IMAGE_NAME >/dev/null 2>&1; then
    log_info "Sauvegarde de l'image actuelle..."
    docker tag $IMAGE_NAME "${IMAGE_NAME}:${BACKUP_TAG}"
    log_success "Image sauvegardée avec le tag: $BACKUP_TAG"
fi

# Build de la nouvelle image
log_info "🔨 Construction de l'image Docker..."
docker build -t $IMAGE_NAME . --no-cache

# Vérifier que l'image a été construite
if ! docker image inspect $IMAGE_NAME >/dev/null 2>&1; then
    log_error "Échec de la construction de l'image"
    exit 1
fi

# Arrêter le conteneur existant en douceur
if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
    log_info "Arrêt graceful du conteneur existant..."
    docker stop $CONTAINER_NAME --time=30 || true
    docker rm $CONTAINER_NAME || true
fi

# Démarrer le nouveau conteneur
log_info "🚀 Démarrage du nouveau conteneur..."
docker run -d \
    -p $PORT:80 \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    --health-cmd="curl -f http://localhost:80/ || exit 1" \
    --health-interval=30s \
    --health-timeout=10s \
    --health-retries=3 \
    $IMAGE_NAME

# Attendre que le conteneur soit prêt
log_info "⏳ Vérification de la santé du conteneur..."
timeout=60
counter=0

while [ $counter -lt $timeout ]; do
    if docker ps -q -f name=$CONTAINER_NAME | grep -q . && \
       curl -sf http://localhost:$PORT >/dev/null 2>&1; then
        break
    fi
    sleep 2
    counter=$((counter + 2))
    echo -n "."
done

echo ""

if [ $counter -ge $timeout ]; then
    log_error "Le conteneur n'a pas démarré correctement dans les temps"
    rollback
fi

# Vérifications post-déploiement
log_info "🔍 Vérifications post-déploiement..."

# Test HTTP
if ! curl -sf http://localhost:$PORT >/dev/null; then
    log_error "Le service n'est pas accessible"
    rollback
fi

# Vérifier les headers de sécurité
security_headers=$(curl -sI http://localhost:$PORT | grep -E "(X-Content-Type-Options|X-Frame-Options|X-XSS-Protection)" | wc -l)
if [ "$security_headers" -lt 3 ]; then
    log_warning "Certains headers de sécurité sont manquants"
fi

# Nettoyer les anciennes images (garder les 3 dernières)
log_info "🧹 Nettoyage des anciennes images..."
docker images $IMAGE_NAME --format "table {{.Repository}}:{{.Tag}} {{.CreatedAt}}" | \
    tail -n +2 | sort -k2 -r | tail -n +4 | awk '{print $1}' | \
    xargs -r docker rmi || true

# Afficher les informations finales
log_success "✅ Déploiement terminé avec succès!"
log_info "📊 Informations du déploiement:"
echo "   🌐 URL: http://localhost:$PORT"
echo "   🐳 Conteneur: $CONTAINER_NAME"
echo "   📦 Image: $IMAGE_NAME"
echo "   💾 Backup: ${IMAGE_NAME}:${BACKUP_TAG}"

# Afficher les métriques du conteneur
log_info "📈 Métriques du conteneur:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" $CONTAINER_NAME

log_success "🎉 Le portfolio est maintenant en ligne et opérationnel!"

# Désactiver le trap
trap - ERR
