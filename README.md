# Portfolio Professionnel - Christophe Lecart

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Go](https://img.shields.io/badge/Go-00ADD8?style=flat-square&logo=go&logoColor=white)

## Sommaire

- [À propos](#à-propos)
- [Technologies et compétences](#technologies-et-compétences)
- [Caractéristiques principales](#caractéristiques-principales)
- [Projets présentés](#projets-présentés)
- [Structure du projet](#structure-du-projet)
- [Configuration locale](#configuration-locale)
- [Déploiement](#déploiement)
- [Contact](#contact)

## À propos

Portfolio professionnel présentant mes compétences en développement web et mobile, conçu pour ma recherche d'alternance. Ce site vitrine met en avant mon expertise technique et mes projets dans une interface moderne et responsive, développée en HTML5, CSS3 et JavaScript.

Le portfolio démontre ma capacité à créer des interfaces utilisateur intuitives et performantes tout en appliquant les meilleures pratiques du développement web.

## Technologies et compétences

- **Frontend :** HTML5 sémantique, CSS3 (Flexbox, Grid, variables CSS), JavaScript ES6+
- **Architecture CSS :** Organisation modulaire inspirée de SMACSS
- **Performance :** Optimisation des ressources, lazy loading, animations fluides
- **Responsive :** Compatible avec tous les appareils (mobile, tablette, desktop)
- **Accessibilité :** Respect des standards WCAG, navigation au clavier
- **UX/UI :** Mode sombre/clair, transitions fluides, expérience utilisateur intuitive
- **Outils :** API EmailJS, Git, intégration CI/CD
- **Backend :** Projets présentés avec Go, SQLite, architecture RESTful
- **PWA :** Fonctionnalités Progressive Web App avec Service Worker

## Caractéristiques principales

- **Design moderne et épuré** avec thème clair/sombre adaptatif
- **Architecture frontend évolutive** avec séparation des préoccupations
- **Animations optimisées** pour une expérience utilisateur fluide
- **Formulaire de contact fonctionnel** avec validation et gestion d'erreurs
- **Conformité RGPD** avec bannière de consentement
- **Optimisation SEO** avec balises méta appropriées
- **Performance optimisée** pour des temps de chargement rapides
- **Support hors ligne** grâce aux fonctionnalités PWA

## Projets présentés

- **Groupie-Tracker :** Application web Go visualisant des données d'API sur des artistes musicaux
- **BombermanDX :** Jeu navigateur développé en JavaScript avec optimisation des performances
- **Forum :** Plateforme de discussion complète avec authentification et fonctionnalités temps réel

## Structure du projet

```
/home/student/dev/clecart.fr/
├── css/
│   ├── base/
│   │   ├── reset.css
│   │   └── variables.css
│   ├── components/
│   │   ├── buttons.css
│   │   ├── cards.css
│   │   └── forms.css
│   ├── layout/
│   │   ├── footer.css
│   │   └── header.css
│   ├── sections/
│   │   ├── about.css
│   │   ├── contact.css
│   │   ├── hero.css
│   │   ├── privacy.css
│   │   ├── projects.css
│   │   └── skills.css
│   └── utils/
│       ├── animations.css
│       └── responsive.css
├── js/
│   ├── modules/
│   │   ├── darkmode.js
│   │   ├── form.js
│   │   ├── gdpr.js
│   │   ├── modal.js
│   │   └── typewriter.js
│   └── main.js
├── assets/
│   ├── documents/
│   │   └── CV_Christophe_Lecart.pdf
│   ├── images/
│   │   ├── profile.jpg
│   │   ├── favicon.png
│   │   └── apple-touch-icon.png
│   ├── videos/
│   │   ├── Groupie-Tracker.mp4
│   │   └── BombermanDX.mp4
│   └── screenshots/
│       └── forum.png
├── index.html
├── descriptions-projects.html
├── privacy-policy.html
├── styles.css
├── favicon.ico
```

## Configuration locale

Pour exécuter ce projet localement:

1. Clonez le dépôt:

   ```bash
   git clone https://github.com/CLecart/portfolio.git
   cd portfolio
   ```

2. Ouvrez le fichier index.html dans votre navigateur, ou utilisez un serveur local:

   ```bash
   # Si vous avez Python installé
   python -m http.server
   # Puis accédez à http://localhost:8000
   ```

3. Pour le développement, toute modification des fichiers CSS ou JS sera visible après rafraîchissement de la page.

## Déploiement

Le portfolio peut être déployé de plusieurs façons:

### Déploiement avec Docker

1. Assurez-vous que Docker est installé sur votre système
2. Exécutez le script de déploiement:

   ```bash
   ./deploy.sh
   ```

3. Le site sera disponible sur `http://localhost`

### Déploiement manuel

Le portfolio est actuellement déployé sur [clecart.fr](https://clecart.fr) via un hébergement optimisé pour les performances et la sécurité.

Pour un déploiement manuel, il suffit de copier les fichiers vers votre serveur web.

## Contact

- **Email**: [djlike@hotmail.fr](mailto:djlike@hotmail.fr)
- **LinkedIn**: [christophe-lecart-cl15121981](https://www.linkedin.com/in/christophe-lecart-cl15121981/)
- **GitHub**: [github.com/CLecart](https://github.com/CLecart)
- **Portfolio**: [clecart.fr](https://clecart.fr)

---

© 2025 Christophe Lecart. Tous droits réservés.
