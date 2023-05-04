# Persistence OKLM
Comment démarrer un projet sans passer par la case modélisation de données ?

<details>
  <summary>Afficher le contexte du projet</summary>

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
- React/Tailwind
- Jest/Storybook
- Postgresql
- Déployé en continu sur un PaaS (Scalingo)

### Attaquons !

> Je crée une branche pour suivre l'avancée chaque jour.  
>
> Vous trouverez [la branche du premier jour ici](https://github.com/oklmdev/persiste/tree/day1/uploadPhoto).
</details>

## Jour 1

Commençons par proposer aux utilisateurs d'envoyer une de leurs photos.

### Ajouter une photo

#### Page d'ajout de photo

Pour créer cette nouvelle page, créons un dossier `src/pages/AddNewPhotoPage` avec deux fichiers:
- `AddNewPhotoPage.tsx`: le composant React de la page
- `AddNewPhotoPage.stories.tsx`: le fichier Storybook, pour afficher la page et itérer dessus sans lancer d'application 

> Remarquez que nous avons choisi d'utiliser des termes produit ("Add new photo") plutot que des termes techniques ("Formulaire d'upload d'image").
> 
> C'est subtil mais ça sera plus facile en discussion d'équipe.

Nous arrivons ici : [TODO: mettre le lien vers le commit correspondant].

Cette page n'est pas encore accessible aux utilisateurs. Il faut lui donner une route et rajouter un lien sur la page d'accueil.  
Pour gérer cette logique, nous créons le fichier [src/pages/AddNewPhoto/addNewPhoto.route.ts](./src/AddNewPhotoPage/addNewPhoto.route.ts).

> Notre route retourne du HTML grace petit à l'utilitaire local [responseAsHtml](./src/utils/responseAsHtml.ts), qui utilise `ReactDOMServer.renderToString`.  
>
> En effet, pour commencer au plus simple, nous n'avons pas opté pour une SPA. Il n'y même pas encore de javascript executé coté front.  
> 
> Toute la logique et le rendering sont gérés coté nodejs. La navigation entre les pages se fait avec du HTML (liens, formulaires, etc.).  
>
> Ce n'est pas courant sur les projets React donc ne soyez pas surpris d'être surpris.

#### Sauvegarde de la photo

Branchons maintenant sur un système de persistence de fichiers. Nous pouvons nous *inspirer* de ce que nous avons déjà codé, et qui permet d'uploader en local ou sur S3.

#### Enfin, le sujet de la persistence !

Nous arrivons au besoin de persister l'information autour de la photo qui vient d'être uploadée (quand, qui, quoi...) et c'était notre objectif de départ, à savoir "*est-ce que nous pouvons nous passer de modélisation de schéma de données ?*".

Nous cherchons à rendre compatible les choses suivantes:
- **Ne pas perdre d'information**
  - Nous n'avons qu'une seule occasion d'écrire les informations dans leur intégralité, lors de l'execution d'une action.
- **Ne pas polluer notre conception de persistence** avec des suppositions sur l'utilisation future de ces informations
  - Les sujets de lecture et d'écriture sont souvent mélangées lorsque notre concevons notre db.
  - **Si nous avons tout enregistré, nous pourrons toujours changer les requêtes en lecture**, impossible donc de faire une grosse erreur.

La difficulté et l'enjeu de notre exercice est donc de penser à la persistence sans perte d'information, tout en mettant totalement de coté la manière dont nous allons nous en servir.

A ce stade, nous serions sans doute partis sur une table `photos` avec des colonnes pour retenir:
- Qui a uploadé cette photo (`userId`)
- Quand (`Date.now()`)
- Un identifiant (`photoId`)

Et qu'on se pose des questions comme :
- Est-ce qu'on utilise une clé étrangère pour lier la photo avec l'utilisateur ?

Mais en faisant ça, on triche déjà en créant une entité `photo`.

Non, tout ce qu'on sait, c'est ***qu'un utilisateur a ajouté une nouvelle photo***. C'est un **fait**.

#### Conception de la persistence à base de faits

Je nous propose de ne persister que des **faits** (ou `fact`) dans une table `history`.

L'état à date de notre application sera représenté par son historique, c'est à dire l'ensemble des faits.  
Le **fait** sera la seule primitive de persistence de notre application. Quand il se passe quelque chose, un fait sera ajouté à l'historique, l'équivalent d'un (ou plusieurs) `INSERT INTO photos VALUES...`.

Le **fait** sera décrit par:
- un `type`, simple `string` qui décrira le type de fait qui s'est déroulé
  - ex: *un utilisateur a ajouté une nouvelle photo* ou `'NewPhotoAdded'` en réponse à la page `AddNewPhoto.tsx`.
- une date d'occurence (`occurredAt` ? `happenedOn`? ...)
- des `details` qui seront spécifiques au fait 
  - ex: `addedBy` pour `NewPhotoAdded`
  - un `jsonb` de postgres sera idéal

Cette table unique aura donc une format simple. 
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
  type: 'NewPhotoAdded',
  occurredAt: new Date(),
  details: {
    photoId,
    addedBy: request.session.user.id,
  }
})
```
Je pense que nous pouvons arranger les choses pour avoir un bel appel à `addToHistory`.
Servons-nous de typescript !

Dans un `Fact`, `id` sera toujours un `uuid` généré à la volée et `occurredAt` sera toujours la date actuelle.
`type` et `details` varieront d'un `Fact` à l'autre.

Rendons donc `Fact` générique puis implémentons une fonction `makeFact` pour gérer les répétitions autour de `id` et `occurredAt`.
Déclarons aussi `NewPhotoAdded` comme un `Fact` spécifique.
```ts
//
// src/AddNewPhotoPage/addNewPhoto.route.ts

const photoId = getUuid()
await addToHistory(
  NewPhotoAdded({
    photoId,
    addedBy: request.session.user.id,
  })
)

//
// src/AddNewPhotoPage/NewPhotoAdded.ts

export type NewPhotoAdded = Fact<
  'NewPhotoAdded',
  {
    photoId: string
    addedBy: string
  }
>

export const NewPhotoAdded = makeFact<NewPhotoAdded>('NewPhotoAdded')

//
// addToHistory.ts

// [...]
export type Fact<Type extends string = string, Details = any> = {
  id: string
  type: Type
  occurredAt: Date
  details: Details
}

export const makeFact =
  <FactType extends Fact>(type: ExtractType<FactType>) =>
  (details: ExtractDetails<FactType>) => ({
    id: getUuid(),
    occurredAt: new Date(),
    type,
    details,
  })
```

Les types génériques de `Fact` et `makeFact` demandent une certaine maitrise de typescript mais ne sont voués à être changé.
Ils permettent d'avoir une déclaration relativement simple de `NewPhotoAdded`.
Enfin, les appels à `addToHistory` sont rendus plus aisée grace à l'assistance de typescript dans l'IDE.

Une dernière chose: les `details` d'un `Fact` doivent pouvoir être insérés dans une colonne de type `jsonb`. Cela veut dire que les `details` doivent être serialisables.
Ajoutons donc une petite contrainte typescript sur le type `Details`, comme ceci:

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
    takenOn: Date // 🚨 Date is not serializable
  }
>

// ✅ Compiles
type NewPhotoAdded = Fact<
  'NewPhotoAdded',
  {
    photoId: string
    addedBy: string
    takenOn: number // 👌 number is serializable
  }
>
```
