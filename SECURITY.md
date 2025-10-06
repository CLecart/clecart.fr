# Sécurité - Portfolio Clecart.fr

## 🛡️ Mesures de Sécurité Implémentées

### Headers HTTP de Sécurité

#### Content Security Policy (CSP)

```nginx
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com cdn.emailjs.com; style-src 'self' 'unsafe-inline' cdnjs.cloudflare.com fonts.googleapis.com; font-src 'self' cdnjs.cloudflare.com fonts.gstatic.com; img-src 'self' data: https:; media-src 'self'; connect-src 'self' api.emailjs.com; object-src 'none'; base-uri 'self'; form-action 'self';
```

**Justification des permissions :**

- `'unsafe-inline'` pour scripts/styles : Nécessaire pour les styles dynamiques et le thème dark/light
- `cdnjs.cloudflare.com` : FontAwesome icons
- `cdn.emailjs.com` + `api.emailjs.com` : Service de contact form
- `fonts.googleapis.com` + `fonts.gstatic.com` : Google Fonts
- `data:` pour images : SVG inline dans le CSS

#### Autres Headers

- `X-Content-Type-Options: nosniff` - Prévient le MIME sniffing
- `X-Frame-Options: DENY` - Prévient le clickjacking
- `X-XSS-Protection: 1; mode=block` - Protection XSS navigateur
- `Referrer-Policy: strict-origin-when-cross-origin` - Contrôle du referrer

### Authentification et Autorisation

- **Aucune authentification requise** - Site statique public
- **Pas de stockage de données sensibles** côté client

### Gestion des Formulaires

- **Validation côté client ET serveur** (EmailJS)
- **Sanitisation des entrées** avant envoi
- **Rate limiting** via EmailJS
- **HTTPS uniquement** en production

### Docker et Infrastructure

#### Sécurité des Conteneurs

```dockerfile
# Utilisateur non-root
RUN addgroup -g 1001 -S nginx-user && \
    adduser -S -D -H -u 1001 nginx-user
USER nginx-user

# Permissions minimales
RUN chmod -R 755 /usr/share/nginx/html
```

#### Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:80/ || exit 1
```

### Protection des Assets

- **Pas d'indexation** des dossiers sensibles via robots.txt
- **Assets statiques** uniquement
- **Pas de uploads** de fichiers

### Monitoring et Logging

#### Détection d'Anomalies

- **Core Web Vitals** monitoring
- **Erreurs JavaScript** trackées
- **Performance** monitoring continu

#### Logs de Sécurité

- **Nginx access logs** pour audit
- **Erreurs 4xx/5xx** monitoring
- **Health check** failures

## 🔍 Audit de Sécurité

### Tests Automatisés

```bash
# Scan des vulnérabilités des dépendances
npm audit

# Test des headers de sécurité
curl -I https://clecart.fr | grep -E "(X-|Content-Security)"

# Test SSL/TLS
testssl.sh clecart.fr
```

### Checklist Sécurité

#### Configuration Serveur

- [x] HTTPS/TLS 1.3 activé
- [x] Headers de sécurité configurés
- [x] Gzip/compression activée
- [x] Utilisateur non-root pour Docker
- [x] Health checks configurés

#### Code et Assets

- [x] Pas de secrets hardcodés
- [x] Validation des entrées utilisateur
- [x] CSP restrictive mais fonctionnelle
- [x] Assets servis depuis domaines de confiance
- [x] Pas de `eval()` ou code dynamique dangereux

#### Infrastructure

- [x] Logs d'accès activés
- [x] Monitoring des erreurs
- [x] Backups automatisés
- [x] Processus de rollback défini

## 🚨 Plan de Réponse aux Incidents

### Détection

1. **Monitoring automatique** via Core Web Vitals
2. **Alerts** sur erreurs 5xx ou latence élevée
3. **Review** périodique des logs

### Réponse

1. **Isolation** - Rollback immédiat si nécessaire
2. **Analysis** - Investigation des logs
3. **Mitigation** - Patch et redéploiement
4. **Communication** - Notification si impact utilisateurs

### Récupération

1. **Restore** depuis backup vérifié
2. **Testing** complet avant remise en service
3. **Monitoring** renforcé post-incident

## 📋 Maintenance Sécurité

### Mensuel

- [ ] Review des logs d'accès
- [ ] Scan de vulnérabilités
- [ ] Test des backups
- [ ] Audit des permissions

### Trimestriel

- [ ] Pentest externe (si budget)
- [ ] Review de la CSP
- [ ] Mise à jour documentation
- [ ] Formation équipe

### Annuel

- [ ] Audit sécurité complet
- [ ] Review architecture
- [ ] Mise à jour procédures
- [ ] Certification SSL renewal

## 🔗 Ressources et Références

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Security Headers](https://securityheaders.com/)
- [SSL Labs Test](https://www.ssllabs.com/ssltest/)
- [Docker Security](https://docs.docker.com/engine/security/)
- [Nginx Security](https://nginx.org/en/docs/http/ngx_http_security_module.html)

---

**Dernière mise à jour :** $(date +%Y-%m-%d)
**Responsable :** Christophe Lecart
**Status :** Production Ready ✅
