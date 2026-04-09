# Professional Portfolio - Christophe Lecart

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Go](https://img.shields.io/badge/Go-00ADD8?style=flat-square&logo=go&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=pwa&logoColor=white)

[![Security](https://img.shields.io/badge/Security-A%2B-green?style=flat-square)](#security-and-performance)
[![Performance](https://img.shields.io/badge/Performance-95%2B-brightgreen?style=flat-square)](#security-and-performance)
[![Accessibility](https://img.shields.io/badge/A11y-WCAG%202.1-blue?style=flat-square)](#technical-features)

## Table of Contents

- [About](#about)
- [Technologies and Architecture](#technologies-and-architecture)
- [Technical Features](#technical-features)
- [Featured Projects](#featured-projects)
- [Project Structure](#project-structure)
- [Installation and Development](#installation-and-development)
- [Production Deployment](#production-deployment)
- [Security and Performance](#security-and-performance)
- [Maintenance and Monitoring](#maintenance-and-monitoring)
- [Contact and Support](#contact-and-support)

## About

Professional portfolio showcasing my web and mobile development skills, designed for recruiters and hiring managers. This website highlights my technical expertise and projects through a modern, responsive interface built with HTML5, CSS3, and JavaScript.

The portfolio demonstrates my ability to create intuitive and high-performance user interfaces while following web development best practices.

## Technologies and Architecture

### 🚀 **Core Technical Stack**

- **Frontend:** Semantic HTML5, CSS3 (Flexbox, Grid, Custom Properties), JavaScript ES2021+
- **CSS Architecture:** Modular SMACSS organization with native CSS variables
- **PWA:** Advanced Service Worker, Web App Manifest, Background Sync
- **Performance:** Core Web Vitals monitoring, Lighthouse optimization, intelligent lazy loading
- **Security:** Content Security Policy, Security Headers, Container Security

### 🏗️ **DevOps and Infrastructure**

- **Containerization:** Multi-stage Docker build with non-root user
- **Orchestration:** Docker Compose with health checks
- **CI/CD:** Deployment scripts with automatic rollback
- **Monitoring:** Privacy-friendly analytics and performance tracking
- **Code Quality:** ESLint, Prettier, optimized VS Code configuration

### 🎯 **Technical Specializations**

- **Responsive Design:** Mobile-first, Progressive Enhancement
- **Accessibility:** WCAG 2.1 AA compliance, keyboard navigation
- **UX/UI:** Adaptive theme system, micro-interactions, performant animation
- **SEO:** Semantic HTML, Structured Data, Core Web Vitals optimization
- **Backend Integration:** RESTful API, WebSocket, real-time features

## Technical Features

### 🎨 **User Interface**

- **Modern Design System** with native CSS variables
- **Adaptive Theme** (system/light/dark) with persistence
- **Micro-interactions** optimized for performance
- **Responsive Design** with mobile-first breakpoints
- **Accessibility** (keyboard navigation, screen readers, contrast)

### ⚡ **Performance and Optimization**

- **Core Web Vitals** real-time monitoring
- **Intelligent Lazy Loading** for images and videos
- **Resource Hints** (preload, prefetch, preconnect)
- **Service Worker** with advanced caching strategies
- **Bundle Optimization** with compression and minification

### 🛡️ **Security and Compliance**

- **Strict Content Security Policy** with CDN whitelist
- **Comprehensive Security Headers** (HSTS, X-Frame-Options, etc.)
- **GDPR Compliance** with granular cookie consent management
- **Container Security** with non-root user and health checks
- **Privacy-First Analytics** without invasive tracking

### 🚀 **DevOps and Production**

- **Infrastructure as Code** with Docker and Docker Compose
- **Zero-Downtime Deployment** with automatic rollback
- **Health Monitoring** with integrated alerting
- **Backup Strategy** with versioning
- **Continuous Performance Monitoring** with detailed metrics

## Featured Projects

- **Groupie-Tracker:** Go web application for visualizing music artist API data
- **BombermanDX:** Browser game built in JavaScript with performance optimization
- **Social Network:** Full-stack social platform with secure authentication, real-time chat, stories, groups, and event RSVP
- **PartiQ:** Modern product and ticket management platform with secure authentication, document handling, real-time updates, and AI-assisted support features

## Project Structure

### 📁 **Organizational Structure**

```text
clecart.fr/
├── 🏗️ Infrastructure
│   ├── Dockerfile                    # Secure multi-stage build
│   ├── docker-compose.yml           # Production orchestration
│   ├── deploy.sh                    # Deployment script with rollback
│   ├── nginx.conf                   # Optimized server configuration
│   └── package.json                 # npm scripts and metadata
│
├── 🎨 Frontend Architecture
│   ├── css/                         # Modular SMACSS architecture
│   │   ├── base/                    # CSS foundations
│   │   │   ├── reset.css           # Browser normalization
│   │   │   └── variables.css       # Native CSS variables
│   │   ├── components/              # Reusable components
│   │   │   ├── buttons.css         # Interactive button styles
│   │   │   ├── cards.css           # Card system
│   │   │   ├── dark-mode-toggle.css # Light/dark theme toggle
│   │   │   ├── forms.css           # Forms with validation
│   │   │   ├── gdpr.css            # GDPR consent banner
│   │   │   └── notifications.css   # Notification system
│   │   ├── layout/                  # Global page structure
│   │   │   ├── footer.css          # Responsive footer
│   │   │   └── header.css          # Main navigation
│   │   ├── sections/                # Page-specific sections
│   │   │   ├── about.css           # About section
│   │   │   ├── approach.css        # Development approach
│   │   │   ├── contact.css         # Contact form
│   │   │   ├── cta.css             # Call-to-action buttons
│   │   │   ├── footer.css          # Global footer styles
│   │   │   ├── gdpr.css            # GDPR section
│   │   │   ├── hero.css            # Hero/banner section
│   │   │   ├── portfolio-details.css # Portfolio details
│   │   │   ├── privacy.css         # Privacy policy
│   │   │   ├── projects.css        # Projects gallery
│   │   │   └── skills.css          # Technical skills
│   │   ├── theme/                   # Theme management
│   │   │   └── darkmode.css        # Full dark theme
│   │   ├── utils/                   # Cross-cutting utilities
│   │   │   ├── animations.css      # Optimized CSS animations
│   │   │   ├── image-fallbacks.css # Broken image fallbacks
│   │   │   ├── modals.css          # Accessible modal system
│   │   │   └── responsive.css      # Responsive media queries
│   │   └── critical.css             # Inline critical CSS
│   │
│   ├── js/                          # Modular JavaScript architecture
│   │   ├── modules/                 # Business features
│   │   │   ├── animations.js        # Intersection Observer, transitions
│   │   │   ├── contact-form.js      # Validation, EmailJS integration
│   │   │   ├── darkmode.js          # System-aware adaptive theme
│   │   │   ├── navigation.js        # Responsive menu, smooth scroll
│   │   │   ├── project-navigation.js # Project navigation
│   │   │   └── videoHandler.js      # Optimized lazy-loaded videos
│   │   │
│   │   ├── utils/                   # Technical utilities
│   │   │   ├── analytics.js         # Privacy-first tracking
│   │   │   ├── config.js            # Runtime configuration loading
│   │   │   ├── gdpr.js              # Full GDPR compliance
│   │   │   ├── modal.js             # Accessible modal system
│   │   │   ├── performance.js       # Runtime optimizations
│   │   │   ├── service-worker.js    # Base Service Worker
│   │   │   ├── sw-register.js       # Service Worker registration
│   │   │   └── webvitals.js         # Core Web Vitals monitoring
│   │   │
│   │   ├── main.js                  # Application entry point
│   │   └── critical.js              # Inline critical JavaScript
│   │
│   └── styles.css                   # Main styles (legacy)
│
├── 📦 Optimized Assets
│   ├── documents/                   # Downloadable documents
│   │   └── CV_Christophe_Lecart.pdf # Professional resume
│   ├── icons/                       # Full icon system
│   ├── images/                      # Optimized images
│   ├── manifest/                    # PWA configuration
│   └── videos/                      # Project demos
│
├── 📄 Pages and Content
│   ├── index.html                   # Main SEO-optimized page
│   ├── about-portfolio.html         # Technical documentation
│   ├── descriptions-projects.html   # Project details
│   ├── privacy-policy.html          # GDPR privacy policy
│   ├── robots.txt                   # SEO crawling directives
│   └── sitemap.xml                  # Structured sitemap
│
├── ⚙️ Development Configuration
│   ├── .gitignore                  # Git exclusions
│   ├── SECURITY.md                 # Security documentation
│   └── README.md                   # Full project documentation
│
└── 📊 Monitoring and Documentation
    └── CNAME                        # Custom domain configuration
```

### 🔧 **Architectural Patterns**

- **Modular CSS Architecture** (SMACSS + BEM)
- **Progressive Enhancement** JavaScript
- **Mobile-First Responsive Design**
- **Component-Based Development**
- **Separation of Concerns** (Structure/Style/Behavior)

## Installation and Development

### 🚀 **Quick Setup**

```bash
# Clone the repository
git clone https://github.com/CLecart/clecart.fr.git
cd clecart.fr

# Start the development server
npm start
# or
python3 -m http.server 8000

# Open the application
open http://localhost:8000
```

### 🛠️ **Development Environment**

#### Prerequisites

- Node.js 18+
- npm 9+
- Docker and Docker Compose (optional for containerized flow)

#### Available Scripts

```bash
# Development
npm start                    # Python development server
npm run docker:build         # Build Docker image
npm run docker:run           # Run local container

# Validation and quality
npm run validate:html        # W3C HTML validation
npm run validate:css         # W3C CSS validation
npm run lighthouse           # Full Lighthouse audit

# Deployment
npm run deploy               # Production deployment script
npm run docker:stop          # Stop container and clean up
```

Note: some scripts/documentation commands (for example, `docs:generate`, `docs:serve`, `jsdoc:convert`) rely on optional config files and scripts (jsdoc, `scripts/convert-to-jsdoc.sh`). These resources are not included by default in this repository, but you can add them if you want to generate documentation with jsdoc.

### Secret Management (EmailJS) - recommended

To avoid committing tokens, use the following flow:

1. Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
# Edit .env and enter your values
```

2. Generate the runtime `config.json` file (gitignored):

```bash
./scripts/generate-config-from-env.sh
```

3. Deploy while ensuring `config.json` is present at the root (or use a Docker entrypoint step that writes `config.json` from CI/CD environment variables).

Never commit `.env` or `config.json` - both are listed in `.gitignore`.

### 🔧 **IDE Configuration (VS Code)**

Recommended extensions and settings:

- **ESLint + Prettier** for code quality
- **Live Server** for hot reload
- **CSS Peek** for CSS navigation
- **Docker** for container management
- **Todo Tree** for task tracking

### 🧪 **Tests and Validation**

```bash
# Local performance tests
npm run lighthouse

# Security validation
docker run --rm -v $(pwd):/app clair-scanner

# Responsive design testing
# Use DevTools or browserstack.com
```

## Production Deployment

### 🐳 **Docker Deployment (Recommended)**

#### Simple Deployment

```bash
# Build and deploy with automatic rollback
./deploy.sh

# Health check
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
curl -I http://localhost:8080
```

#### Docker Compose Deployment

```bash
# Production with monitoring
docker-compose up -d --build

# Horizontal scaling (if needed)
docker-compose up -d --scale portfolio=3

# Monitoring logs
docker-compose logs -f portfolio
```

### ☁️ **Cloud Deployment Options**

#### Static Platforms

- **Netlify:** Automatic build from Git
- **Vercel:** Optimized deployment with edge capabilities
- **GitHub Pages:** Free hosting with CI/CD actions
- **AWS S3 + CloudFront:** Global CDN with cache invalidation

#### Container Platforms

- **Railway:** `railway deploy`
- **Heroku:** Dockerfile-based deployment
- **DigitalOcean App Platform:** Auto-scaling
- **AWS ECS/Fargate:** Enterprise production setup

### 🔧 **Production Configuration**

#### Environment Variables

```bash
# .env.production
NODE_ENV=production
DOMAIN=clecart.fr
SSL_ENABLED=true
MONITORING_ENABLED=true
```

#### Automatic Optimizations

- **Nginx** with Gzip/Brotli compression
- **Complete Security Headers**
- **SSL/TLS** with A+ grade target
- **Optimized Cache Headers**
- **CDN Integration** ready

### 📊 **Post-Deployment Monitoring**

```bash
# Automatic health check
curl -f https://clecart.fr/health || alert_team

# Performance monitoring
lighthouse https://clecart.fr --output json

# Security scan
nmap -sS -O clecart.fr
```

## Security and Performance

### 🛡️ **Security**

- **A+ Grade** SSL Labs target with TLS 1.3
- **Strict Content Security Policy**
- **OWASP** compliance (Top 10 2021)
- **Container Security** with non-root user
- **Privacy-First Analytics** without invasive tracking
- **Full documentation** -> [SECURITY.md](./SECURITY.md)

### ⚡ **Performance**

- **Core Web Vitals:** LCP < 1.2s, FID < 100ms, CLS < 0.1
- **Lighthouse Score:** 95+ across all categories
- **Bundle Size:** < 500KB total (optimized)
- **First Contentful Paint:** < 1s
- **Time to Interactive:** < 2s

### 📱 **Progressive Web App**

- **Installable** on mobile and desktop
- **Offline Support** with intelligent caching
- **Background Sync** for the contact form
- **Push Notifications** ready (optional)

## Maintenance and Monitoring

### 🔍 **Automated Monitoring**

- **Uptime** monitoring with alerts
- **Performance** continuous tracking
- **Error** reporting with stack traces
- **Security** automatic scanning

### 🔄 **Updates**

```bash
# Backup before update
docker tag clecart-portfolio clecart-portfolio:backup-$(date +%Y%m%d)

# Deployment with automatic rollback
./deploy.sh

# Post-deployment monitoring
docker logs clecart-portfolio-container -f
```

### 📈 **Key Metrics**

- **Availability:** 99.9% SLA
- **Response Time:** < 200ms average
- **Security Score:** A+ grade maintained
- **Performance Budget:** automatically enforced

## Contact and Support

### 👨‍💻 **Professional Contact**

- **Email:** [djlike@hotmail.fr](mailto:djlike@hotmail.fr)
- **LinkedIn:** [christophe-lecart-cl15121981](https://www.linkedin.com/in/christophe-lecart-cl15121981/)
- **GitHub:** [github.com/CLecart](https://github.com/CLecart)
- **Portfolio:** [clecart.fr](https://clecart.fr)

### 🐛 **Report an Issue**

1. **GitHub Issues** for technical bugs
2. **Security Issues** -> private email only
3. **Improvement Suggestions** -> GitHub Discussions

### 📚 **Technical Documentation**

- [Detailed Architecture](./about-portfolio.html)
- [Security and Audit](./SECURITY.md)
- [Performance Monitoring](./js/utils/webvitals.js)
- [Docker Configuration](./Dockerfile)

---

## License and Credits

**© 2025 Christophe Lecart** - All rights reserved

### Technologies Used

- **Icons:** [FontAwesome](https://fontawesome.com/)
- **Fonts:** [Google Fonts](https://fonts.google.com/)
- **Email Service:** [EmailJS](https://emailjs.com/)
- **Hosting:** Optimized for performance and security

### Acknowledgements

- **SMACSS** methodology for CSS architecture
- **Web.dev** guidelines for best practices
- **MDN** documentation for web standards
- **OWASP** recommendations for security

---

[![Built with ❤️](https://img.shields.io/badge/Built%20with-❤️-red?style=flat-square)](https://clecart.fr)
[![Maintained](https://img.shields.io/badge/Maintained-Yes-green?style=flat-square)](#maintenance-and-monitoring)
[![Production Ready](https://img.shields.io/badge/Production-Ready-brightgreen?style=flat-square)](#production-deployment)
