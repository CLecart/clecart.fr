# Manifeste de Développement — clecart.fr

Standards non négociables pour le portfolio **clecart.fr**. Toute intervention,
humaine ou IA, s'y conforme.

**Contexte déterminant, dont tout le reste découle :** site statique, aucun
framework, aucun bundler, **aucun build**, aucun backend, aucune base de
données. GitHub Pages sert le dépôt tel qu'il est commité. Le navigateur
consomme les sources telles quelles.

Trois conséquences directes :

1. **Aucune compilation ne rattrapera une négligence.** La discipline vit dans
   le code, ou nulle part.
2. **Rien ne peut être caché au visiteur.** Tout ce que la page lit, il le lit.
3. **Aucune étape de déploiement n'existe** pour générer, injecter ou
   transformer quoi que ce soit. Une solution qui en suppose une est une
   solution qui casse le site.

**Ne rien affirmer sans mesure.** Ce projet n'a pas de tests : la vérification
est empirique ou n'existe pas. Puppeteer est installé, Chrome système est en
`/usr/bin/google-chrome-stable` (passer `executablePath`, le cache Puppeteer est
vide). Un comportement se constate dans un navigateur, il ne se déduit pas.

---

## I. Règles de l'art

1. **Séparation claire.** L'arborescence porte la structure et doit le rester :
   `js/modules/` pour le métier, `js/utils/` pour la technique, `css/` en
   SMACSS (`base` / `components` / `layout` / `sections` / `theme` / `utils`).
   Un fichier dans la mauvaise couche est un défaut, même s'il fonctionne.
   Les hacks sont proscrits ; quand l'un est structurellement nécessaire (ex.
   `transition: background-color 5000s` contre l'autofill Chrome), il porte un
   commentaire expliquant la contrainte.
   **Exception documentée :** `service-worker.js` **reste à la racine**. Le
   scope d'un worker est son dossier ; depuis `js/utils/` il ne contrôlerait que
   `/js/utils/`. L'échappatoire habituelle, l'en-tête `Service-Worker-Allowed`,
   est hors de portée sur GitHub Pages. Le « ranger » tuerait le PWA.

2. **Zéro dette, zéro code mort.** Le code est concis et s'explique par son
   nommage.
   - **Bannissement des commentaires perroquets** qui décrivent l'évidence. Un
     commentaire ne survit que s'il énonce une contrainte que le code ne peut
     pas montrer. Jamais de « ce que fait la ligne suivante », jamais de
     changelog dans le code.
   - Seule documentation autorisée : **JSDoc** pour JavaScript. Une JSDoc qui
     paraphrase le nom de la fonction est un perroquet. Ne jamais laisser
     `eslint --fix` insérer des blocs JSDoc vides : ils satisfont la règle en ne
     documentant rien.
   - **Zéro code mort.** Fichier non importé, keyframe non référencé, classe CSS
     sans markup, constante inutilisée : supprimés, pas conservés « au cas où ».
     L'historique Git est la sauvegarde.
   - **Ne pas ressusciter une règle morte par réflexe.** Du code jamais exécuté
     n'est pas forcément du code à réparer : vérifier d'abord que son intention
     est encore la bonne.

3. **Complexité maîtrisée (SonarQube S3776).** Aucune fonction ne dépasse une
   complexité cognitive de 15. Extraire dans des fonctions utilitaires.

---

## II. Bonnes pratiques

4. **JavaScript ES2021+.**
   - Optional chaining (`?.`) et nullish coalescing (`??`) systématiques.
     Attention : `a?.b()` protège `a`, **pas** l'absence de `b`.
   - `const` par défaut, `let` si réassignation, **`var` interdit**.
     `globalThis` plutôt que `window`.
   - ES modules exclusivement. Aucun script inline hors du bootstrap de thème
     anti-FOUC en `<head>`, qui reste minimal.
   - Un module exporte des `init*()` appelées par `js/main.js` ; jamais
     d'exécution implicite à l'import.
   - **Piège récurrent dans ce projet :** ne jamais enregistrer un listener
     `load` dans une fonction que `main.js` appelle déjà depuis un handler
     `load`. Le DOM n'invoque pas un listener ajouté pendant le dispatch de
     l'événement qu'il écoute, et `load` n'arrive qu'une fois. Ce bug a tué le
     pipeline vidéo et le service worker, silencieusement, pendant des mois.

5. **Anticipation SonarQube & zéro récidive.**
   - **Un seul mécanisme par problème.** Deux générations concurrentes du même
     dispositif sont une faute : la morte est supprimée immédiatement.
   - **Un `@keyframes` est défini exactement une fois**, dans
     `css/utils/animations.css` s'il est partagé. Une définition dupliquée dans
     un fichier importé plus tard écrase silencieusement l'autre.
   - **Design tokens obligatoires :** durées et courbes viennent de
     `css/base/variables.css` (`--duration-*`, `--ease-*`, `--transition*`).
     Toute valeur en dur est un défaut ; une durée hors échelle devient d'abord
     un token.
   - **Nommage CSS homogène :** kebab-case pour les classes **et** les
     `@keyframes`, sans exception.
   - **Toute `var(--x)` doit être définie.** Une variable CSS absente rend la
     déclaration invalide et le navigateur l'ignore **en silence**.
   - **Zéro `!important`, partout** : feuilles CSS, attributs `style`, styles
     injectés par JavaScript. Pas d'exception pour `prefers-reduced-motion` :
     sous `@media (prefers-reduced-motion: reduce)`, on redéfinit à `0s` les
     tokens de durée et de délai, et tout ce qui les lit suit. Aucun commentaire
     de suppression non plus (`NOSONAR`, `stylelint-disable`…).
   - **Zéro warning toléré :** `npm run check` passe — ESLint, Stylelint,
     Prettier, le Nu Html Checker (warnings compris) et `npm audit`. Aucun
     `eslint-disable` de confort. Prettier possède le formatage, ESLint la
     correctness, `eslint-plugin-jsdoc` la documentation, `eslint-plugin-sonarjs`
     la complexité (règle 3), Stylelint le CSS (`stylelint-config-standard`,
     `!important` interdit). Deux options de Stylelint sont des choix de
     compatibilité, à ne pas « moderniser » : media queries en notation préfixe
     (la notation range exige Safari 16.4) et couleurs en notation legacy (une
     seule couleur `rgb(0 0 0 / 10%)` fait interpoler tout un dégradé en Oklab
     au lieu de sRGB : 235 000 pixels changés sur l'accueil, mesuré le
     2026-11-03). Toute règle qui vise un même élément s'écrit par spécificité
     croissante (`no-descending-specificity`) : l'ordre du fichier ne tranche
     alors jamais entre deux règles. `console.log` banni ; `console.warn`/`console.error`
     autorisés — un échec silencieux est pire qu'une trace.

6. **Traçabilité.**
   - **Le `git log` est le journal de bord.** Ni `JOURNAL_DE_BORD.md`, ni
     `CHANGELOG.md` : ils dupliqueraient l'historique puis dériveraient de lui.
     En contrepartie, le message de commit porte le raisonnement : ce qui a été
     mesuré, ce qui a été écarté, pourquoi.
   - **CI : `npm run check` à chaque push** (`.github/workflows/check.yml`,
     actions épinglées par SHA). **[CIBLE]** Lighthouse, axe et les contrôles
     en navigateur ne tournent pas en CI : ils restent manuels et doivent être
     explicitement rapportés, jamais supposés.

---

## III. Conformité

7. **Sécurité — chaîne d'approvisionnement et DOM.** Sans backend, la surface
   d'attaque se résume à ces deux points.
   - **SRI :** tout `<script>` ou `<link rel="stylesheet">` tiers est **épinglé
     à une version exacte** puis signé (`integrity` + `crossorigin="anonymous"`).
     Le pin précède toujours la signature : signer une plage flottante (`@3`)
     casse le site au premier patch amont.
   - **Au chargement, aucune ressource ni aucun script tiers** (mesuré,
     Chrome, 2026-11-09) ; seule exception, Google reCAPTCHA, au premier clic
     dans un champ du formulaire. Police, icônes et logos sont servis par le
     site, épinglés ;
     le formulaire appelle l'API EmailJS par `fetch`, sans SDK, et
     `api.emailjs.com` n'est contacté qu'à l'envoi. En réintroduire une, c'est
     aussi l'ajouter à `privacy-policy.html` et à la CSP.
   - **CSP dans chaque page** (`<meta http-equiv>`, avant le script inline),
     le script inline autorisé par son empreinte. `npm run check:csp` vérifie
     que pages et `nginx-security-headers.conf` listent exactement les
     empreintes des scripts inline : jamais de `'unsafe-inline'`.
   - Injection de contenu par `textContent`, jamais `innerHTML` sur une donnée
     non maîtrisée.
   - **Savoir ce qui est un secret.** Les identifiants EmailJS sont **publics
     par conception** : le navigateur en a besoin, `clecart.fr/js/utils/config.js`
     les sert en clair. Ils sont commités, et c'est correct. Ne jamais
     réintroduire un `config.json` « pour les cacher » : ça ne cache rien et ça
     casse le déploiement.
   - **Ce qui borne l'exposition, c'est le template**, pas la clé : il écrit à
     une adresse fixe, donc les identifiants ne peuvent déclencher qu'un message
     vers le propriétaire du site. Un abus coûte le quota mensuel, rien d'autre.
     Le champ « To Email » du template ne doit **jamais** devenir une variable :
     le compte deviendrait un relais de spam ouvert.
   - **Décision assumée, ne pas la « corriger » sans mesure :** le filtre par
     domaine d'EmailJS est payant et le compte est en plan gratuit — les
     domaines qui y figurent sont **inertes**. reCAPTCHA v2, vérifié côté
     EmailJS, rendrait la clé inutilisable et serait gratuit, mais livrerait à
     Google une donnée sur chaque visiteur d'un site qui affirme ne rien
     partager avec des tiers. **Activé le 2026-11-09** sur décision de
     Christophe, l'hameçonnage passant le piège : chargé au premier clic dans
     un champ, après acceptation de la bannière, jamais au chargement.
   - **Le piège du formulaire filtre la page, pas la clé.** Un navigateur
     automatisé (`navigator.webdriver`) ou le champ hors écran `website` rempli
     reçoit le succès habituel, et rien ne part. Mesuré (Chrome, 2026-11-02) :
     un Puppeteer par défaut envoyait avant, plus après ; un envoi humain passe
     toujours. Un script qui appelle l'API EmailJS directement ne le traverse
     pas : c'est ce chemin que reCAPTCHA ferme. Un envoi que le piège juge
     automatisé reçoit le succès factice **avant** tout reCAPTCHA. Le
     champ caché n'est pas du code mort.
   - **Un vrai secret n'a pas sa place ici** et impliquerait d'abord un serveur.
   - Un correctif de sécurité ne doit jamais dégrader une fonctionnalité : une
     signature SRI qui casse le formulaire de contact est un échec, pas une
     conformité.
   - **Périmètre des en-têtes :** la CSP et les en-têtes de sécurité
     (`nginx-security-headers.conf`) ne valent que pour le déploiement Docker.
     **GitHub Pages ne sert aucun en-tête personnalisé** — ils ne protègent pas
     `clecart.fr`. Toute mention doit le préciser. Piège nginx : `add_header`
     n'est hérité que si le niveau courant n'en déclare aucun ; chaque `location`
     doit inclure le fichier explicitement.

8. **RGPD.** Le site ne traite de données que par le formulaire de contact :
   aucune mesure d'audience.
   - **Consentement préalable réel :** rien ne part vers EmailJS avant
     acceptation explicite (`js/utils/gdpr.js`).
   - **Ce qui n'est plus collecté s'efface chez le visiteur**, il ne reste pas
     en souffrance : le tampon `analytics_events` d'une version antérieure est
     supprimé à la visite suivante.
   - **Le retrait est aussi simple que le don** : tout contrôle
     `[data-gdpr-reopen]` réaffiche la bannière et efface la décision. C'est une
     obligation, pas un confort.
   - `privacy-policy.html` décrit **l'état réel** du traitement, jamais une
     intention. Y compris les tiers qui reçoivent l'IP du visiteur du seul fait
     de servir une ressource.

9. **Sobriété numérique (Green IT).** Positionnement revendiqué publiquement :
   il engage le code.
   - **Le poids transféré est le premier critère, et il se mesure.** Images en
     WebP, `loading="lazy"` sur les `<img>`.
   - **Une `<video>` se diffère par `loading="lazy"` + `poster`, les deux
     ensemble.** Mesuré (Chrome, 2026-07-17) : le poster seul ne suffit pas — le
     navigateur charge la vidéo pour en tirer une première image ; `loading`
     seul non plus. La paire donne 0 octet au chargement. `loading` figure
     parmi les attributs de contenu de `<video>` dans la spec WHATWG (lu sur
     html.spec.whatwg.org le 2026-11-02 : attribut de chargement différé
     commun aux éléments média, qui diffère aussi le poster). Chrome l'honore ;
     les autres moteurs n'ont pas été mesurés ici.
   - **Ne pas généraliser ce réglage sans mesurer.** Appliqué aux six vidéos, il
     les a rendues muettes : elles se téléchargeaient (18 Mo) puis restaient
     figées sur la première image, `currentTime` bloqué à 0. Autoplay et « ne
     rien charger » sont contradictoires — une vidéo visible doit charger pour
     jouer. Le réglage n'est légitime que sur une vidéo **masquée au départ**.
   - **Le Service Worker ne précache rien** : il garde ce qui passe par lui.
     Aucune liste de fichiers à tenir à jour, donc aucune qui dérive. Si une
     liste de précache revient un jour, elle ne contient que ce que le site
     charge.
   - **CSS/JS en network-first**, cache en filet hors-ligne uniquement. Sans
     build ni hash d'URL, le cache-first figerait chaque visiteur sur la version
     découverte en premier : tout déploiement futur invisible, définitivement.
     Les images en stale-while-revalidate : servies du cache, rafraîchies
     derrière. Les pages rangées sans leur query string. `CACHE_NAME` se bumpe à
     chaque changement de stratégie.
   - **Vidéo : la pause du visiteur est respectée**, l'observateur ne reprend
     que ce qu'il a lui-même mis en pause. Sur mobile et sous
     `prefers-reduced-motion`, pas d'`autoplay`, `preload="none"` et l'affiche
     (`data-poster`, posée par le script seulement, pour qu'un ordinateur qui
     lit la vidéo à l'arrivée ne la télécharge pas).
   - `styles.css` est un baril de 24 `@import`. **Mesuré** (Chrome, 2026-11-02,
     alors 22 imports) : **2 vagues** de requêtes — le baril, puis ses imports
     en parallèle. Le coût est **un** aller-retour de découverte, pas un par
     import. Concaténer l'économiserait, mais GitHub Pages publie le dépôt tel
     quel : sans étape de build, un bundle commité dériverait de ses sources au
     premier oubli. **Le baril reste la bonne solution tant qu'aucun build ne le
     régénère avant publication.** Ne pas « optimiser » sans mesure préalable.
   - **Poppins est préchargée, graisse par graisse.** Sans `preload`, la police
     n'est découverte qu'après les imports du baril et arrive après le premier
     rendu : bascule de police et décalage (CLS 0,032 sur l'accueil, mesuré
     Chrome, 2026-11-02, HTTP/2 local bridé à 150 ms / 1,6 Mb/s). Ne précharger
     que les graisses que le premier écran de la page dessine : une graisse
     préchargée qui ne sert pas est une requête perdue.

10. **Accessibilité (RGAA / WCAG).**
    - Navigation clavier complète, contrastes conformes en thème clair **et**
      sombre. Un seul indicateur de focus, `:focus-visible` dans
      `css/base/reset.css`, tracé hors de l'élément : un conteneur en
      `overflow: hidden` le rogne, donc on arrondit l'enfant plutôt que de
      rogner le parent.
    - **Chaque page à en-tête commence par un lien d'évitement** vers
      `<main id="main-content">`. Le défilement JS des ancres
      (`navigation.js`) l'exclut : seule la navigation native vers le fragment
      déplace le focus clavier dans `<main>`.
    - **Le focus ne se perd jamais.** Une section atteinte par une ancre, ou
      `<main>` après un choix dans la bannière, reçoit le focus par script
      (`tabindex="-1"`, sans anneau). Le menu mobile : focus sur son premier
      lien à l'ouverture, Échap le ferme et rend le focus au bouton, il se
      ferme quand le focus le quitte. Un bouton occupé est `aria-disabled`,
      jamais `disabled` : `disabled` éjecte le focus.
    - **Mode contraste élevé (`forced-colors`)** : `css/theme/forced-colors.css`
      rend aux icônes la couleur imposée et aux boutons leur bordure. Tout
      composant nouveau s'y vérifie.
    - Une zone qui défile au clavier (`<pre>` large) prend `tabindex="0"`, un
      rôle `region` et un nom (axe : scrollable-region-focusable).
    - Toute `<video>` porte un `<track kind="captions">` (SonarQube Web:S4084).
      Toute image porte un `alt` signifiant.
    - `prefers-reduced-motion` est honoré globalement dans
      `css/utils/animations.css` (WCAG 2.3.3). Les jetons de durée y passent à
      `0s`, **jamais à `none`** : les animations d'entrée démarrent à `opacity: 0` et
      comptent sur l'application de l'état final. Toute animation pilotée en JS
      (typewriter) doit tester la media query elle-même.
    - Un élément `position: fixed` transparent **n'est pas traversable** : sans
      `pointer-events: none`, sa boîte avale les clics de tout ce qu'elle
      recouvre.

---

## IV. Cadre de travail

11. **Intégrité de l'espace de travail.** Interdiction de polluer la racine avec
    des scripts jetables. Modifications chirurgicales. Vérifier `git status`
    avant chaque commit ; jamais de `git add -A` à l'aveugle.

12. **Sous-agents.** Autorisation et obligation d'utiliser des sous-agents pour
    les tâches lourdes (audit, refactoring, analyse). Leurs conclusions se
    vérifient : ils affirment parfois sans mesurer.

13. **Attribution.** Les commits sont rédigés **au seul nom du développeur**
    (`CLecart`). Interdiction formelle de mentionner l'IA (Claude / Gemini /
    Anthropic), y compris via un trailer `Co-Authored-By`.

14. **Honnêteté documentaire.** La documentation distingue le fait de la cible
    (`[CIBLE]`), et le `[CIBLE]` se retire dès que le fait est acquis.
    - L'arborescence documentée dans `README.md` et `about-portfolio.html`
      correspond au disque, fichier pour fichier.
    - **Ne jamais annoncer une vérification non exécutée.** Un test non lancé se
      dit « non lancé ».
    - Ce dépôt est public et lu par des recruteurs qui iront voir le code :
      chaque promesse non tenue discrédite tout le reste.
