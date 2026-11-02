# Sécurité — clecart.fr

## Périmètre — à lire avant tout

`clecart.fr` est un site statique servi par **GitHub Pages**, directement depuis
ce dépôt : aucun backend, aucune base de données, aucune session, aucun envoi
de fichier. Rien de ce que le site possède ne traite une requête.

**GitHub Pages ne permet pas de définir d'en-têtes HTTP personnalisés.** La CSP
et les en-têtes de sécurité décrits plus bas n'existent que dans le déploiement
conteneurisé (`nginx.conf` + `nginx-security-headers.conf`) : **aucun n'est
actif sur `clecart.fr`.** Vérification : `curl -sI https://clecart.fr`.

Ce qui protège réellement le site public :

- l'absence de toute ressource tierce : police, icônes, logos et SDK EmailJS
  sont servis par le site lui-même, à des versions épinglées ;
- l'absence de toute valeur saisie par un visiteur réinjectée dans le DOM ;
- l'absence de serveur, donc de données côté serveur à voler.

## Chaîne d'approvisionnement

- Le **SDK EmailJS 5.0.3** est servi par le site lui-même
  (`js/vendor/emailjs-browser-5.0.3.min.js`), copie à l'octet près du fichier
  de l'archive npm, dont npm vérifie l'empreinte `integrity` publiée par le
  registre. Sa licence BSD-3-Clause est à côté. Un fichier épinglé et servi
  depuis la même origine n'a pas besoin de SRI.
- Les **icônes d'interface** ne sont pas une ressource tierce : les 21 icônes
  Font Awesome Free 7.3.1 que les pages dessinent sont copiées dans
  `assets/icons/sprite.svg`, servi par le site lui-même. Leurs tracés et leurs
  `viewBox` viennent de l'archive npm `@fortawesome/fontawesome-free@7.3.1`,
  vérifiée contre l'empreinte `integrity` publiée par le registre : chaque
  attribut `d` et `viewBox` est, caractère pour caractère, celui de la même
  icône dans ses `sprites/solid.svg` et `sprites/brands.svg`.
- La police **Poppins** est servie par le site (`assets/fonts/`) : les trois
  fichiers woff2 (latin, graisses 400, 600 et 700) sont, à l'octet près
  (sha256), ceux que Google Fonts envoyait au navigateur (Poppins v24). Licence
  SIL OFL 1.1 à côté (`OFL.txt`).
- Les **logos devicon** de la section des langages (`assets/icons/devicon/`)
  viennent du tag 2.18.0 de devicon, identiques à l'octet aux fichiers que
  servait l'URL jsDelivr non épinglée. Licence MIT à côté (`LICENSE.txt`).
- Mesuré dans Chrome le 2026-11-02 : au chargement, aucune des quatre pages ne
  contacte d'autre hôte que le sien. `api.emailjs.com` n'est contacté qu'à
  l'envoi du formulaire.

## DOM

Les messages de statut et de validation du formulaire de contact sont des
chaînes fixes écrites dans le code. Aucune valeur saisie par un visiteur n'est
écrite dans la page.

## Formulaire de contact (EmailJS)

### Ce qui est vérifié, et où

- **Validation côté client uniquement** : champs requis, forme de l'adresse,
  message d'au moins 10 caractères. Elle évite un aller-retour inutile ; elle ne
  protège rien, puisqu'un script peut l'ignorer.
- **Aucune validation côté serveur n'est configurée** chez EmailJS.
- **Aucune sanitisation** : les valeurs partent telles que saisies.
- **Aucune limitation de débit n'est configurée.** La seule borne est le quota
  mensuel du plan gratuit d'EmailJS.

### Pourquoi les identifiants sont publics

Les identifiants EmailJS (`js/utils/config.js`) sont **publics par
conception** : le navigateur en a besoin pour envoyer le formulaire, et la page
les sert à chaque visiteur. Les cacher dans un fichier non suivi ne protégerait
rien et rendrait le site indéployable (aucune étape de build ne pourrait
l'injecter).

**Ce qui borne l'exposition, c'est le template, pas la clé** : il écrit à une
adresse fixe, donc les identifiants ne peuvent déclencher qu'un message vers le
propriétaire du site. Un abus coûte le quota mensuel, rien d'autre. Le champ
« To Email » du template ne doit **jamais** devenir une variable : le compte
deviendrait un relais de spam ouvert.

Le filtre par domaine d'EmailJS est une option payante ; le compte est en plan
gratuit, donc les domaines qui y figurent sont **inertes**.

### Le piège anti-script filtre la page, pas la clé

- **Ce que fait la page** : une soumission venant d'un navigateur automatisé
  (`navigator.webdriver`) ou dont le champ hors écran `website` est rempli
  reçoit le message de succès habituel, et rien n'est envoyé. Mesuré dans
  Chrome le 2026-11-02 : un Puppeteer par défaut, qui envoyait avant, n'envoie
  plus ; un envoi humain passe toujours.
- **Ce qu'elle ne peut pas faire** : un script qui appelle l'API EmailJS
  directement avec les identifiants publics ne charge jamais la page. EmailJS
  refuse par défaut les appels qui ne viennent pas d'un navigateur, mais un
  appel direct portant les en-têtes `Origin` et `User-Agent` d'un navigateur est
  passé (mesuré le 2026-11-02).
- **La seule vérification côté serveur du plan gratuit est reCAPTCHA v2**,
  contrôlé par EmailJS. Elle rendrait la clé inutilisable hors de la page, mais
  livrerait à Google une donnée sur chaque visiteur d'un site qui affirme ne
  rien partager avec des tiers. **Décision documentée dans `.agents/AGENTS.md`**
  : ne l'activer que si le quota grimpe sans raison malgré le piège.

## En-têtes HTTP — déploiement Docker uniquement

### Content Security Policy

```nginx
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://api.emailjs.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';
```

- `default-src 'self'` : les directives absentes y retombent. Styles, polices,
  images, vidéos et manifeste viennent tous du site ; le service worker relève
  de `script-src`, qui l'autorise aussi.
- `script-src 'unsafe-inline'` : requis par le bootstrap de thème inline en
  `<head>`, seul script inline du site, qui doit s'exécuter avant le premier
  rendu pour éviter le flash de mauvais thème.
- Aucun `'unsafe-inline'` pour les styles : le code commité ne contient ni
  attribut `style` ni élément `<style>`, et les styles posés par JavaScript
  passent par `element.style`, que la CSP ne bloque pas.
- `api.emailjs.com` : envoi du formulaire, seul hôte EmailJS contacté, et
  seulement à l'envoi.

Mesuré le 2026-11-02 avec cette politique servie en en-tête par un serveur
local (pas le conteneur) : aucune violation sur les quatre pages (375 et
1280 px, défilement, menu mobile, thème), à l'envoi du formulaire, à
l'acceptation et au refus du bandeau, à la réouverture du choix, sur la page
projets, sur `/cv/` et pour le service worker. Contrôle négatif : un attribut
`style`, une image `data:` et une feuille Google Fonts injectés dans la page
sont bien refusés. Les icônes `data:` des contrôles vidéo appartiennent à
Chrome et ne passent pas par la politique de la page.

### Autres en-têtes

- `X-Content-Type-Options: nosniff` — empêche le MIME sniffing.
- `X-Frame-Options: DENY` — interdit l'inclusion en cadre (doublé par
  `frame-ancestors 'none'`).
- `X-XSS-Protection: 1; mode=block` — en-tête historique, sans effet sur les
  navigateurs Chromium et Firefox actuels ; la CSP fait ce travail.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy` — neutralise géolocalisation, micro, caméra et paiement.

### Piège nginx

`add_header` n'est hérité d'un niveau supérieur **que si le niveau courant n'en
déclare aucun**. Chaque `location` de ce projet définit son propre
`Cache-Control` : sans un `include` explicite de `nginx-security-headers.conf`,
elle ne servirait **aucun** en-tête de sécurité. Toute nouvelle `location` doit
donc inclure ce fichier.

```bash
curl -sI http://localhost:8080/ | grep -icE "content-security|x-frame|x-xss|x-content-type|referrer|permissions"   # doit renvoyer 6
```

## Conteneur

- Image `nginxinc/nginx-unprivileged:1.30.6-alpine`, épinglée : maître et
  workers nginx tournent sous l'UID 101, sur le port 8080. Le `HEALTHCHECK`
  interroge `/` ; c'est le seul contrôle de santé du dépôt.
- La configuration nginx appartient à root : l'image de base confie
  `/etc/nginx` à l'UID 101, le `Dockerfile` la rend à root. Un worker capable de
  la réécrire pourrait aussi désactiver les en-têtes.
- **Le `Dockerfile` copie les fichiers servis par leur nom**, jamais tout le
  contexte : les cinq pages HTML (dont `404.html`), `styles.css`, le service
  worker, `robots.txt`, `sitemap.xml` et les dossiers `cv/`, `css/`, `js/`,
  `assets/`. Les deux fichiers de configuration nginx vont dans `/etc/nginx`,
  pas dans la racine web.
- `.dockerignore` ne fait que borner le contexte de build : `.git`, `.env`,
  `config.json`, `node_modules` et tout fichier local ne sont même pas envoyés
  au builder.
- Les fichiers servis appartiennent à root (fichiers 644, dossiers 755) :
  l'UID 101 qui exécute nginx peut les lire, pas les réécrire.

## Vérifications

Il n'existe **ni suite de tests automatisés, ni CI**. Tout se lance à la main,
et seulement quand quelqu'un le lance :

Dernier `npm audit` (2026-11-02, outils à leur dernière version) : 0 haute,
8 modérées, toutes issues d'un seul avis — `minimatch` < 11.0.1 (déni de
service sur des motifs de fichiers piégés), embarqué par ESLint 10.14 lui-même.
Aucune version corrigée d'ESLint n'existe encore ; le seul « correctif » que
propose npm est de redescendre à ESLint 4. Exposition nulle ici : les motifs
viennent de notre propre configuration, et rien de ces outils n'est servi au
visiteur. À relancer à chaque mise à jour d'ESLint.

```bash
npm audit                   # vulnérabilités des dépendances de développement
npm run lint                # ESLint, 0 erreur et 0 warning attendus
npm run format:check

# En-têtes : uniquement sur le conteneur, seul endroit où ils existent.
npm run docker:build && npm run docker:run
curl -sI http://localhost:8080/ | grep -E "(X-|Content-Security|Referrer|Permissions)"
```

Aucun test TLS, aucun audit OWASP et aucun test d'intrusion n'a été mené contre
ce site. Le TLS de `clecart.fr` est la configuration de GitHub Pages, pas celle
de ce dépôt.

## Surveillance

**Il n'y en a pas.** Aucune erreur JavaScript n'est collectée, aucune mesure de
performance ne quitte le navigateur du visiteur, aucune alerte n'existe — ni sur
GitHub Pages, ni sur le conteneur.

- **GitHub Pages** : aucun accès aux journaux.
- **Conteneur** : nginx écrit ses journaux d'accès sur la sortie standard
  (`docker logs`), sauf pour les images, les polices et les vidéos
  (`access_log off`). Personne ne les relit automatiquement. Le `HEALTHCHECK`
  marque le conteneur `unhealthy`, sans prévenir personne. Seul `deploy.sh` réagit, au moment du déploiement :
  il interroge le site et restaure l'image précédente s'il ne répond pas dans
  les 60 secondes.

## En cas d'incident

- **GitHub Pages** : le dépôt est la seule source. Revenir en arrière, c'est
  pousser un `git revert` du commit fautif.
- **Conteneur** : `deploy.sh` étiquette l'image en place avant de reconstruire
  et la restaure si une étape échoue.
- Le site ne détient aucune donnée de visiteur : il n'y a ni sauvegarde à
  restaurer, ni fuite côté serveur possible. Les messages envoyés via le
  formulaire vivent dans la boîte mail du propriétaire et chez EmailJS.

## Signaler une vulnérabilité

Par e-mail, en privé : [djlike@hotmail.fr](mailto:djlike@hotmail.fr). Pas
d'issue publique pour une faille non corrigée.

## Références

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN — Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
- [MDN — Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
- [nginx — `add_header`](https://nginx.org/en/docs/http/ngx_http_headers_module.html)
- [Docker — sécurité du moteur](https://docs.docker.com/engine/security/)

---

**Dernière mise à jour :** 2026-11-02
**Responsable :** Christophe Lecart
