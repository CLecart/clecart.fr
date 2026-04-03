# Multi-stage build for size optimization
FROM nginx:alpine

# Labels for metadata
LABEL maintainer="Christophe Lecart <contact@clecart.fr>"
LABEL description="Professional Portfolio - Full Stack Developer"
LABEL version="1.0.0"

# Create non-root user, prepare directories, and install runtime tools in one layer
RUN addgroup -g 1001 -S nginx-user && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx-user -g nginx-user nginx-user && \
    mkdir -p /var/cache/nginx/client_temp \
             /var/cache/nginx/proxy_temp \
             /var/cache/nginx/fastcgi_temp \
             /var/cache/nginx/uwsgi_temp \
             /var/cache/nginx/scgi_temp && \
    apk add --no-cache \
        curl \
        ca-certificates && \
    rm -rf /var/cache/apk/*

# Copy website files
COPY --chown=nginx-user:nginx-user . /usr/share/nginx/html

# Copy optimized nginx configuration
COPY --chown=nginx-user:nginx-user nginx.conf /etc/nginx/conf.d/default.conf

# Set ownership and permissions
RUN chown -R nginx-user:nginx-user /var/cache/nginx && \
    chown -R nginx-user:nginx-user /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    mkdir -p /run/nginx && \
    chown -R nginx-user:nginx-user /run/nginx && \
    chmod -R 1777 /run && \
    chmod 1777 /var/run

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# Utiliser l'utilisateur non-root
USER nginx-user

# Exposer le port
EXPOSE 80

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"]
