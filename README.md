# Persistence OKLM
Comment démarrer un projet sans passer par la case modélisation de données ?


### Contexte
  
  
- Nous démarrons un **nouveau projet**.
- Le client a une idée **très précise** du produit idéal, mais une idée **très vague** de comment y parvenir
  - Nous avons réussi à le convaincre d'adopter une approche itérative, où nous intégrons rapidement des retours utilisateurs.
- Il a d'ailleurs déjà des utilisateurs pour tester et **il veut leur montrer un truc aujourd'hui** (l'idéal aurait été hier mais bon...).
  - Ce seront des *testeurs* mais **pas question de perdre leurs données** durant cette phase.
- Nous sommes **une petite équipe** moitié projet/marketing, moitié tech.

Vous l'aurez compris, il va falloir être efficaces et travailler en cycles courts, avec un seul objectif en tête : **tester les hypothèses produit en production**, idéalement chaque jour. 

Côté projet, l'enjeu sera une **communication fluide dans l'équipe**, sans séparer les techs du reste de l'équipe.

Côté technique, l'enjeu sera d'aller à l'essentiel. Chaque fonctionnalité déployée en prod, devra pouvoir être retirée (ou amendée) sans planification. Cela demande une **archi conçue pour le changement**.

Ce qui nous amène à notre premier défi...

#### Le problème de la persistence des données

Dans mon expérience, **les équipes perdent du temps lors de la modélisation des données**. Nous nous mettons, par exemple, d'accord sur des schéma de tables en nous basant sur des suppositions d'usage futur.

Et comme il y a enormément d'**incertitudes**, et qu'on a des données en prod, il est nécessaire de faire des scripts de migrations à chaque changement. Nous devons faire **un double effort** pour chaque changement (sur la structure et sur les données).

Ces efforts, à la longue, risquent de nous dissuader de faire ces changements, ou du moins, de les faire convenablement, pour garder notre *"vélocité"*. **La dette technique s'installe**...

Mais comment faire autrement ?

### Vers une autre solution

#### Le contrat

Voici un résumé des contraintes:

- Nous incluerons toute l'équipe et comme tout le monde ne connait pas le SQL, l'UML, les entités, nous restons dans le vocabulaire du produit
  - donc **pas de réunion de modélisation de données**
- Un changement dans le code ne doit pas répresenter une source de friction pour préserver les données
  - donc **pas de script de migration**
- Il est toujours trop tôt mais jamais trop tard pour optimiser
  - donc **pas d'optimisation des performances** avant d'avoir mesuré un impact
- Nous ne voulons pas de perte de données
  - donc **pas de perte de données**

#### Quelques mots sur le produit

Le client souhaite une application web où les utilisateurs pourront s'échanger des photos.

#### Et la stack technique

Utilisons des technos maitrisées par l'équipe.

- Typescript
- Node/Express
- React/[Tailwind](https://tailwindcss.com)
- Jest/[Storybook](https://storybook.js.org)
- Postgresql
- Déployé en continu sur un PaaS (Scalingo)

### Attaquons !

## Jour 1

Commençons par proposer aux utilisateurs d'envoyer une de leurs photos.

### Ajouter une photo

#### Page d'ajout de photo

Pour créer cette nouvelle page, créons un dossier `src/pages/AddNewPhotoPage` avec deux fichiers:
- `AddNewPhotoPage.tsx`: le composant React de la page
- `AddNewPhotoPage.stories.tsx`: le fichier Storybook, pour afficher la page et itérer dessus sans lancer d'application

> Remarquez que nous avons choisi d'utiliser des termes produit ("Add new photo") plutot que des termes techniques ("Image upload form").
>
> C'est subtil mais ça sera plus facile en discussion d'équipe.

Nous itérons sur cette page avec l'aide de Storybook. L'idée est qu'elle comprenne l'essentiel et soit utilisable par nos utilisateurs "alpha-testeurs".

Cette page n'est pas encore accessible aux utilisateurs. Il faut lui donner une route et rajouter un lien sur la page d'accueil.  

Pour gérer cette logique, nous créons le fichier [src/pages/AddNewPhoto/addNewPhoto.route.ts](./src/AddNewPhotoPage/addNewPhoto.route.ts) pour exposer une route dans express.

> Notre route retourne du HTML grace petit à l'utilitaire local [responseAsHtml](./src/utils/responseAsHtml.ts), qui utilise `ReactDOMServer.renderToString`.  
>
> En effet, pour commencer au plus simple, nous n'avons pas opté pour une SPA. Il n'y même pas encore de javascript executé coté front.  
> 
> Toute la logique et le rendering sont gérés coté nodejs. La navigation entre les pages se fait avec du HTML (liens, formulaires, etc.).  
>
> Ce n'est pas courant sur les projets React donc ne soyez pas surpris d'être surpris.

#### Sauvegarde du fichier de la photo

Pour le stockage du fichier image lui-même, nous réutilisons un code générique issus de précédents projets (par ici si ça vous intéresse: [photoStorage](./src/utils/photoStorage.ts)).

#### Persistence de l'ajout de la photo par l'utilisateur

Nous arrivons au besoin de persister l'information autour de la photo qui vient d'être ajoutée (quand, qui, quoi...) et c'était notre objectif de départ, à savoir "*est-ce que nous pouvons nous passer de modélisation de schéma de données ?*".

A ce stade, nous serions sans doute partis sur une table `photos` avec des colonnes pour retenir:
- Un identifiant (`photoId`)
- Qui a uploadé cette photo (`userId`)
- Quand (`Date.now()`)
- Où la photo est stockée

Et nous pourrions nous poser des questions comme :
- Est-ce que nous utilisons une clé étrangère pour lier la photo avec l'utilisateur ?

Mais en faisant ça, nous trichons déjà en créant une entité `photo` et peut-être même en faisant de l'optimisation prématurée.

Nous ne savons pas encore comment ces informations seront utilisées donc persistons tout. **Si avons enregistré tous les faits, nous pourrons toujours décider de comment consulter la donnée plus tard**. 

Tout ce que nous savons à ce stade, c'est ***qu'un utilisateur a ajouté une nouvelle photo***. C'est un **fait**.

#### Concevons une persistence à base de faits

Persistons seulement les **faits** (ou `fact`) dans une table `history`.

A chaque nouveau fait, insérons-le dans cette table. Cela correspond à un (ou plusieurs) `INSERT INTO history VALUES...`.
Le **fait** sera la seule primitive de persistence de notre application.

**L'état à date de notre application sera la somme des faits contenus dans son historique.** 

Le **fait** sera décrit par:
- un `type`, simple `string` qui décrira le type de fait qui s'est déroulé
  - ex: *un utilisateur a ajouté une nouvelle photo* ou `'NewPhotoAdded'` en réponse à la page `AddNewPhoto.tsx`.
- une date d'occurence (`occurredAt`)
- des `details` qui seront spécifiques au fait
  - stockés sous forme de JSON
  - ex: pour `NewPhotoAdded` `{ photoId: 'photo_1234', addedBy: 'user_1234', file: 'DSC_0001.jpg' }`

Cette table unique aura donc un format simple. 
On pourra faire des appels tout aussi simples:
- Persister un fait: `INSERT INTO history VALUES...`.
- Récupérer des faits: `SELECT * FROM history WHERE type='...';`

Implémentation au plus simple:

```ts
//
// src/utils/addToHistory.ts

type Fact = {
  id: string
  type: string
  occurredAt: Date
  details: any
}

// To be called to persist each new Fact
export const addToHistory = async ({ id, type, details, occurredAt }: Fact) => {
  await postgres.query('INSERT INTO history (id, type, details, occurredAt) VALUES ($1, $2, $3, $4)', [
    id,
    type,
    details,
    occurredAt,
  ])
}

// To be called once, at application launch (see server.ts)
export const createHistoryTable = async () => {
  return postgres.query(
    `CREATE TABLE IF NOT EXISTS history (id UUID PRIMARY KEY, type VARCHAR(255) NOT NULL, details JSONB, "occurredAt" TIMESTAMPTZ NOT NULL);`
  )
}

//
// src/AddNewPhotoPage/addNewPhoto.route.ts

const photoId = getUuid()
await addToHistory({
  id: getUuid(),
  occurredAt: new Date(),
  type: 'NewPhotoAdded',
  details: {
    photoId,
    addedBy: request.session.user.id,
    file: request.file.filename
  }
})
```

Nous pouvons arranger les choses pour avoir un plus bel appel à `addToHistory`.
Servons-nous de typescript !
Si vous n'êtes pas à l'aise avec le typescript, vous pouvez directement à la section suivante ([TODO: mettre lien vers la section suivante])

Dans un `Fact`, `id` sera un `uuid` généré à la volée et `occurredAt` sera la date actuelle.
Seuls `type` et `details` varieront d'un `Fact` à l'autre.

Rendons donc le type `Fact<Type, Details>` générique et implémentons une fonction `declareFact()` qui gérera les répétitions autour de `id` et `occurredAt`.

Déclarons aussi `NewPhotoAdded` grace à `Fact` et `declareFact`.
```ts
//
// src/AddNewPhotoPage/addNewPhoto.route.ts

const photoId = getUuid()
await addToHistory(
  NewPhotoAdded({
    photoId,
    addedBy: request.session.user.id,
    file: request.file.filename
  })
)

//
// src/AddNewPhotoPage/NewPhotoAdded.ts

// 1) Nous déclarons le type
export type NewPhotoAdded = Fact<
  'NewPhotoAdded',
  {
    photoId: string
    addedBy: string
    file: string
  }

// 2) Nous déclarons la fonction qui va jouer le role de "constructeur"
export const NewPhotoAdded = declareFact<NewPhotoAdded>('NewPhotoAdded')

// NewPhotoAdded(details) produit un simple objet (qui respecte le type NewPhotoAdded)
// en non une instance de classe

//
// addToHistory.ts

// [...]
export type Fact<Type extends string = string, Details = any> = {
  id: string
  type: Type
  occurredAt: Date
  details: Details
}

export const declareFact =
  <FactType extends Fact>(type: ExtractType<FactType>) =>
  (details: ExtractDetails<FactType>) => ({
    id: getUuid(),
    occurredAt: new Date(),
    type,
    details,
  })
  
// Some type utils
type ExtractType<FactType extends Fact> = FactType extends Fact<infer Type, any> ? Type : never

type ExtractDetails<FactType extends Fact> = FactType extends Fact<string, infer Details> ? Details : never

```

Les types génériques de `Fact` et `declareFact` demandent une certaine maitrise de typescript mais ne sont voués à être changés.
Ils permettent d'avoir une déclaration plus simple de `NewPhotoAdded`.
Enfin, les appels à `addToHistory` sont rendus plus concis et nous profitons de l'assistance de typescript dans l'IDE.

Une dernière chose: les `details` d'un `Fact` doivent pouvoir être insérés dans une colonne de type `jsonb`. Cela veut dire que les `details` doivent être serialisables.
Ajoutons donc une contrainte typescript sur le type `Details`, comme ceci:

```ts
//
// addToHistory.ts
type Literal = boolean | null | number | string
type JSON = Literal | { [key: string]: JSON } | JSON[]

type Fact<Type extends string = string, Details extends JSON = {}> = {
  id: string
  type: Type
  occurredAt: Date
  details: Details
}
```

Pas de mauvaise surprise:
```ts
// 🛑 Does NOT compile
type NewPhotoAdded = Fact<
  'NewPhotoAdded',
  {
    photoId: string
    addedBy: string
    addedOn: Date // 🚨 Date is not serializable
  }
>

// ✅ Compiles
type NewPhotoAdded = Fact<
  'NewPhotoAdded',
  {
    photoId: string
    addedBy: string
    addedOn: number // 👌 number is serializable
  }
>
```

#### Récapitulons

Nous avons
- un formulaire html pour uploader une photo,
- de quoi stocker la photo,
- et de quoi persister ce qu'il s'est passé.

Pour la persistence, nous avons utilisé une stratégie alternative: nous sauvegardons des faits dans une seule table historique. Chaque *fait* demande une conception, n'avons nous pas échangé une modélisation de données pour une autre ?

Pas tout à fait. La persistence sous forme de faits présente des avantages que nous allons voir dans la suite.

Remarquons déjà:
- Les différents faits sont déclarés dans des fichiers typescript
  - Leur forme n'a pas de réalité dans la base de données
- Nous sommes libres de modifier la forme des faits ou d'en rajouter, sans un seul appel sql (pas de migration)
- La table historique est destinée à être en lecture seule
  - Pas de perte de données possible !

Mais pour l'instant, nous n'avons vu que l'aspect insertion, continuons plutôt notre exercice pour voir comment se présente le reste.

TODO: à poursuivre
```
