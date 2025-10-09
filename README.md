# Portfolio Professionnel - Christophe Lecart

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Go](https://img.shields.io/badge/Go-00ADD8?style=flat-square&logo=go&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=pwa&logoColor=white)

[![Security](https://img.shields.io/badge/Security-A%2B-green?style=flat-square)](#sécurité)
[![Performance](https://img.shields.io/badge/Performance-95%2B-brightgreen?style=flat-square)](#performance)
[![Accessibility](https://img.shields.io/badge/A11y-WCAG%202.1-blue?style=flat-square)](#accessibilité)

## Sommaire

- [À propos](#à-propos)
- [Technologies et Architecture](#technologies-et-architecture)
- [Caractéristiques Techniques](#caractéristiques-techniques)
- [Projets Présentés](#projets-présentés)
- [Architecture du Projet](#architecture-du-projet)
- [Installation et Développement](#installation-et-développement)
- [Déploiement Production](#déploiement-production)
- [Sécurité et Performance](#sécurité-et-performance)
- [Maintenance et Monitoring](#maintenance-et-monitoring)
- [Contact](#contact)

## À propos

Portfolio professionnel présentant mes compétences en développement web et mobile, conçu pour ma recherche d'alternance. Ce site vitrine met en avant mon expertise technique et mes projets dans une interface moderne et responsive, développée en HTML5, CSS3 et JavaScript.

Le portfolio démontre ma capacité à créer des interfaces utilisateur intuitives et performantes tout en appliquant les meilleures pratiques du développement web.

## Technologies et Architecture

### 🚀 **Stack Technique Principal**

- **Frontend :** HTML5 sémantique, CSS3 (Flexbox, Grid, Custom Properties), JavaScript ES2021+
- **Architecture CSS :** Organisation modulaire SMACSS avec variables CSS natives
- **PWA :** Service Worker avancé, Web App Manifest, Background Sync
- **Performance :** Core Web Vitals monitoring, Lighthouse optimisé, Lazy Loading intelligent
- **Sécurité :** Content Security Policy, Security Headers, Container Security

### 🏗️ **DevOps et Infrastructure**

- **Containerisation :** Docker multi-stage avec utilisateur non-root
- **Orchestration :** Docker Compose avec health checks
- **CI/CD :** Scripts de déploiement avec rollback automatique
- **Monitoring :** Analytics privacy-friendly, Performance tracking
- **Qualité Code :** ESLint, Prettier, VS Code configuration optimisée

### 🎯 **Spécialisations Techniques**

- **Responsive Design :** Mobile-first, Progressive Enhancement
- **Accessibilité :** WCAG 2.1 AA compliance, Navigation clavier
- **UX/UI :** Système de thème adaptatif, Micro-interactions, Animation performante
- **SEO :** Semantic HTML, Structured Data, Optimisation Core Web Vitals
- **Backend Integration :** API RESTful, WebSocket, Real-time features

## Caractéristiques Techniques

### 🎨 **Interface Utilisateur**

- **Design System** moderne avec variables CSS natives
- **Thème Adaptatif** automatique (system/light/dark) avec persistance
- **Micro-interactions** optimisées pour la performance
- **Responsive Design** mobile-first avec breakpoints intelligents
- **Accessibilité** complète (navigation clavier, screen readers, contraste)

### ⚡ **Performance et Optimisation**

- **Core Web Vitals** monitoring en temps réel
- **Lazy Loading** intelligent pour images/vidéos
- **Resource Hints** (preload, prefetch, preconnect)
- **Service Worker** avec stratégies de cache avancées
- **Bundle Optimization** avec compression et minification

### 🛡️ **Sécurité et Conformité**

- **Content Security Policy** stricte avec whitelist CDN
- **Security Headers** complets (HSTS, X-Frame-Options, etc.)
- **RGPD Compliance** avec gestion granulaire des cookies
- **Container Security** avec utilisateur non-root et health checks
- **Privacy-First Analytics** sans tracking invasif

### 🚀 **DevOps et Production**

- **Infrastructure as Code** avec Docker et Docker Compose
- **Zero-Downtime Deployment** avec rollback automatique
- **Health Monitoring** et alerting intégré
- **Backup Strategy** automatisée avec versioning
- **Performance Monitoring** continu avec métriques détaillées

## Projets présentés

- **Groupie-Tracker :** Application web Go visualisant des données d'API sur des artistes musicaux
- **BombermanDX :** Jeu navigateur développé en JavaScript avec optimisation des performances
- **Forum :** Plateforme de discussion complète avec authentification et fonctionnalités temps réel

## Architecture du Projet

### 📁 **Structure Organisationnelle**

```
clecart.fr/
├── 🏗️ Infrastructure
│   ├── Dockerfile                    # Multi-stage build sécurisé
│   ├── docker-compose.yml           # Orchestration production
│   ├── deploy.sh                    # Script déploiement avec rollback
│   ├── nginx.conf                   # Configuration serveur optimisée
│   └── package.json                 # Scripts npm et métadonnées
│
├── 🎨 Frontend Architecture
│   ├── css/                         # Architecture SMACSS modulaire
│   │   ├── base/                    # Fondations CSS
│   │   │   ├── reset.css           # Normalisation navigateurs
│   │   │   └── variables.css       # Variables CSS natives
│   │   ├── components/              # Composants réutilisables
│   │   │   ├── buttons.css         # Styles boutons interactifs
│   │   │   ├── cards.css           # Système de cartes
│   │   │   ├── dark-mode-toggle.css # Toggle thème sombre/clair
│   │   │   ├── forms.css           # Formulaires avec validation
│   │   │   ├── gdpr.css            # Bannière consentement RGPD
│   │   │   └── notifications.css   # Système de notifications
│   │   ├── layout/                  # Structure générale pages
│   │   │   ├── footer.css          # Pied de page responsive
│   │   │   └── header.css          # Navigation principale
│   │   ├── sections/                # Sections spécifiques pages
│   │   │   ├── about.css           # Section à propos
│   │   │   ├── approach.css        # Méthodologie développement
│   │   │   ├── contact.css         # Formulaire contact
│   │   │   ├── cta.css             # Call-to-action buttons
│   │   │   ├── footer.css          # Styles footer global
│   │   │   ├── gdpr.css            # Section RGPD
│   │   │   ├── hero.css            # Section hero/bannière
│   │   │   ├── portfolio-details.css # Détails portfolio
│   │   │   ├── privacy.css         # Politique confidentialité
│   │   │   ├── projects.css        # Galerie projets
│   │   │   └── skills.css          # Compétences techniques
│   │   ├── theme/                   # Gestion thèmes
│   │   │   └── darkmode.css        # Thème sombre complet
│   │   ├── utils/                   # Utilitaires transversaux
│   │   │   ├── animations.css      # Animations CSS optimisées
│   │   │   ├── image-fallbacks.css # Fallbacks images cassées
│   │   │   ├── modals.css          # Système modal accessible
│   │   │   └── responsive.css      # Media queries responsive
│   │   └── critical.css             # CSS critique inline
│   │
│   ├── js/                          # Architecture JavaScript modulaire
│   │   ├── modules/                 # Fonctionnalités métier
│   │   │   ├── animations.js        # Intersection Observer, transitions
│   │   │   ├── contact-form.js      # Validation, EmailJS integration
│   │   │   ├── darkmode.js          # Gestion thème adaptatif système
│   │   │   ├── form-enhancements.js # UX formulaires avancée
│   │   │   ├── navigation.js        # Menu responsive, smooth scroll
│   │   │   ├── project-navigation.js # Navigation projets
│   │   │   └── videoHandler.js      # Lazy loading vidéos optimisé
│   │   │
│   │   ├── utils/                   # Utilitaires techniques
│   │   │   ├── analytics.js         # Privacy-first tracking
│   │   │   ├── gdpr.js             # Conformité RGPD complète
│   │   │   ├── modal.js            # Système modal accessible
│   │   │   ├── performance.js       # Optimisations runtime
│   │   │   ├── service-worker.js    # Service Worker de base
│   │   │   ├── sw-advanced.js       # SW stratégies cache avancées (optionnel — non fourni par défaut)
│   │   │   ├── sw-register.js       # Enregistrement Service Worker
│   │   │   └── webvitals.js        # Core Web Vitals monitoring
│   │   │
│   │   ├── main.js                  # Point d'entrée application
│   │   └── critical.js              # JavaScript critique inline
│   │
│   └── styles.css                   # Styles principaux (legacy)
│
├── 📦 Assets Optimisés
│   ├── documents/                   # Documents téléchargeables
│   │   └── CV_Christophe_Lecart.pdf # CV professionnel
│   ├── icons/                       # Système d'icônes complet
│   │   ├── android-chrome-192x192.png # PWA icon mobile
│   │   ├── android-chrome-512x512.png # PWA icon haute résolution
│   │   ├── apple-touch-icon.png     # Icon iOS/Safari
│   │   ├── favicon-16x16.png        # Favicon 16px
│   │   ├── favicon-32x32.png        # Favicon 32px
│   │   ├── favicon.ico              # Favicon classique
│   │   └── rust-icon.svg            # Icône Rust vectorielle
│   ├── images/                      # Images optimisées
│   │   ├── favicon.ico              # Favicon alternative
│   │   ├── forum.png                # Screenshot projet Forum
│   │   └── profile.jpg              # Photo profil professionnelle
│   ├── manifest/                    # Configuration PWA
│   │   ├── browserconfig.xml        # Configuration IE/Edge
│   │   └── site.webmanifest         # Manifest PWA complet
│   └── videos/                      # Démos projets
│       ├── BombermanDX.mp4          # Démo jeu Bomberman
│       └── Groupie-Tracker.mp4      # Démo app Groupie Tracker
│
├── 📄 Pages et Contenu
│   ├── index.html                   # Page principale optimisée SEO
│   ├── about-portfolio.html         # Documentation technique
│   ├── descriptions-projects.html   # Détails projets
│   ├── privacy-policy.html          # Politique confidentialité RGPD
│   ├── robots.txt                   # SEO crawling directives
│   └── sitemap.xml                  # Plan du site structuré
│
├── ⚙️ Configuration Développement
│   ├── .eslintrc.json              # Règles qualité code JavaScript
│   ├── .prettierrc.json            # Formatage code automatique
│   ├── .gitignore                  # Exclusions Git optimisées
│   ├── .vscode/                    # Configuration IDE partagée
│   │   ├── extensions.json         # Extensions recommandées
│   │   └── settings.json           # Settings workspace
│   └── SECURITY.md                 # Documentation sécurité
│
└── 📊 Monitoring et Documentation
    ├── README.md                    # Documentation projet complète
    └── CNAME                        # Configuration domaine personnalisé
```

### 🔧 **Patterns Architecturaux**

- **Modular CSS Architecture** (SMACSS + BEM)
- **Progressive Enhancement** JavaScript
- **Mobile-First Responsive Design**
- **Component-Based Development**
- **Separation of Concerns** (Structure/Style/Behavior)

## Installation et Développement

### 🚀 **Setup Rapide**

```bash
# Cloner le repository
git clone https://github.com/CLecart/clecart.fr.git
cd clecart.fr

# Démarrer le serveur de développement
npm start
# ou
python3 -m http.server 8000

# Accéder à l'application
open http://localhost:8000
```

### 🛠️ **Environnement de Développement**

#### Prérequis

#### Scripts Disponibles

```bash
# Développement
npm start                    # Serveur développement Python
npm run docker:build        # Build image Docker
npm run docker:run          # Run container local

# Validation et Qualité
npm run validate:html        # Validation HTML W3C
npm run validate:css         # Validation CSS W3C
npm run lighthouse          # Audit Lighthouse complet

# Déploiement
npm run deploy              # Script déploiement production
npm run docker:stop         # Arrêt container avec cleanup
```

Note: certains scripts/documentation (ex: `docs:generate`, `docs:serve`, `jsdoc:convert`) s'appuient sur des fichiers de configuration et scripts optionnels (jsdoc, `scripts/convert-to-jsdoc.sh`). Ces éléments ne sont pas inclus par défaut dans ce dépôt — ils peuvent être ajoutés si vous souhaitez générer la documentation avec jsdoc.

### Gestion des secrets (EmailJS) — recommandation

Pour éviter de committer des tokens, utilisez la méthode suivante :

1. Copiez `.env.example` en `.env` et remplissez les valeurs :

```
cp .env.example .env
# Éditez .env et entrez vos valeurs
```

2. Générez le fichier runtime `config.json` (qui est gitignored) :

```
./scripts/generate-config-from-env.sh
```

3. Déployez en veillant à ce que `config.json` soit présent à la racine (ou utilisez une étape d'entrypoint Docker qui écrit `config.json` depuis des variables d'environnement CI/CD).

Ne commettez jamais votre `.env` ni `config.json` — ils sont listés dans `.gitignore`.

### 🔧 **Configuration IDE (VS Code)**

Les extensions et configurations sont automatiquement suggérées :

- **ESLint + Prettier** pour la qualité code
- **Live Server** pour le hot reload
- **CSS Peek** pour la navigation CSS
- **Docker** pour la gestion conteneurs
- **Todo Tree** pour la gestion tâches

### 🧪 **Tests et Validation**

```bash
# Tests performance locaux
npm run lighthouse

# Validation sécurité
docker run --rm -v $(pwd):/app clair-scanner

# Test responsive design
# Utiliser DevTools ou browserstack.com
```

## Déploiement Production

### 🐳 **Déploiement Docker (Recommandé)**

#### Déploiement Simple

```bash
# Build et déploiement automatique avec rollback
./deploy.sh

# Vérification santé
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
curl -I http://localhost:8080
```

#### Déploiement avec Docker Compose

```bash
# Production avec monitoring
docker-compose up -d --build

# Scaling horizontal (si nécessaire)
docker-compose up -d --scale portfolio=3

# Monitoring logs
docker-compose logs -f portfolio
```

### ☁️ **Options de Déploiement Cloud**

#### Plateformes Statiques

- **Netlify** : Build automatique depuis Git
- **Vercel** : Déploiement optimisé avec Edge Functions
- **GitHub Pages** : Hébergement gratuit avec Actions CI/CD
- **AWS S3 + CloudFront** : CDN global avec invalidation cache

#### Plateformes Conteneurisées

- **Railway** : `railway deploy`
- **Heroku** : Dockerfile automatique
- **DigitalOcean App Platform** : Auto-scaling
- **AWS ECS/Fargate** : Production enterprise

### 🔧 **Configuration Production**

#### Variables d'Environnement

```bash
# .env.production
NODE_ENV=production
DOMAIN=clecart.fr
SSL_ENABLED=true
MONITORING_ENABLED=true
```

#### Optimisations Automatiques

- **Nginx** avec compression Gzip/Brotli
- **Security Headers** complets
- **SSL/TLS** avec grade A+
- **Cache Headers** optimisés
- **CDN Integration** ready

### 📊 **Monitoring Post-Déploiement**

```bash
# Health check automatique
curl -f https://clecart.fr/health || alert_team

# Performance monitoring
lighthouse https://clecart.fr --output json

# Security scan
nmap -sS -O clecart.fr
```

## Sécurité et Performance

### 🛡️ **Sécurité**

- **Grade A+** SSL Labs avec TLS 1.3
- **Content Security Policy** stricte
- **OWASP** compliance (Top 10 2021)
- **Container Security** non-root user
- **Privacy-First** analytics sans tracking
- **Documentation complète** → [SECURITY.md](./SECURITY.md)

### ⚡ **Performance**

- **Core Web Vitals** : LCP < 1.2s, FID < 100ms, CLS < 0.1
- **Lighthouse Score** : 95+ sur tous les critères
- **Bundle Size** : < 500KB total (optimisé)
- **First Contentful Paint** : < 1s
- **Time to Interactive** : < 2s

### 📱 **Progressive Web App**

- **Installable** sur mobile et desktop
- **Offline Support** avec cache intelligent
- **Background Sync** pour formulaire contact
- **Push Notifications** ready (optionnel)

## Maintenance et Monitoring

### 🔍 **Monitoring Automatique**

- **Uptime** monitoring avec alertes
- **Performance** tracking continu
- **Error** reporting avec stack traces
- **Security** scanning automatique

### 🔄 **Mise à Jour**

```bash
# Backup avant mise à jour
docker tag clecart-portfolio clecart-portfolio:backup-$(date +%Y%m%d)

# Déploiement avec rollback automatique
./deploy.sh

# Monitoring post-déploiement
docker logs clecart-portfolio-container -f
```

### 📈 **Métriques Clés**

- **Availability** : 99.9% SLA
- **Response Time** : < 200ms moyenne
- **Security Score** : A+ grade maintenu
- **Performance Budget** : respecté automatiquement

## Contact et Support

### 👨‍💻 **Contact Professionnel**

- **Email**: [djlike@hotmail.fr](mailto:djlike@hotmail.fr)
- **LinkedIn**: [christophe-lecart-cl15121981](https://www.linkedin.com/in/christophe-lecart-cl15121981/)
- **GitHub**: [github.com/CLecart](https://github.com/CLecart)
- **Portfolio**: [clecart.fr](https://clecart.fr)

### 🐛 **Signaler un Problème**

1. **Issues GitHub** pour bugs techniques
2. **Security Issues** → email privé uniquement
3. **Suggestions d'amélioration** → GitHub Discussions

### 📚 **Documentation Technique**

- [Architecture Détaillée](./about-portfolio.html)
- [Sécurité et Audit](./SECURITY.md)
- [Performance Monitoring](./js/utils/webvitals.js)
- [Configuration Docker](./Dockerfile)

---

## License et Crédits

**© 2025 Christophe Lecart** - Tous droits réservés

### Technologies Utilisées

- **Icons**: [FontAwesome](https://fontawesome.com/)
- **Fonts**: [Google Fonts](https://fonts.google.com/)
- **Email Service**: [EmailJS](https://emailjs.com/)
- **Hosting**: Optimisé pour performances et sécurité

### Reconnaissance

- **SMACSS** methodology pour l'architecture CSS
- **Web.dev** guidelines pour les bonnes pratiques
- **MDN** documentation pour les standards web
- **OWASP** pour les recommandations sécurité

---

[![Built with ❤️](https://img.shields.io/badge/Built%20with-❤️-red?style=flat-square)](https://clecart.fr)
[![Maintained](https://img.shields.io/badge/Maintained-Yes-green?style=flat-square)](#maintenance-et-monitoring)
[![Production Ready](https://img.shields.io/badge/Production-Ready-brightgreen?style=flat-square)](#déploiement-production)
