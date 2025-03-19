FROM nginx:alpine

# Copier les fichiers du projet dans le répertoire de travail de Nginx
COPY . /usr/share/nginx/html

# Configurer Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Commande par défaut pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
