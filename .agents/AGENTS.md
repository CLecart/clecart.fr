# Manifeste de Développement : Règles de l'Art, Bonnes Pratiques et Conformité (Projet clecart.fr)

Ce document définit les standards absolus et non négociables pour le portfolio **clecart.fr**. Tout ajout, modification ou intervention de l'agent IA doit s'inscrire dans une démarche stricte de **qualité logicielle premium**, s'inspirant des meilleurs standards de l'industrie (Clean Code, SOLID, OWASP, Green IT) et adaptés à une **application web statique sans framework** (HTML/CSS/JavaScript ES modules, servie par GitHub Pages).

**Contexte technique déterminant :** aucun build, aucun bundler, aucun backend, aucune base de données. Le navigateur consomme les sources telles qu'elles sont commitées. Toute règle ci-dessous découle de cette contrainte : il n'y a pas d'outil pour rattraper une négligence à la compilation.

---

## I. Les Règles de l'Art (Ingénierie Logicielle Premium)

1. **Architecture Limpide (Clean Architecture & SRP) :**
   Le code doit être modulaire, découplé et respecter le principe de responsabilité unique. La séparation est portée par l'arborescence et doit le rester : `js/modules/` pour les fonctionnalités métier, `js/utils/` pour les utilitaires techniques, `css/` en architecture SMACSS (`base` / `components` / `layout` / `sections` / `theme` / `utils`). Un fichier placé dans la mauvaise couche est un défaut, même s'il fonctionne. Les solutions de contournement (hacks) sont proscrites : lorsqu'un hack est structurellement nécessaire (ex. `transition: background-color 5000s` pour neutraliser l'autofill Chrome), il doit porter un commentaire expliquant la contrainte.

2. **Zéro Dette Technique & Clean Code :**
   Le code doit être concis et s'expliquer de lui-même grâce au nommage explicite (Ubiquitous Language : `project-card`, `gdpr-banner`, `section-active`).
   - *Bannissement des commentaires "perroquets"* qui décrivent l'évidence.
   - Les seules documentations autorisées sont les standards : **JSDoc** pour JavaScript.
   - **Zéro code mort.** Un fichier non importé, un keyframe non référencé, une classe CSS sans markup correspondant ou une constante non utilisée doivent être supprimés, pas conservés « au cas où ». L'historique Git est la sauvegarde.

3. **Complexité Maîtrisée (Règle S3776) :**
   Aucune fonction ne doit dépasser une **complexité cognitive de 15**. L'IA doit systématiquement extraire la logique complexe dans des fonctions utilitaires (Helper functions).

---

## II. Les Bonnes Pratiques (Modernité et Fiabilité)

4. **Syntaxe Moderne et Sécurisée (JavaScript ES2021+) :**
   - Utilisation systématique de l'Optional Chaining (`?.`) et du Nullish Coalescing (`??`).
   - `const` par défaut, `let` si réassignation, **`var` interdit**. `globalThis` plutôt que `window`.
   - ES modules exclusivement (`import` / `export`). Aucun script inline hors du bootstrap de thème anti-FOUC en `<head>`, qui doit rester minimal.
   - Isolation des effets de bord : un module exporte des fonctions `init*()` appelées par `js/main.js`, jamais d'exécution implicite à l'import.

5. **Anticipation SonarQube & Zéro Récidive :**
   - **Un seul mécanisme par problème.** Deux générations concurrentes du même dispositif (ex. anti-FOUC `js-loading` *et* `no-js`) sont une faute : la morte est supprimée immédiatement.
   - **Redondance CSS :** un `@keyframes` est défini **exactement une fois**, dans `css/utils/animations.css` s'il est partagé par plusieurs couches. Une définition dupliquée dans un fichier importé plus tard écrase silencieusement l'autre et rend le débogage impossible.
   - **Design tokens obligatoires :** durées et courbes viennent de `css/base/variables.css` (`--duration-*`, `--ease-*`, `--transition*`). Toute valeur codée en dur (`0.4s`, `cubic-bezier(...)`) est un défaut. Une durée hors de l'échelle définie doit d'abord devenir un token.
   - **Nommage CSS homogène :** kebab-case pour les classes **et** les `@keyframes`, sans exception.
   - **Zéro Warning Toléré :** tous les avertissements ESLint doivent être résolus à la source. **[CIBLE]** — l'outillage est actuellement inopérant : ni ESLint ni Prettier ne sont installés, et `.eslintrc.json` est au format legacy refusé par ESLint 9+. Restaurer un lint qui s'exécute est un prérequis à toute revendication de qualité.

6. **Tests, CI/CD & Journal de Bord :**
   - **Mise à jour du Journal de Bord :** chaque intervention (ajout, fix, refacto) doit être rigoureusement consignée dans le fichier `docs/JOURNAL_DE_BORD.md`. Jamais de fichier CHANGELOG.md.
   - Validation stricte du linter (ESLint) et formatage (Prettier).
   - **[CIBLE]** Aucune CI n'existe : le lint, l'audit Lighthouse et l'analyse SonarQube ne tournent à aucun moment automatiquement. Tant que c'est le cas, toute vérification est manuelle et doit être explicitement rapportée, jamais supposée.

---

## III. La Conformité (Sécurité, UX & Éthique)

7. **Sécurité DevSecOps & OWASP Top 10 :**
   Sans backend ni base de données, la surface d'attaque est la **chaîne d'approvisionnement front** et l'injection DOM.
   - **Intégrité des ressources distantes (SRI) :** tout `<script>` ou `<link rel="stylesheet">` tiers doit être **épinglé à une version exacte** puis signé par `integrity` + `crossorigin="anonymous"`. Épingler une plage flottante (`@3`) puis y ajouter un hash casse le site au premier patch amont : le pin précède toujours la signature.
   - Toute injection de contenu se fait par `textContent`, jamais par `innerHTML` sur une donnée non maîtrisée (formulaire de contact, paramètres d'URL).
   - Les secrets (clés EmailJS) transitent par `config.json`, ignoré par Git.

8. **Souveraineté & Données Personnelles (RGPD) :**
   Le site collecte des données via le formulaire de contact et l'analytics.
   - **Consentement préalable réel :** aucun traçage avant acceptation explicite via la bannière (`js/utils/gdpr.js`). Le refus doit être aussi simple que l'acceptation et rester respecté.
   - Analytics privacy-first : aucune donnée personnelle identifiable, aucun partage tiers.
   - `privacy-policy.html` doit décrire l'état réel du traitement, jamais une intention.

9. **Sobriété Numérique (Green IT) :**
   Positionnement revendiqué publiquement par le portfolio : il engage le code.
   - **Le poids transféré est le premier critère.** Images en WebP, vidéos de démo en lazy-load via IntersectionObserver, `loading="lazy"` systématique.
   - Ne jamais précacher dans le Service Worker une ressource que le site ne charge pas : c'est de la bande passante gaspillée à chaque installation.
   - **[CIBLE]** `styles.css` enchaîne 25 `@import` séquentiels, soit 25 allers-retours réseau bloquants avant le premier pixel. C'est l'écart le plus coûteux entre le discours Green IT et le code : à traiter par concaténation avant toute autre optimisation de rendu.

10. **Accessibilité Numérique (RGAA / WCAG) :**
    - Navigation clavier complète, contrastes conformes en thème clair **et** sombre.
    - Toute `<video>` porte un `<track kind="captions">` (SonarQube Web:S4084). Toute image porte un `alt` signifiant.
    - **[CIBLE]** `prefers-reduced-motion` n'est honoré nulle part dans le CSS alors que le site est fortement animé. Sur un site à ce point animé, c'est un manquement direct au WCAG 2.3.3.

---

## IV. Cadre Opérationnel de l'IA

11. **Intégrité de l'Espace de Travail :**
    Interdiction de polluer la racine du projet avec des scripts jetables. Les modifications doivent être chirurgicales.

12. **Autonomie et Sous-Agents Multiples :**
    L'agent principal a l'autorisation et l'obligation d'utiliser des **sous-agents** pour les tâches complexes (audit de sécurité, refactoring, analyse de performance) afin d'accélérer l'exécution.

13. **Attribution & Discrétion (Historique Git) :**
    Les commits sont rédigés **au seul nom du développeur** (`CLecart`). Interdiction formelle de mentionner l'IA (Claude/Gemini/Anthropic), y compris via un trailer `Co-Authored-By`.

14. **Socle de Sécurité Non-Régressif :**
    - Aucun secret n'est commité (`.env` et `config.json` systématiquement dans le `.gitignore`).
    - Un correctif de sécurité ne doit jamais dégrader une fonctionnalité au passage : une signature SRI qui casse le formulaire de contact est un échec, pas une conformité.

15. **Honnêteté Documentaire :**
    La documentation distingue le fait de la cible (`[CIBLE]`).
    - L'arborescence documentée dans `README.md` et `about-portfolio.html` doit correspondre au disque, fichier pour fichier. Documenter un fichier inexistant est un mensonge technique.
    - Ne jamais annoncer une vérification qui n'a pas été exécutée. Un test non lancé se dit « non lancé ».
