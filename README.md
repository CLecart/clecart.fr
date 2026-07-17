# Professional Portfolio - Christophe Lecart

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=pwa&logoColor=white)

[![Build](https://img.shields.io/badge/Build-none%20required-informational?style=flat-square)](#technologies-and-architecture)
[![Hosting](https://img.shields.io/badge/Hosting-GitHub%20Pages-222222?style=flat-square)](#deployment)

## Table of Contents

- [About](#about)
- [Technologies and Architecture](#technologies-and-architecture)
- [Technical Features](#technical-features)
- [Featured Projects](#featured-projects)
- [Project Structure](#project-structure)
- [Installation and Development](#installation-and-development)
- [Deployment](#deployment)
- [Security and Performance](#security-and-performance)
- [Maintenance](#maintenance)
- [Contact and Support](#contact-and-support)

## About

Professional portfolio showcasing my web and mobile development skills, designed for recruiters and hiring managers. This website highlights my technical expertise and projects through a modern, responsive interface built with HTML5, CSS3, and JavaScript.

It is deliberately a **static site with no framework, no bundler, no build step and no backend**: the browser consumes the sources exactly as they are committed, and GitHub Pages serves them straight from this repository. Every constraint below follows from that choice — there is no compilation step to catch a mistake, so the discipline has to live in the code.

## Technologies and Architecture

### 🚀 **Core Technical Stack**

- **Frontend:** Semantic HTML5, CSS3 (Flexbox, Grid, Custom Properties), JavaScript ES2021 modules
- **CSS Architecture:** SMACSS-inspired folders (`base` / `components` / `layout` / `sections` / `theme` / `utils`), assembled by `styles.css`, a barrel of 22 `@import`
- **PWA:** Web App Manifest (standalone display, maskable icons, app shortcuts) and a Service Worker with precaching and per-destination cache strategies
- **Performance:** Client-side Core Web Vitals instrumentation, resource hints, WebP profile image, offscreen video pausing
- **Security:** Pinned and SRI-signed third-party scripts, no backend, security headers on the container deployment

### 🏗️ **DevOps and Infrastructure**

This tooling exists and works, but it is **not what serves clecart.fr** — see [Deployment](#deployment).

- **Containerization:** `nginx:alpine` image running as a non-root user, with a `HEALTHCHECK`
- **Orchestration:** Docker Compose with a health check and Traefik labels
- **Deployment script:** `deploy.sh` — tags a backup image, rebuilds, restarts, polls health, and rolls back automatically on error
- **Code Quality:** ESLint flat config (every rule at `error`, JSDoc enforced by `eslint-plugin-jsdoc`), Prettier
- **[CIBLE] Continuous Integration:** none. No workflow exists in this repository — lint, Lighthouse and any security scan are run **manually** or not at all.

### 🎯 **Technical Specializations**

- **Responsive Design:** Mobile-first, Progressive Enhancement
- **Accessibility:** WCAG 2.1 AA as the working target, keyboard navigation, captions on every demo video
- **UX/UI:** Adaptive theme system, micro-interactions, performant animation
- **SEO:** Semantic HTML, descriptive metadata, `sitemap.xml` and `robots.txt`

Backend skills (REST APIs, WebSocket, real-time features, PostgreSQL) are demonstrated by the
[featured projects](#featured-projects), which live in **separate repositories**. This one contains
no server-side code at all.

## Technical Features

### 🎨 **User Interface**

- **Design tokens** in `css/base/variables.css`: colors, plus a `--duration-*` / `--ease-*` / `--transition*` scale that animations draw from
- **Adaptive Theme:** the system preference is honored until the visitor toggles the theme; from then on their explicit choice is persisted in `localStorage` and wins. An inline bootstrap in `<head>` applies it before first paint to avoid a flash of wrong theme.
- **Micro-interactions** and animations driven by the Intersection Observer API
- **Responsive Design** with mobile-first breakpoints
- **Accessibility:** keyboard navigation, `<track kind="captions">` on every video, `prefers-reduced-motion` honored globally in `css/utils/animations.css`

### ⚡ **Performance and Optimization**

- **Core Web Vitals** observed in the browser (`js/utils/webvitals.js`): LCP, FID, CLS, FCP and TTFB via `PerformanceObserver`, with optimization triggers past the usual thresholds
- **Video playback:** an Intersection Observer pauses each demo video when it leaves the viewport and resumes it on the way back, so nothing decodes offscreen. On mobile, `videoHandler.js` strips `autoplay` and caps `preload` at `metadata`, so a visitor on cellular data never pays for a video they did not ask to watch.
- **Resource Hints:** `dns-prefetch`, `preconnect`, and a `preload` on `profile.webp` with `fetchpriority="high"`
- **Service Worker:** precached shell, network-first for navigation, cache-first for images/CSS/JS, and an in-worker SVG placeholder when an image cannot be fetched offline
- **WebP** for the profile image; the container also negotiates a `.webp` sibling when the client advertises support
- **[CIBLE] Desktop video lazy-loading:** `videoHandler.js` implements a `data-src` deferred-load path, but the current markup carries plain `<source src>`, so that path never runs and the demo videos are fetched eagerly on desktop. Wiring the markup to `data-src` is the outstanding work.
- **No minification or bundling:** sources ship as committed. Compression is the host's job — gzip is configured in `nginx.conf` for the container, and GitHub Pages compresses on its own.

### 🛡️ **Security and Compliance**

- **No backend, no database, no server-side session:** nothing the site owns processes a request, so there is no SQL injection surface and no server-side state to steal. Anything the page can read, a visitor can read — which is why no real secret lives here.
- **Subresource Integrity:** the two third-party resources that can carry it — Font Awesome 6.4.0 and the EmailJS SDK 3.12.1 — are pinned to an exact version and signed with `integrity` + `crossorigin="anonymous"`. Pinning always precedes signing: a floating range plus a hash breaks the site on the first upstream patch.
- **Content Security Policy and security headers** (`nginx-security-headers.conf`): **container deployment only.** GitHub Pages cannot serve custom headers, so these are **not active on clecart.fr** — full scope and rationale in [SECURITY.md](./SECURITY.md).
- **GDPR:** a single accept/decline banner (`js/utils/gdpr.js`), stored in `localStorage` rather than cookies. Declining is one click, is remembered, and disables both analytics and the contact form.
- **Privacy-First Analytics:** consent-gated and, as it stands, entirely local — no analytics endpoint is configured, so events are buffered in `localStorage` (last 50) and dropped. No personal data is collected and nothing is shared with a third party.
- **Container Security:** non-root user, health check, nginx configuration left owned by root

### 🚀 **DevOps and Production**

- **Infrastructure as Code** with Docker and Docker Compose
- **Automatic rollback:** `deploy.sh` tags the previous image before rebuilding and restores it through an `ERR` trap if anything fails. The old container is stopped before the new one starts, so a **brief interruption is expected** — this is not a zero-downtime setup.
- **Image retention:** the three most recent images are kept, older ones are pruned
- **[CIBLE] Uptime monitoring, alerting, error reporting and automated security scanning:** none of these exist today.

## Featured Projects

Each project lives in its own repository; the portfolio showcases each one with a captioned demo video.

- **Groupie-Tracker:** Go web application visualizing music artist data from a REST API, with search and filtering by name, dates or concert location
- **BombermanDX:** browser game inspired by the classic Bomberman, built with JavaScript and DOM manipulation — progressive levels, enemy AI, power-ups
- **Social Network:** full-stack social platform (Next.js, React, Prisma, PostgreSQL, Redis) with protected APIs, real-time chat over WebSocket, stories, groups and event RSVP
- **PartiQ:** product and ticket management platform with secure authentication, catalogue, ticket workflows, document handling and real-time updates, backed by PostgreSQL
- **AbrisCraft:** interactive 3D garden shed configurator with real-time material estimation (Next.js, React + TypeScript, React Three Fiber, Prisma/PostgreSQL)
- **Pochet du Courval Showcase:** luxury glassmaking brand showcase with an interactive 3D perfume bottle hero (Vite, React + TypeScript, Tailwind, Framer Motion, @react-three/fiber)

## Project Structure

### 📁 **Organizational Structure**

Every file below is tracked in this repository.

```text
clecart.fr/
├── 🏗️ Infrastructure
│   ├── Dockerfile                    # nginx:alpine image, non-root, healthcheck
│   ├── docker-compose.yml            # Container orchestration (port 8081)
│   ├── deploy.sh                     # Deployment script with rollback
│   ├── nginx.conf                    # Container server configuration
│   ├── nginx-security-headers.conf   # Security headers (container only)
│   ├── package.json                  # npm scripts and metadata
│   └── package-lock.json             # Pinned dev dependency tree
│
├── 🎨 Frontend Architecture
│   ├── css/                          # SMACSS-inspired architecture
│   │   ├── base/
│   │   │   ├── reset.css             # Browser normalization
│   │   │   └── variables.css         # Design tokens (colors, durations, easings)
│   │   ├── components/
│   │   │   ├── buttons.css           # Interactive button styles
│   │   │   ├── cards.css             # Card system
│   │   │   ├── dark-mode-toggle.css  # Light/dark theme toggle
│   │   │   ├── forms.css             # Forms with validation states
│   │   │   ├── gdpr.css              # GDPR consent banner
│   │   │   └── notifications.css     # Notification system
│   │   ├── layout/
│   │   │   ├── footer.css            # Responsive footer
│   │   │   └── header.css            # Main navigation
│   │   ├── sections/
│   │   │   ├── about.css             # About section
│   │   │   ├── contact.css           # Contact form
│   │   │   ├── hero.css              # Hero/banner section
│   │   │   ├── portfolio-details.css # about-portfolio.html page
│   │   │   ├── privacy.css           # Privacy policy page
│   │   │   ├── projects.css          # Projects gallery
│   │   │   └── skills.css            # Technical skills
│   │   ├── theme/
│   │   │   └── darkmode.css          # Full dark theme
│   │   └── utils/
│   │       ├── animations.css        # Animations + prefers-reduced-motion
│   │       ├── image-fallbacks.css   # Broken image fallbacks
│   │       ├── modals.css            # Accessible modal system
│   │       └── responsive.css        # Responsive media queries
│   │
│   ├── js/                           # Modular JavaScript architecture
│   │   ├── modules/                  # Business features
│   │   │   ├── animations.js         # Intersection Observer, transitions
│   │   │   ├── contact-form.js       # Validation, EmailJS integration
│   │   │   ├── darkmode.js           # System-aware adaptive theme
│   │   │   ├── navigation.js         # Responsive menu, smooth scroll
│   │   │   ├── project-navigation.js # Project navigation
│   │   │   └── videoHandler.js       # Video playback, offscreen pausing
│   │   │
│   │   ├── utils/                    # Technical utilities
│   │   │   ├── analytics.js          # Privacy-first, consent-gated tracking
│   │   │   ├── config.js             # EmailJS public identifiers
│   │   │   ├── gdpr.js               # Consent banner and enforcement
│   │   │   ├── modal.js              # Accessible modal system
│   │   │   ├── performance.js        # Runtime optimizations
│   │   │   ├── sw-register.js        # Service Worker registration
│   │   │   └── webvitals.js          # Core Web Vitals monitoring
│   │   │
│   │   └── main.js                   # Application entry point
│   │
│   ├── service-worker.js             # Root-scoped: a worker only controls its own directory
│   └── styles.css                    # Barrel importing the 22 CSS modules
│
├── 📦 Assets
│   ├── documents/
│   │   └── CV_Christophe_Lecart.pdf  # Professional resume
│   ├── icons/                        # Favicons + PWA icons
│   ├── images/                       # profile.webp, Konekt.png
│   ├── manifest/                     # site.webmanifest, browserconfig.xml
│   └── videos/                       # Project demos (.mp4 + .en.vtt captions)
│
├── 📄 Pages and Content
│   ├── index.html                    # Main page
│   ├── about-portfolio.html          # Technical documentation
│   ├── descriptions-projects.html    # Project details
│   ├── privacy-policy.html           # GDPR privacy policy
│   ├── cv/index.html                 # /cv download redirect
│   ├── robots.txt                    # SEO crawling directives
│   └── sitemap.xml                   # Structured sitemap
│
├── ⚙️ Development Configuration
│   ├── eslint.config.js              # ESLint flat config
│   ├── .prettierrc.json              # Prettier configuration
│   ├── .gitignore                    # Git exclusions
│   └── .agents/AGENTS.md             # Project engineering manifesto
│
└── 📚 Documentation and Hosting
    ├── README.md                     # This file
    ├── SECURITY.md                   # Security scope and audit notes
    └── CNAME                         # Custom domain for GitHub Pages
```

Not tracked, created locally: `node_modules/`, and `.vscode/`, `.env` and `config.json`
(all listed in `.gitignore`).

### 🔧 **Architectural Patterns**

- **SMACSS-inspired CSS layering** (folder-driven, no BEM naming)
- **Progressive Enhancement** JavaScript
- **Mobile-First Responsive Design**
- **Separation of Concerns** (Structure/Style/Behavior)
- **Explicit initialization:** modules expose functions (`initDarkMode`, `initNavigation`, `initVideoHandler`, …) that `js/main.js` calls; importing a module runs no side effect of its own

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

No install step is required to view the site — there is nothing to build. `npm install` is only
needed for the linting and audit tooling below.

### 🛠️ **Development Environment**

#### Prerequisites

- **Python 3** — `npm start` is a thin wrapper around `python3 -m http.server`
- **Node.js and npm** — only for ESLint, Prettier and Lighthouse (`package.json` declares `node >=16`)
- **Docker and Docker Compose** — optional, for the containerized flow

#### Available Scripts

```bash
# Development
npm start                    # Python development server on :8000
npm run docker:build         # Build Docker image
npm run docker:run           # Run local container on :8080
npm run docker:logs          # Tail container logs

# Validation and quality
npm run lint                 # ESLint (flat config; every rule is an error)
npm run lint:fix             # ESLint with autofix
npm run format               # Prettier over js/, css/, styles.css, eslint.config.js
npm run format:check         # Fail if anything is unformatted
npm run lighthouse           # Lighthouse audit of localhost:8000 (run npm start first)

# Deployment
npm run deploy               # Runs ./deploy.sh (Docker deployment)
npm run docker:stop          # Stop container and clean up
```

These are the only scripts defined in `package.json`.

HTML and CSS validation are done through the W3C services directly:
[validator.w3.org](https://validator.w3.org/) and
[jigsaw.w3.org/css-validator](https://jigsaw.w3.org/css-validator/).

### EmailJS identifiers

The EmailJS user, service and template identifiers live in `js/utils/config.js`
and are committed on purpose. They are **not** secrets: EmailJS publishes them
as public identifiers, the browser needs them to send the form, and they ship in
the page to every visitor regardless. Hiding them in an untracked file would
protect nothing while making the site undeployable — this project is served by
GitHub Pages, straight from the repository, with no build step able to inject an
untracked file.

What bounds the exposure is the EmailJS template, not the key: it sends to a
fixed address, so the identifiers can only ever trigger a message to the site
owner. Abuse costs the monthly request quota and nothing else — no data is
readable, no third party is reachable.

EmailJS's domain allowlist would filter by origin, but it is a paid feature and
this account is on the free plan: the domains listed there are inert. reCAPTCHA
v2, which EmailJS verifies server-side, would neutralise the key outright and is
free — deliberately not enabled, since it would hand Google a data point on
every visitor of a site that claims to share nothing with third parties. That
trade is not worth making at the current volume.

A real secret would not belong here at all: with no backend, anything the page
can read, a visitor can read.

### 🔧 **IDE Configuration**

`.vscode/` is gitignored, so a clone ships no editor configuration — any editor works. The two
extensions worth installing are the ones that mirror the enforced tooling:

- **ESLint** (`dbaeumer.vscode-eslint`) — correctness
- **Prettier** (`esbenp.prettier-vscode`) — formatting

### 🧪 **Tests and Validation**

There is **no automated test suite** in this repository, and no CI to run one. The checks that
exist are manual:

```bash
# Lint and formatting (must pass before committing)
npm run lint
npm run format:check

# Performance audit (start the server first)
npm start &
npm run lighthouse           # writes ./lighthouse-report.html

# Dependency vulnerabilities
npm audit
```

Security headers can only be checked against the container, which is the only place they are
served — see [SECURITY.md](./SECURITY.md).

## Deployment

### ☁️ **Production: GitHub Pages**

**clecart.fr is served by GitHub Pages, directly from this repository.** There is no build
step and no deployment pipeline: pushing to the deployed branch publishes the sources as they are.
`CNAME` holds the custom domain, and GitHub Pages terminates TLS itself — this repository contains
no certificate or TLS configuration.

The practical consequence: **custom HTTP headers cannot be set on GitHub Pages**, so the CSP and
security headers in `nginx-security-headers.conf` are inactive on the public site. What protects
it there is the absence of a backend, the pinned and SRI-signed third-party scripts, and the
absence of any server-side data processing.

### 🐳 **Docker Deployment (optional, self-hosting)**

The container is a fully working alternative for self-hosting — and the only way to exercise the
security headers — but it does **not** serve production.

```bash
# Build and deploy with automatic rollback on failure
./deploy.sh

# Health check
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
curl -I http://localhost:8080
```

```bash
# Or via Docker Compose (published on port 8081)
docker-compose up -d --build

# Follow the logs
docker-compose logs -f portfolio
```

`docker-compose.yml` pins `container_name` and a fixed host port, so the service is **not**
scalable with `--scale` as written. The Prometheus monitoring block in that file is commented
out — Compose brings up the portfolio container only.

### 📊 **Post-Deployment Checks**

```bash
# The public site is reachable
curl -I https://clecart.fr

# Performance audit against production
npx lighthouse https://clecart.fr --output json

# Security headers — container only; this returns nothing on GitHub Pages
curl -sI http://localhost:8080/ | grep -E "(X-|Content-Security|Referrer|Permissions)"
```

There is no `/health` endpoint: the health checks in `Dockerfile`, `docker-compose.yml` and
`deploy.sh` all probe `/`.

## Security and Performance

### 🛡️ **Security**

- **No backend, no database, no uploads** — the attack surface is the front-end supply chain and DOM injection, not a server
- **Supply chain:** Font Awesome and the EmailJS SDK are version-pinned and SRI-signed. The Google Fonts stylesheet cannot be signed (its CSS varies by user agent), and the skill icons are unpinned `<img>` SVGs from jsDelivr — images cannot carry SRI, and the CSP restricts `img-src` accordingly.
- **DOM injection:** no user-submitted value is ever interpolated into the DOM — the contact form's status and validation messages are fixed, developer-authored strings
- **Strict Content Security Policy** — **container deployment only**, inactive on GitHub Pages
- **Container Security** with non-root user and health checks
- **Privacy-First Analytics** without invasive tracking
- **[CIBLE] TLS grading and OWASP Top 10 conformance:** no SSL Labs test, no OWASP audit and no penetration test has been run against this site. TLS on clecart.fr is GitHub Pages' own configuration, not this repository's.
- **Full documentation** -> [SECURITY.md](./SECURITY.md)

### ⚡ **Performance**

Measured on the repository sources (2026-07-17):

- **HTML + CSS + JS:** 184 KB uncompressed, ~37 KB gzipped
- **Profile image:** `profile.webp`, 352 KB, preloaded with `fetchpriority="high"`
- **Demo videos:** ~41 MB across six files on disk, but browsers range-request them: **2.5 MB is actually transferred on load**, measured in Chrome on 2026-07-17, identically on desktop and under an iPhone user agent. The files are still fetched without waiting for the viewport (see the `[CIBLE]` above); the eager cost is 2.5 MB, not 41.
- **CSS delivery:** 23 requests in 2 waves (the barrel, then its 22 imports in parallel) — one extra discovery round-trip. Measured in Chrome on 2026-07-16 and deliberately kept: with no CI to regenerate a concatenated bundle, a committed bundle would drift from its sources at the first oversight.

**[CIBLE] Lighthouse scores and field Core Web Vitals:** not measured. No report is committed and
no audit runs automatically. `js/utils/webvitals.js` observes LCP, FID and CLS **in the visitor's
browser** and reacts past the standard thresholds (2500 ms / 100 ms / 0.1); it does not report
anywhere, so there is no historical data to quote.

### 📱 **Progressive Web App**

- **Installable** on mobile and desktop (standalone display, 192/512 icons in `any` and `maskable`, Contact and Projects shortcuts)
- **Offline Support:** precached shell, network-first navigation falling back to the cache, cache-first assets, in-worker SVG placeholder for unavailable images
- **[CIBLE] Background Sync and Push Notifications:** not implemented — the Service Worker handles `install`, `activate` and `fetch` only

## Maintenance

Maintenance is **manual**. There is no scheduled job, no alerting and no automated scan.

### 🔄 **Updating the container**

```bash
# Backup before update (deploy.sh does this on its own too)
docker tag clecart-portfolio clecart-portfolio:backup-$(date +%Y%m%d)

# Deployment with automatic rollback on failure
./deploy.sh

# Post-deployment logs
docker logs clecart-portfolio-container -f
```

### 📈 **What is actually tracked**

- **Availability:** GitHub Pages' own uptime — not monitored by this project, no SLA is claimed
- **Client-side vitals:** observed in the browser by `js/utils/webvitals.js`, not collected anywhere
- **Dependencies:** `npm audit`, run manually
- **[CIBLE] Performance budget, error reporting and uptime alerting:** would require a CI or an external monitor; neither exists.

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
- [Engineering Manifesto](./.agents/AGENTS.md)
- [Performance Monitoring](./js/utils/webvitals.js)
- [Docker Configuration](./Dockerfile)

---

## License and Credits

**© 2026 Christophe Lecart — All rights reserved.**

This repository is published for reading, not for reuse: no permission is
granted to copy, modify or redistribute its code or its content. `package.json`
declares `UNLICENSED` and `private` to say the same thing to tooling, and there
is deliberately no LICENSE file — adding one would grant rights.

The third-party dependencies listed below keep their own licenses.

### Technologies Used

- **Icons:** [FontAwesome](https://fontawesome.com/) (UI icons) and [Devicon](https://devicon.dev/) (skill logos)
- **Fonts:** [Google Fonts](https://fonts.google.com/) (Poppins)
- **Email Service:** [EmailJS](https://emailjs.com/)
- **Hosting:** [GitHub Pages](https://pages.github.com/)

### Acknowledgements

- **SMACSS** methodology for CSS architecture
- **Web.dev** guidelines for best practices
- **MDN** documentation for web standards
- **OWASP** recommendations for security

---

[![Built with ❤️](https://img.shields.io/badge/Built%20with-❤️-red?style=flat-square)](https://clecart.fr)
[![Maintained](https://img.shields.io/badge/Maintained-Yes-green?style=flat-square)](#maintenance)
