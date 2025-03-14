/_ filepath: /home/student/dev/clecart.fr/README.md _/

# Portfolio Professionnel - Christophe Lecart

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Responsive](https://img.shields.io/badge/Responsive-Design-blue)
![Portfolio](https://img.shields.io/badge/Portfolio-Dev-blueviolet)

## Sommaire

- [À propos](#à-propos)
- [Structure du projet](#structure-du-projet)
- [Technologies utilisées](#technologies-utilisées)
- [Architecture CSS](#architecture-css)
- [Fonctionnalités](#fonctionnalités)
- [Projets présentés](#projets-présentés)
- [Mode sombre](#mode-sombre)
- [Responsive Design](#responsive-design)
- [Performance](#performance)
- [Configuration locale](#configuration-locale)
- [Déploiement](#déploiement)
- [Contact](#contact)

## À propos

Ce portfolio professionnel a été conçu pour présenter mes compétences, projets et expériences en tant que développeur web et mobile full stack. Il servira de vitrine pour ma recherche d'alternance dans le cadre de ma formation de développeur web et web mobile.

Le portfolio met en avant mon parcours, mes compétences techniques, ainsi que les projets concrets sur lesquels j'ai travaillé. Il est conçu pour être à la fois élégant, fonctionnel et performant, démontrant mes capacités à créer des interfaces utilisateur modernes et responsives.

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
├── PICTURES/
│   ├── profile.jpg
│   ├── Groupie-Tracker.mp4
│   ├── BombermanDX.mp4
│   └── forum.png
├── files/
│   └── CV_Christophe_Lecart.pdf
├── index.html
├── descriptions-projects.html
├── privacy-policy.html
├── styles.css
├── darkmode.css
└── favicon.ico
```

## Technologies utilisées

- **HTML5**: Structure sémantique et accessible
- **CSS3**: Design moderne avec variables CSS, animations et transitions
- **JavaScript**: Interactivité, formulaires dynamiques et effets visuels
- **Architecture CSS modulaire**: Organisation en composants, layout et sections
- **EmailJS**: Pour le traitement du formulaire de contact côté client
- **Responsive Design**: Compatible avec tous les appareils (mobile, tablette, desktop)
- **Mode sombre**: Thème alternatif pour une meilleure expérience utilisateur

## Architecture CSS

Le projet utilise une architecture CSS modulaire inspirée de la méthodologie SMACSS (Scalable and Modular Architecture for CSS) avec:

- **Base**: Styles de base, variables et reset
- **Components**: Styles réutilisables pour les boutons, cartes, formulaires
- **Layout**: Styles pour les structures principales comme header et footer
- **Sections**: Styles spécifiques à chaque section du site
- **Utils**: Utilitaires pour animations et responsive design

Cette approche garantit un code CSS maintenable, évolutif et facile à comprendre pour de futures modifications.

## Fonctionnalités

- **Navigation fluide**: Défilement doux entre les sections
- **Mode sombre/clair**: Basculement entre thèmes avec persistance des préférences
- **Formulaire de contact**: Intégration EmailJS pour l'envoi direct de messages
- **Animations**: Effets d'apparition au défilement et transitions fluides
- **Responsive Design**: Adaptation parfaite à tous les appareils
- **Performances optimisées**: Chargement rapide et expérience utilisateur fluide
- **Modal pour projets**: Affichage détaillé des projets en plein écran
- **Gestion RGPD**: Bannière de consentement pour la conformité légale
- **Effet Machine à écrire**: Animation de texte dynamique sur la page d'accueil

## Projets présentés

### 1. Groupie-Tracker

Une application web développée en Go qui visualise les données d'une API RESTful sur des artistes et groupes de musique. Ce projet démontre ma capacité à travailler avec des APIs, à manipuler des données et à créer des interfaces interactives.

### 2. BombermanDX

Un jeu basé sur le navigateur, inspiré du classique Bomberman, développé en JavaScript vanilla. Ce projet met en évidence mes compétences en manipulation du DOM et optimisation des performances pour des animations fluides.

### 3. Forum

Une plateforme de discussion complète avec authentification utilisateur, gestion des fils de discussion et fonctionnalités en temps réel. Ce projet full-stack démontre mes compétences en conception de base de données, backend Go et frontend JavaScript.

## Mode sombre

Le portfolio intègre un mode sombre élégant qui:

- S'adapte aux préférences système de l'utilisateur
- Sauvegarde les préférences dans le localStorage
- Offre une expérience visuelle alternative tout en maintenant la lisibilité
- Applique des transitions fluides entre les modes

## Responsive Design

Le site est entièrement responsive avec:

- Une approche mobile-first
- Des breakpoints stratégiques pour les différents appareils
- Un menu hamburger sur mobile
- Des mises en page adaptatives pour une expérience optimale sur tous les écrans
- Des optimisations de taille d'images et de vidéos selon l'appareil

## Performance

Le portfolio a été optimisé pour des performances maximales:

- Chargement paresseux (lazy loading) des images et vidéos
- Préchargement des polices avec font-display: swap
- Structure CSS modulaire pour charger uniquement les styles nécessaires
- Optimisation des animations pour éviter les reflows
- Compression des ressources multimedia

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

Le portfolio est actuellement déployé sur [clecart.fr](https://clecart.fr) via un hébergement optimisé pour les performances et la sécurité.

## Contact

- **Email**: [djlike@hotmail.fr](mailto:djlike@hotmail.fr)
- **LinkedIn**: [christophe-lecart-cl15121981](https://www.linkedin.com/in/christophe-lecart-cl15121981/)
- **GitHub**: [github.com/CLecart](https://github.com/CLecart)
- **Portfolio**: [clecart.fr](https://clecart.fr)

---

© 2025 Christophe Lecart. Tous droits réservés.
