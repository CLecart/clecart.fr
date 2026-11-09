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
- **CSS Architecture:** SMACSS-inspired folders (`base` / `components` / `layout` / `sections` / `theme` / `utils`), assembled by `styles.css`, a barrel of 24 `@import`
- **PWA:** Web App Manifest (standalone display, maskable icons, app shortcuts) and a Service Worker that keeps what passes through it, with per-destination cache strategies and no precache list
- **Performance:** font preloads, a WebP profile photo in two sizes, demo videos paused offscreen and not loaded on phones until played
- **Security:** No third-party resource on load — font, icons and logos are served by the site itself, at pinned versions; the contact form calls the EmailJS API without its SDK, and loads Google reCAPTCHA only once a visitor who accepted the banner starts writing — no backend, a Content-Security-Policy in every page, security headers on the container deployment

### 🏗️ **DevOps and Infrastructure**

This tooling exists and works, but it is **not what serves clecart.fr** — see [Deployment](#deployment).

- **Containerization:** `nginxinc/nginx-unprivileged:1.30.6-alpine`, pinned; nginx runs as uid 101 on port 8080 over a site owned by root, with a `HEALTHCHECK`
- **Orchestration:** Docker Compose v2 (`docker compose`) for a local run on `127.0.0.1:8080`, read-only, without Linux capabilities; the image's `HEALTHCHECK` is the only health check
- **Deployment script:** `deploy.sh` — tags a backup image, rebuilds, restarts a read-only container without Linux capabilities, polls the site for up to 60 seconds, and rolls back automatically if starting or answering fails
- **Code Quality:** ESLint flat config (every rule at `error`, JSDoc enforced by `eslint-plugin-jsdoc`, `eslint-plugin-sonarjs` recommended rules with cognitive complexity capped at 15), Stylelint (`stylelint-config-standard`, `!important` forbidden), Prettier, the Nu Html Checker (`vnu-jar`) on every page and stylesheet, warnings included, a check that every Content-Security-Policy lists the hash of each inline script, and `npm audit` — all six behind `npm run check`
- **Continuous Integration:** `.github/workflows/check.yml` runs `npm run check` on every push to `main`, on every pull request and weekly, its actions pinned by commit SHA; `.github/dependabot.yml` proposes npm, GitHub Actions and Docker updates every week. Lighthouse, axe and the browser checks are still run **manually**.

### 🎯 **Technical Specializations**

- **Responsive Design:** Mobile-first, Progressive Enhancement
- **Accessibility:** WCAG 2.1 AA as the working target, a skip link and one visible focus ring on every page, keyboard navigation, a timed text description on every demo video
- **UX/UI:** Adaptive theme system, micro-interactions, performant animation
- **SEO:** Semantic HTML, descriptive metadata, `sitemap.xml` and `robots.txt`

Backend skills (REST APIs, WebSocket, real-time features, PostgreSQL) are demonstrated by the
[featured projects](#featured-projects), which live in **separate repositories**. This one contains
no server-side code at all.

## Technical Features

### 🎨 **User Interface**

- **Design tokens** in `css/base/variables.css`: colors, plus a `--duration-*` / `--ease-*` / `--transition*` scale that animations draw from
- **One card hover, for every card.** Lift, neon glow, border and icon pulse live once in `css/components/cards.css` and read their values from four tokens; no section file redefines them. The pulse factor is _derived_ rather than chosen — `scale = 1 + var(--card-pulse-travel) ÷ size` — because `scale` grows an element in proportion to its size, so a single factor on a 14px bullet and a 40px logo produces two visibly different animations. Deriving it keeps every icon travelling the same 3.6px.
- **Adaptive Theme:** the system preference is honored until the visitor toggles the theme; from then on their explicit choice is persisted in `localStorage` and wins. An inline bootstrap in `<head>` applies it before first paint to avoid a flash of wrong theme.
- **Micro-interactions** and animations driven by the Intersection Observer API
- **Responsive Design** with mobile-first breakpoints
- **Accessibility:** keyboard navigation, `<track kind="captions">` on every video — the six demos are silent, so the cues describe what is on screen rather than transcribe speech — `prefers-reduced-motion` honored globally: `css/utils/animations.css` zeroes the duration tokens every animation reads, and the typewriter, driven by JavaScript timers, shows its first title and stops

### ⚡ **Performance and Optimization**

- **Video playback:** an Intersection Observer pauses each demo video when it leaves the viewport and resumes it on the way back, so nothing decodes offscreen; a video the visitor paused stays paused. On a phone, and under `prefers-reduced-motion`, `video-handler.js` removes `autoplay` and sets `preload="none"` with a poster, a still of the demo as a small WebP: nothing of the video loads until it is played. The posters are set by the script only, so a desktop visitor whose videos play on arrival never fetches them.
- **Preloads:** only the Poppins faces each page's first viewport draws (400 and 700 everywhere, 600 on the home page). The profile photo is not preloaded: it sits below the first screen at 375, 1280 and 1920 px wide, where the largest paint is the hero's heading, so it loads lazily (measured in Chrome on 2026-11-03). There is no `dns-prefetch` or `preconnect` left: no page loads anything from another host.
- **Self-hosted font:** Poppins latin 400/600/700 in `assets/fonts/` (23.7 KB of woff2), byte-identical to the files Google Fonts served, declared in `css/base/fonts.css` with Google's own `unicode-range`. Measured in Chrome on 2026-11-02 on a local HTTP/2 server throttled to 150 ms / 1.6 Mbps: with the preloads the fonts arrive before first paint in 7 runs out of 7 (0/7 without), and CLS falls from 0.032 to 0.003 on the home page.
- **Skill logos:** the nine devicon 2.18.0 SVGs live in `assets/icons/devicon/` (23.0 KB, 9.2 KB gzipped), instead of an unpinned jsDelivr URL.
- **UI icons from one local sprite:** the 21 Font Awesome Free 7.3.1 icons the pages draw are `<symbol>`s in `assets/icons/sprite.svg` (14.7 KB, 5.6 KB gzipped), drawn with `<use>` in `currentColor`. Measured in Chrome on 2026-11-02 against the Font Awesome 6.4.0 webfont the sprite replaced: a first visit to the home page fetches the sprite in one same-origin request, 5.7 KB gzipped on the wire, instead of 279 KB in three requests to cdnjs (19 KB of CSS, 151 KB and 109 KB of woff2); a reload takes the sprite from Chrome's memory cache, 0 bytes.
- **Service Worker:** no precache list to keep in step with the site — each same-origin response is stored as it passes, and the page that installs the worker sends it the URLs it already loaded. Pages, CSS, JS, fonts and the icon sprite are network-first: whatever the network answers is served, a 404 included, and the copy is used only when the fetch fails offline. A page is cached and looked up without its query string, so tracking links do not grow the cache. Same-origin images are served from the cache at once and refreshed from the network behind it (stale-while-revalidate), so a replaced image reaches a returning visitor one visit later; an in-worker SVG placeholder stands in for one that cannot be fetched offline. Videos, captions and the EmailJS call are not intercepted. Nothing fingerprints the URLs, so serving pages, CSS or JS from cache would pin a returning visitor to the version they first loaded, with no event able to invalidate it.
- **WebP** for the profile photo (300 and 500 px, chosen by `srcset`) and the video posters
- **Video weight:** measured at **0 bytes fetched on load**, desktop and mobile alike, for ~5 MB of demo footage on disk (Chrome, 2026-11-02). The six demos are 480p H.264 with no audio track: they are silent, and no card shows them wider than 357 CSS px (measured on a 430 px wide phone). Browsers already defer an autoplay video they cannot show; the only thing that ever broke that was one stray `preload="auto"` on a card hidden behind "View More Projects", since removed.
- **No minification or bundling:** sources ship as committed. Compression is the host's job — gzip is configured in `nginx.conf` for the container, and GitHub Pages compresses on its own.

### 🛡️ **Security and Compliance**

- **No backend, no database, no server-side session:** nothing the site owns processes a request, so there is no SQL injection surface and no server-side state to steal. Anything the page can read, a visitor can read — which is why no real secret lives here.
- **No third-party resource on load:** the font, the UI icons and the skill logos are served by the site itself. The contact form posts to the EmailJS REST API with `fetch`, the same request EmailJS's SDK makes. Google reCAPTCHA, the anti-spam checkbox, is the only third-party script, and it loads only once a visitor who accepted the banner clicks into a field of the form. Measured in Chrome on 2026-11-09: no page contacts any host but its own on load; Google is contacted only on that first click, `api.emailjs.com` only when the form is sent.
- **Content Security Policy:** every page carries one in a `<meta>` tag, so it applies on clecart.fr too: same-origin resources only, the one inline script allowed by its hash, EmailJS as the only other host the page may call. `npm run check:csp` fails if an inline script and its hash drift apart. The other security headers (`nginx-security-headers.conf`) exist only on the container: GitHub Pages cannot send custom headers — full scope in [SECURITY.md](./SECURITY.md).
- **GDPR:** a single accept/decline banner (`js/utils/gdpr.js`), stored in `localStorage` rather than cookies. Declining is one click, is remembered, and disables the contact form.
- **No analytics:** the site measures nothing about a visit. The usage buffer an earlier version kept in `localStorage`, consent-gated and never sent anywhere, is erased on the visitor's next visit.
- **Container Security:** nginx runs as uid 101; the site and the nginx configuration belong to root and are read-only to it; health check

### 🚀 **DevOps and Production**

- **Infrastructure as Code** with Docker and Docker Compose
- **Automatic rollback:** `deploy.sh` tags the previous image before rebuilding and restores it through an `ERR` trap if anything fails. The old container is stopped before the new one starts, so a **brief interruption is expected** — this is not a zero-downtime setup.
- **Image retention:** the three most recent images are kept, older ones are pruned
- **[CIBLE] Uptime monitoring, alerting, error reporting and security scanning beyond `npm audit`:** none of these exist today.

## Featured Projects

Each project lives in its own repository; the portfolio showcases each one with a silent demo video, captioned with a description of what it shows.

- **Groupie-Tracker:** Go web application visualizing music artist data from a REST API, with search and filtering by name, dates or concert location
- **BombermanDX:** browser game inspired by the classic Bomberman, built with JavaScript and DOM manipulation — progressive levels, enemy AI, power-ups
- **Social Network:** full-stack social platform (Next.js, React, Prisma, PostgreSQL, Redis) with protected APIs, real-time chat over WebSocket, stories, groups and event RSVP
- **PartiQ:** product and ticket management platform with secure authentication, catalogue, ticket workflows, document handling and real-time updates, backed by PostgreSQL
- **AbrisCraft:** interactive 3D garden shed configurator with real-time material estimation (Next.js, React + TypeScript, React Three Fiber, Prisma/PostgreSQL)
- **Pochet du Courval Showcase:** luxury glassmaking brand showcase with an interactive 3D perfume bottle hero (Vite, React + TypeScript, Tailwind, Framer Motion, @react-three/fiber)

## Project Structure

### 📁 **Organizational Structure**

Every tracked file is listed below, and nothing else: checked file for file
against `git ls-files` on 2026-11-02.

```text
clecart.fr/
├── 🏗️ Infrastructure
│   ├── Dockerfile                    # nginx-unprivileged 1.30.6, uid 101, healthcheck
│   ├── docker-compose.yml            # Container orchestration (port 8080)
│   ├── deploy.sh                     # Deployment script with rollback
│   ├── nginx.conf                    # Container server configuration
│   ├── nginx-security-headers.conf   # Security headers (container only)
│   ├── .dockerignore                 # Allowlist of the build context
│   ├── package.json                  # npm scripts and metadata
│   └── package-lock.json             # Pinned dev dependency tree
│
├── 🎨 Frontend Architecture
│   ├── css/                          # SMACSS-inspired architecture
│   │   ├── base/
│   │   │   ├── fonts.css             # Self-hosted Poppins (@font-face)
│   │   │   ├── reset.css             # Browser normalization
│   │   │   └── variables.css         # Design tokens (colors, durations, easings)
│   │   ├── components/
│   │   │   ├── buttons.css           # Interactive button styles
│   │   │   ├── cards.css             # Card system and shared hover
│   │   │   ├── dark-mode-toggle.css  # Light/dark theme toggle
│   │   │   ├── forms.css             # Form fields, status messages, trap field
│   │   │   ├── gdpr.css              # GDPR consent banner
│   │   │   ├── icons.css             # Sprite icon metrics (size, baseline)
│   │   │   ├── notifications.css     # Service worker update notice
│   │   │   └── skip-link.css         # Skip link, shown on keyboard focus
│   │   ├── layout/
│   │   │   ├── footer.css            # Responsive footer
│   │   │   ├── header.css            # Main navigation
│   │   │   └── section.css           # Section separator line
│   │   ├── sections/
│   │   │   ├── about.css             # About section
│   │   │   ├── contact.css           # Contact form
│   │   │   ├── hero.css              # Hero/banner section
│   │   │   ├── portfolio-details.css # about-portfolio.html page
│   │   │   ├── privacy.css           # Privacy policy page
│   │   │   ├── projects.css          # Projects gallery
│   │   │   └── skills.css            # Technical skills
│   │   ├── theme/
│   │   │   ├── darkmode.css          # Full dark theme
│   │   │   └── forced-colors.css     # Windows High Contrast and other forced colours
│   │   └── utils/
│   │       └── animations.css        # Animations + prefers-reduced-motion
│   │
│   ├── js/                           # Modular JavaScript architecture
│   │   ├── modules/                  # Business features
│   │   │   ├── animations.js         # Intersection Observer, transitions
│   │   │   ├── captcha.js            # Google reCAPTCHA, loaded on the form's first field
│   │   │   ├── contact-form.js       # Validation, EmailJS integration
│   │   │   ├── darkmode.js           # System-aware adaptive theme
│   │   │   ├── navigation.js         # Responsive menu, smooth scroll
│   │   │   ├── project-navigation.js # Project tabs, deep links
│   │   │   ├── video-handler.js      # Video playback, offscreen pausing
│   │   │   └── view-more.js          # Project grid's View More toggle
│   │   │
│   │   ├── utils/                    # Technical utilities
│   │   │   ├── config.js             # EmailJS public identifiers
│   │   │   ├── gdpr.js               # Consent banner and enforcement
│   │   │   ├── storage.js            # localStorage access that never throws
│   │   │   └── sw-register.js        # Service Worker registration
│   │   │
│   │   ├── cv.js                     # Entry point of cv/index.html
│   │   └── main.js                   # Application entry point
│   │
│   ├── service-worker.js             # Root-scoped: a worker only controls its own directory
│   └── styles.css                    # Barrel importing the 24 CSS modules
│
├── 📦 Assets
│   └── assets/
│       ├── documents/
│       │   └── CV_Christophe_Lecart.pdf # Professional resume
│       ├── fonts/                    # Poppins, self-hosted (latin subset)
│       │   ├── OFL.txt               # SIL Open Font License 1.1
│       │   ├── poppins-latin-400.woff2
│       │   ├── poppins-latin-600.woff2
│       │   └── poppins-latin-700.woff2
│       ├── icons/                    # Favicons, PWA icons, UI sprite, skill logos
│       │   ├── devicon/              # Skill logos, devicon 2.18.0
│       │   │   ├── css3-original.svg
│       │   │   ├── docker-original.svg
│       │   │   ├── git-original.svg
│       │   │   ├── go-original.svg
│       │   │   ├── html5-original.svg
│       │   │   ├── java-original.svg
│       │   │   ├── javascript-original.svg
│       │   │   ├── LICENSE.txt       # devicon's MIT licence
│       │   │   ├── python-original.svg
│       │   │   └── sqlite-original.svg
│       │   ├── android-chrome-192x192.png
│       │   ├── android-chrome-512x512.png
│       │   ├── android-chrome-maskable-192x192.png
│       │   ├── android-chrome-maskable-512x512.png
│       │   ├── apple-touch-icon.png
│       │   ├── favicon-16x16.png
│       │   ├── favicon-32x32.png
│       │   ├── favicon.ico
│       │   └── sprite.svg            # Font Awesome Free 7.3.1, 21 UI icons
│       ├── images/
│       │   ├── posters/              # A still of each demo, shown before it plays
│       │   │   ├── AbrisCraft.webp
│       │   │   ├── BombermanDX.webp
│       │   │   ├── Groupie-Tracker.webp
│       │   │   ├── Konekt.webp
│       │   │   ├── PartiQ.webp
│       │   │   └── pochet-du-courval-preview.webp
│       │   ├── profile-300.webp      # Profile photo for slots up to 300 device px
│       │   └── profile.webp
│       ├── manifest/
│       │   └── site.webmanifest
│       └── videos/                   # Project demos (.mp4 + .en.vtt captions)
│           ├── AbrisCraft.en.vtt
│           ├── AbrisCraft.mp4
│           ├── BombermanDX.en.vtt
│           ├── BombermanDX.mp4
│           ├── Groupie-Tracker.en.vtt
│           ├── Groupie-Tracker.mp4
│           ├── Konekt.en.vtt
│           ├── Konekt.mp4
│           ├── PartiQ.en.vtt
│           ├── PartiQ.mp4
│           ├── pochet-du-courval-preview.en.vtt
│           └── pochet-du-courval-preview.mp4
│
├── 📄 Pages and Content
│   ├── index.html                    # Main page
│   ├── about-portfolio.html          # Technical documentation
│   ├── descriptions-projects.html    # Project details
│   ├── privacy-policy.html           # GDPR privacy policy
│   ├── 404.html                      # Page for any missing path
│   ├── cv/index.html                 # /cv download redirect
│   ├── robots.txt                    # SEO crawling directives
│   ├── sitemap.xml                   # Structured sitemap
│   └── .well-known/security.txt      # Where to report a vulnerability (RFC 9116)
│
├── ⚙️ Development Configuration
│   ├── eslint.config.js              # ESLint flat config, with sonarjs
│   ├── stylelint.config.mjs          # Stylelint: standard config, no !important
│   ├── .github/workflows/check.yml   # CI: npm run check on every push to main
│   ├── .github/dependabot.yml        # Weekly update proposals: npm, actions, Docker
│   ├── scripts/check-csp.mjs         # CSP hashes match the inline scripts
│   ├── .prettierrc.json              # Prettier configuration
│   ├── .gitignore                    # Git exclusions
│   └── .agents/AGENTS.md             # Project engineering manifesto
│
└── 📚 Documentation and Hosting
    ├── README.md                     # This file
    ├── SECURITY.md                   # Security scope and audit notes
    ├── _config.yml                   # Lets GitHub Pages publish .well-known/
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
- **Node.js `^22.22.2 || >=24.15.0` and npm** — only for the tooling: ESLint, Stylelint, Prettier, the Nu Html Checker, Puppeteer and Lighthouse. The floor comes from `eslint-plugin-jsdoc` 65; ESLint 10 alone would accept `^20.19.0`
- **Java 11 or later** — only for `npm run validate`: the Nu Html Checker is a Java program
- **Docker with Compose v2** (`docker compose`) — optional, for the containerized flow

#### Available Scripts

```bash
# Development
npm start                    # Python development server on :8000
npm run docker:build         # Build Docker image
npm run docker:run           # Run local container on :8080
npm run docker:logs          # Show container logs

# Validation and quality
npm run check                # Everything below except lint:fix, format and lighthouse; what CI runs
npm run lint                 # ESLint (flat config with jsdoc and sonarjs; every rule is an error)
npm run lint:fix             # ESLint with autofix
npm run lint:css             # Stylelint (standard config, no !important)
npm run validate             # Nu Html Checker on every page and stylesheet, warnings fail too
npm run check:csp            # Every CSP lists the hash of each inline script
npm run format               # Prettier over js/, css/, styles.css, service-worker.js, scripts/, the pages, the lint configs
npm run format:check         # Fail if anything is unformatted
npm run lighthouse           # Lighthouse audit of localhost:8000 (run npm start first)

# Deployment
npm run deploy               # Runs ./deploy.sh (Docker deployment)
npm run docker:stop          # Stop container and clean up
```

These are the only scripts defined in `package.json`.

`npm run validate` runs the same Nu Html Checker as
[validator.w3.org/nu](https://validator.w3.org/nu/), offline, from the `vnu-jar`
package. Two messages are filtered: an _info_ about the `/>` Prettier writes on
void elements, harmless here since every attribute value is quoted, and the
checker's own Content-Security-Policy warnings — it reads the pages from disk,
where `'self'` matches no `file:` URL and hashes are not computed, so it flags
every resource. `npm run check:csp` and the browser checks cover the policy.

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
free. It was held back while it would have handed Google a data point on
every visitor; it is enabled since 2026-11-09, when the phishing campaign kept
coming past the trap, and it loads only when a visitor who accepted the banner
clicks into a field of the form — Google never sees the others.

The page itself turns away scripted submissions: a browser under automation
(`navigator.webdriver`) or a filled-in off-screen trap field gets the usual
success message, and nothing is sent. That guards the form, not the key — a
script calling the EmailJS API directly with the public identifiers never runs
it. Spam that keeps arriving with the trap in place takes that path, which
reCAPTCHA closes: EmailJS refuses any message without a solved token, page or
no page (`js/modules/captcha.js`).

A real secret would not belong here at all: with no backend, anything the page
can read, a visitor can read.

### 🔧 **IDE Configuration**

`.vscode/` is gitignored, so a clone ships no editor configuration — any editor works. The three
extensions worth installing are the ones that mirror the enforced tooling:

- **ESLint** (`dbaeumer.vscode-eslint`) — correctness
- **Stylelint** (`stylelint.vscode-stylelint`) — CSS conformance
- **Prettier** (`esbenp.prettier-vscode`) — formatting

### 🧪 **Tests and Validation**

There is **no automated test suite** in this repository. CI runs the static checks on every
push; the rest is manual:

```bash
# Lint, formatting, validation and audit: what CI runs (must pass before committing)
npm run check

# Performance audit (start the server first)
npm start &
npm run lighthouse           # writes ./lighthouse-report.html

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
it there is the absence of a backend, the absence of any third-party resource (everything the
pages load is served, pinned, from this repository), and the absence of any server-side data
processing.

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
# Or via Docker Compose v2 (published on port 8080)
docker compose up -d --build

# Follow the logs
docker compose logs -f portfolio
```

`docker-compose.yml` pins `container_name` and a fixed host port, so the service is **not**
scalable with `--scale` as written. It publishes the same host port as `deploy.sh` and
`npm run docker:run`, 8080: run one of them at a time. Compose brings up the portfolio container
only.

What the container sends, from `nginx.conf`:

- **Caching:** `no-cache` for HTML, CSS, JS, the web manifest, the captions and the icon sprite —
  none of their URLs carries a version, so each use revalidates and an unchanged file costs a 304;
  one week (`max-age=604800`) for images, fonts and videos.
- **Types:** `.vtt` as `text/vtt` and `.webmanifest` as `application/manifest+json`, which nginx's
  stock `mime.types` does not know.
- **Missing paths:** a 404 status with `404.html`. GitHub Pages serves the same file for any missing
  path on its own, which is why every URL in it is root-absolute.
- **Access log:** every request on standard output (`docker logs`), except images, fonts and
  videos.

### 📊 **Post-Deployment Checks**

```bash
# The public site is reachable
curl -I https://clecart.fr

# Performance audit against production
npx lighthouse https://clecart.fr --output json

# Security headers — container only; this returns nothing on GitHub Pages
curl -sI http://localhost:8080/ | grep -E "(X-|Content-Security|Referrer|Permissions)"
```

There is no `/health` endpoint. The `Dockerfile`'s `HEALTHCHECK`, the only one in the repository,
probes `/` with busybox `wget`; `deploy.sh` polls `/` with `curl` before it calls a deployment
done.

## Security and Performance

### 🛡️ **Security**

- **No backend, no database, no uploads** — the attack surface is the front-end supply chain and DOM injection, not a server
- **Supply chain:** nothing is fetched from a third party on load. The contact form calls the EmailJS API with `fetch`; the one third-party script, Google reCAPTCHA, loads only when a visitor who accepted the banner starts writing a message, and the home page's CSP allows Google's reCAPTCHA paths and nothing else of Google's. The 21 Font Awesome Free 7.3.1 icons the pages draw are copied into `assets/icons/sprite.svg`; Poppins is in `assets/fonts/` (the files Google Fonts served, sha256-checked); the nine skill logos are devicon 2.18.0, in `assets/icons/devicon/`. Each carries its licence: in the sprite's header comment for Font Awesome, in a file beside the others.
- **DOM injection:** no user-submitted value is ever interpolated into the DOM — the contact form's status and validation messages are fixed, developer-authored strings
- **Strict Content Security Policy** in every page, inline script allowed by hash only; the other security headers on the container only
- **Container Security:** unprivileged nginx (uid 101) serving a site it cannot rewrite
- **No analytics**, so no tracking to consent to
- **[CIBLE] TLS grading and OWASP Top 10 conformance:** no SSL Labs test, no OWASP audit and no penetration test has been run against this site. TLS on clecart.fr is GitHub Pages' own configuration, not this repository's.
- **Full documentation** -> [SECURITY.md](./SECURITY.md)

### ⚡ **Performance**

Measured on the repository sources (2026-11-09):

- **HTML + CSS + JS:** the five pages, `styles.css` and its 24 imports, `main.js` with the 12 modules it imports, and the service worker — 242 KB uncompressed, 71 KB gzipped file by file
- **Fonts:** three Poppins woff2 files, 23.7 KB in all (woff2 is already compressed), preloaded
- **Third parties on load:** none. First visit at 375 px scrolled to the bottom, measured in Chrome on 2026-11-02 against a local HTTP/2 server with gzip: 56 requests on the home page and 42 on each other page, every one same-origin — the same counts as before the font and the logos moved in, which had sent 13 of the home page's requests (36.7 KB) and 4 of every other page's (24.8 KB) to Google and jsDelivr.
- **Profile image:** `profile.webp`, 31 KB (500×500), and `profile-300.webp`, 14 KB, chosen by `srcset` for a slot of 150 to 250 CSS px; loaded lazily below the first screen
- **Demo videos:** ~5 MB across six 480p files on disk, **0 bytes transferred on load** — measured in Chrome on 2026-11-02 at 1280×800 and under iPhone 13 emulation. On desktop, the visible ones start downloading once the projects section scrolls into view.
- **CSS delivery:** 25 requests in 2 waves (the barrel, then its 24 imports) — one extra discovery round-trip. Deliberately kept: GitHub Pages serves the repository as committed, with no build step to regenerate a concatenated bundle, so a committed bundle would drift from its sources at the first oversight. The font preloads leave in the first wave, beside the barrel.

**Lighthouse, lab only (2026-11-03):** Lighthouse 13.6.0 in headless Chrome with its default
simulated throttling, against `npm start` — Python's server, uncompressed HTTP/1.1, not
production. On all five pages: performance 95–98 on mobile and 100 on desktop, accessibility and
best practices 100. SEO is 100 except on the privacy policy and the 404 page, which carry
`noindex` on purpose and lose exactly that audit. axe-core 4.14.0, on the same five
pages in both themes at 375 and 1280 px: 0 violations. Run by hand; no report is committed.

**[CIBLE] Field Core Web Vitals:** not collected. The site measures nothing about its visitors, so
there is no real-user data to quote.

### 📱 **Progressive Web App**

- **Installable** on mobile and desktop (standalone display, 192/512 icons: full-bleed for `any`, separate safe-zone PNGs for `maskable`, Contact and Projects shortcuts)
- **Offline Support:** every page already visited, with its CSS, JS, fonts and images: network-first with the cache as the offline fallback, stale-while-revalidate images, in-worker SVG placeholder for an image never loaded
- **[CIBLE] Background Sync and Push Notifications:** not implemented — the Service Worker handles `install`, `activate`, `fetch`, and `message` for the URLs the installing page sends

## Maintenance

Maintenance is **manual**, apart from the static checks CI runs on every push. There is no scheduled job and no alerting.

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
- **Code conformance and dependencies:** `npm run check` — ESLint, Stylelint, Prettier, the Nu Html Checker and `npm audit` — on every push, in CI
- **[CIBLE] Performance budget, error reporting and uptime alerting:** would require browser checks in CI or an external monitor; neither exists.

## Contact and Support

### 👨‍💻 **Professional Contact**

- **Email:** [djlike@hotmail.fr](mailto:djlike@hotmail.fr)
- **LinkedIn:** [christophe-lecart](https://www.linkedin.com/in/christophe-lecart/)
- **GitHub:** [github.com/CLecart](https://github.com/CLecart)
- **Portfolio:** [clecart.fr](https://clecart.fr)

### 🐛 **Report an Issue**

1. **GitHub Issues** for technical bugs
2. **Security Issues** -> private email only
3. **Improvement Suggestions** -> GitHub Issues as well (Discussions are not enabled)

### 📚 **Technical Documentation**

- [Detailed Architecture](./about-portfolio.html)
- [Security and Audit](./SECURITY.md)
- [Engineering Manifesto](./.agents/AGENTS.md)
- [Docker Configuration](./Dockerfile)

---

## License and Credits

**© 2026 Christophe Lecart — All rights reserved.**

This repository is published for reading, not for reuse: no permission is
granted to copy, modify or redistribute its code or its content. `package.json`
declares `UNLICENSED` and `private` to say the same thing to tooling, and there
is deliberately no LICENSE file at its root — adding one would grant rights.

The third-party files listed below keep their own licenses; the licence files
in `assets/fonts/` and `assets/icons/devicon/` are theirs.

### Technologies Used

- **Icons:** [Font Awesome Free](https://fontawesome.com/) 7.3.1 (UI icons, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — copied into `assets/icons/sprite.svg` with their attribution) and [Devicon](https://devicon.dev/) 2.18.0 (skill logos, MIT — copied into `assets/icons/devicon/` with `LICENSE.txt`)
- **Font:** [Poppins](https://github.com/itfoundry/Poppins) by the Poppins Project Authors ([SIL OFL 1.1](https://openfontlicense.org/) — the files [Google Fonts](https://fonts.google.com/specimen/Poppins) serves, copied into `assets/fonts/` with `OFL.txt`)
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
