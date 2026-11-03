# Sécurité — clecart.fr

## Périmètre — à lire avant tout

`clecart.fr` est un site statique servi par **GitHub Pages**, directement depuis
ce dépôt : aucun backend, aucune base de données, aucune session, aucun envoi
de fichier. Rien de ce que le site possède ne traite une requête.

**GitHub Pages ne permet pas de définir d'en-têtes HTTP personnalisés.** Les
en-têtes de sécurité décrits plus bas n'existent que dans le déploiement
conteneurisé (`nginx.conf` + `nginx-security-headers.conf`). La **Content
Security Policy**, elle, figure aussi dans chaque page sous forme de balise
`<meta>` : elle s'applique sur `clecart.fr`, à `frame-ancestors` près, qu'une
balise `<meta>` ne peut pas porter.

Ce qui protège réellement le site public :

- l'absence de toute ressource et de tout script tiers : police, icônes et
  logos sont servis par le site lui-même, à des versions épinglées, et le
  formulaire appelle l'API EmailJS par `fetch`, sans son SDK ;
- la CSP de chaque page, qui n'autorise que l'origine du site, le seul script
  inline par son empreinte, et `api.emailjs.com` pour l'envoi ;
- l'absence de toute valeur saisie par un visiteur réinjectée dans le DOM ;
- l'absence de serveur, donc de données côté serveur à voler.

## Chaîne d'approvisionnement

- **Aucun script tiers ne s'exécute.** Le formulaire envoie par `fetch`, vers
  l'API REST d'EmailJS, la requête que le SDK EmailJS enverrait. Le SDK a été
  retiré le 2026-11-03 : il lisait `localStorage` dès son chargement et
  plantait quand le navigateur bloque les données de site, ce qui rendait le
  formulaire inutilisable.
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
- Mesuré dans Chrome le 2026-11-03 : au chargement, aucune des cinq pages ne
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

## Content Security Policy — chaque page, et le conteneur

```text
default-src 'self'; script-src 'self' 'sha256-w7cn94Y+/0Pp7IFYZNHIQ4PPivuVZGKRrnULb1rAOS8='; connect-src 'self' https://api.emailjs.com; object-src 'none'; base-uri 'self'; form-action 'self'
```

Chaque page la porte dans une balise `<meta http-equiv>`, placée avant son
script inline : c'est ce qui la rend active sur GitHub Pages. Le conteneur
l'envoie aussi en en-tête, avec `frame-ancestors 'none'` en plus. `/cv/`, sans
script inline, n'autorise aucune empreinte.

- `default-src 'self'` : les directives absentes y retombent. Styles, polices,
  images, vidéos et manifeste viennent tous du site ; le service worker relève
  de `script-src`, qui l'autorise aussi.
- `script-src` autorise le bootstrap de thème inline en `<head>` par son
  empreinte SHA-256, et rien d'autre d'inline : un script injecté est bloqué.
  Ce bootstrap, seul script inline du site, identique sur les cinq pages, doit
  s'exécuter avant le premier rendu pour éviter le flash de mauvais thème.
  **Modifier un seul octet de ce script change son empreinte** :
  `npm run check:csp` (lancé par `npm run check`, donc par la CI) échoue alors
  et donne l'empreinte à reporter dans les six pages et dans
  `nginx-security-headers.conf`.
- Aucun `'unsafe-inline'` pour les styles : le code commité ne contient ni
  attribut `style` ni élément `<style>`, et les styles posés par JavaScript
  passent par `element.style`, que la CSP ne bloque pas.
- `api.emailjs.com` : envoi du formulaire, seul hôte EmailJS contacté, et
  seulement à l'envoi.

Mesuré le 2026-11-03 : les 24 contrôles fonctionnels passent sans erreur de
console sous la seule balise `<meta>` (serveur local) et sous la balise plus
l'en-tête (conteneur), envoi du formulaire compris. Mesuré le 2026-11-02 avec
la politique d'alors servie en en-tête : aucune violation sur les quatre pages (375 et
1280 px, défilement, menu mobile, thème), à l'envoi du formulaire, à
l'acceptation et au refus du bandeau, à la réouverture du choix, sur la page
projets, sur `/cv/` et pour le service worker. Contrôle négatif : un attribut
`style`, une image `data:` et une feuille Google Fonts injectés dans la page
sont bien refusés. Les icônes `data:` des contrôles vidéo appartiennent à
Chrome et ne passent pas par la politique de la page.

## Autres en-têtes HTTP — déploiement Docker uniquement

- `X-Content-Type-Options: nosniff` — empêche le MIME sniffing.
- `X-Frame-Options: DENY` — interdit l'inclusion en cadre (doublé par
  `frame-ancestors 'none'`).
- `X-XSS-Protection: 0` — le filtre XSS des navigateurs a disparu, et là où il
  subsistait il pouvait servir à masquer une partie d'une page : l'OWASP
  recommande de le désactiver. La CSP fait ce travail.
- `server_tokens off` : ni l'en-tête `Server` ni les pages d'erreur de nginx
  n'indiquent sa version ; un dossier sans index renvoie `404.html`, pas la page
  403 de nginx.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy` — neutralise géolocalisation, micro, caméra et paiement.

## Piège nginx

`add_header` n'est hérité d'un niveau supérieur **que si le niveau courant n'en
déclare aucun**. Chaque `location` de ce projet définit son propre
`Cache-Control` : sans un `include` explicite de `nginx-security-headers.conf`,
elle ne servirait **aucun** en-tête de sécurité. Toute nouvelle `location` doit
donc inclure ce fichier.

```bash
curl -sI http://localhost:8080/ | grep -icE "content-security|x-frame|x-xss|x-content-type|referrer|permissions"   # doit renvoyer 6
```

## Conteneur

- Image `nginxinc/nginx-unprivileged:1.30.6-alpine`, épinglée par son tag et
  par son digest : maître et workers nginx tournent sous l'UID 101, sur le port 8080. Le `HEALTHCHECK`
  interroge `/` ; c'est le seul contrôle de santé du dépôt.
- La configuration nginx appartient à root : l'image de base confie
  `/etc/nginx` à l'UID 101, le `Dockerfile` la rend à root. Un worker capable de
  la réécrire pourrait aussi désactiver les en-têtes.
- **Le `Dockerfile` copie les fichiers servis par leur nom**, jamais tout le
  contexte : les cinq pages HTML (dont `404.html`), `styles.css`, le service
  worker, `robots.txt`, `sitemap.xml` et les dossiers `cv/`, `css/`, `js/`,
  `assets/`, `.well-known/`. Les deux fichiers de configuration nginx vont dans `/etc/nginx`,
  pas dans la racine web.
- `.dockerignore` ne fait que borner le contexte de build : `.git`, `.env`,
  `config.json`, `node_modules` et tout fichier local ne sont même pas envoyés
  au builder.
- Les fichiers servis appartiennent à root (fichiers 644, dossiers 755) :
  l'UID 101 qui exécute nginx peut les lire, pas les réécrire.
- `deploy.sh` et `docker-compose.yml` lancent le conteneur en lecture seule
  (`/tmp` seul en écriture), sans aucune capacité Linux et sans élévation de
  privilège possible ; Compose ne publie le port que sur `127.0.0.1`. Mesuré le
  2026-11-03 : le conteneur démarre et passe son `HEALTHCHECK` ainsi.

## Vérifications

Il n'existe **pas de suite de tests automatisés**. La CI
(`.github/workflows/check.yml`) lance `npm run check` à chaque push sur `main`,
à chaque pull request et chaque semaine : ESLint, Stylelint, Prettier, le Nu
Html Checker, le contrôle des empreintes CSP et `npm audit`. Ses actions sont
épinglées par SHA de commit, et elle ne reçoit qu'un jeton en lecture seule.
Dependabot (`.github/dependabot.yml`) propose chaque semaine les mises à jour
npm, GitHub Actions et de l'image nginx.
Le reste se lance à la main :

Dernier `npm audit` (2026-11-03) : **0 vulnérabilité**. Le seul avis restant la
veille, `minimatch` < 11.0.1 (GHSA-g3hv-75wg-m249, déni de service sur des
motifs de fichiers piégés), venait d'ESLint 10.14 lui-même, sans version
corrigée d'ESLint. `package.json` impose `minimatch` 11.0.4 par `overrides` ;
ESLint lint exactement les mêmes fichiers qu'avant, vérifié. À retirer quand
ESLint embarquera une version corrigée.

```bash
npm run check               # ce que lance la CI, 0 erreur et 0 warning attendus

# En-têtes : uniquement sur le conteneur, seul endroit où ils existent.
npm run docker:build && npm run docker:run
curl -sI http://localhost:8080/ | grep -E "(X-|Content-Security|Referrer|Permissions)"
```

Aucun test TLS, aucun audit OWASP et aucun test d'intrusion n'a été mené contre
ce site. Le TLS de `clecart.fr` est la configuration de GitHub Pages, pas celle
de ce dépôt.

## Surveillance

**Il n'y en a pas.** Aucune erreur JavaScript n'est collectée, aucune mesure de
performance n'est prise, aucune alerte n'existe — ni sur
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

La même adresse est publiée dans `/.well-known/security.txt` (RFC 9116), que
`_config.yml` fait publier par GitHub Pages malgré le point initial du dossier.
Son champ `Expires` tombe le 2027-11-03 : **à repousser chaque année**, faute
de quoi le fichier n'est plus valide.

## Références

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN — Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
- [MDN — Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
- [nginx — `add_header`](https://nginx.org/en/docs/http/ngx_http_headers_module.html)
- [Docker — sécurité du moteur](https://docs.docker.com/engine/security/)

---

**Dernière mise à jour :** 2026-11-03
**Responsable :** Christophe Lecart
