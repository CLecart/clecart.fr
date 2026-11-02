# Pinned to an exact release of the stable branch: a floating tag would let two
# builds of the same commit ship different servers. Bump deliberately.
# The unprivileged variant of that release runs master and workers as uid 101,
# hence port 8080: ports below 1024 belong to root.
FROM nginxinc/nginx-unprivileged:1.30.6-alpine

LABEL org.opencontainers.image.title="clecart.fr" \
      org.opencontainers.image.description="Portfolio of Christophe Lecart, Software Engineer & Green IT Lead" \
      org.opencontainers.image.authors="Christophe Lecart <djlike@hotmail.fr>" \
      org.opencontainers.image.source="https://github.com/CLecart/clecart.fr"

# The base hands /etc/nginx to uid 101 so its entrypoint can rewrite the
# configuration at start-up. Nothing here needs that, and a server able to
# rewrite its own configuration can drop the security headers and reload.
USER root
RUN chown -R root:root /etc/nginx && \
    chmod -R go-w /etc/nginx && \
    rm /usr/share/nginx/html/50x.html

# Owned by root and read-only to uid 101: a worker can read the site and its
# configuration, never rewrite them. Only served files reach the web root.
COPY --chmod=644 nginx.conf /etc/nginx/conf.d/default.conf
COPY --chmod=644 nginx-security-headers.conf /etc/nginx/security-headers.conf
COPY --chmod=644 index.html about-portfolio.html descriptions-projects.html \
     privacy-policy.html 404.html styles.css service-worker.js robots.txt \
     sitemap.xml /usr/share/nginx/html/
COPY --chmod=u=rwX,go=rX css /usr/share/nginx/html/css
COPY --chmod=u=rwX,go=rX js /usr/share/nginx/html/js
COPY --chmod=u=rwX,go=rX assets /usr/share/nginx/html/assets
COPY --chmod=u=rwX,go=rX cv /usr/share/nginx/html/cv

USER 101

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD ["wget", "-q", "--spider", "http://127.0.0.1:8080/"]
