# Persistence OKLM
Comment démarrer un projet sans passer par la case modélisation de données ?

<details>
  <summary>Afficher le contexte du projet</summary>

### Contexte
  
  
- Je démarre un **nouveau projet**.
- Mon client peut parler des heures de son projet mais en réalité a une **idée très vague** du produit.
- Il a déjà des utilisateurs pour tester et **il veut leur montrer un truc aujourd'hui** (l'idéal aurait été hier mais bon...).
  - Ce seront des *testeurs* mais **pas question de perdre leurs données** durant cette phase.
- Nous sommes **une petite équipe** moitié projet/marketing, moitié tech.

Vous l'aurez compris, il va falloir être efficaces et travailler en cycles courts, avec un seul objectif en tête : **tester les hypothèses produit en production**.

Côté projet, l'enjeu sera une **communication fluide dans l'équipe**. Pas le temps pour les traductions, les membres de l'équipe parleront le même jargon.

Côté technique, l'enjeu sera de ne pas perdre de temps à construire des cathédrales. Chaque fonctionnalité déployée un jour, devra pouvoir être retirée (ou amendée) le lendemain. Cela demande une **archi optimisée pour le changement**.

Ce qui nous amène à notre premier défi...

#### Le problème de la persistence des données

Dans mon expérience, **les équipes perdent du temps lors de la modélisation des données**. Nous nous mettons, par exemple, d'accord sur des schéma de tables en nous basant sur des suppositions d'usage futur.

Et comme il y a enormément d'**incertitudes**, et qu'on a des données en prod, il est nécessaire de faire des scripts de migrations à chaque changement. **Nous payons double chaque changement !**

Intuitivement, ce phénomène désagréable nous incite à éviter les refontes coté code, adapter le code existant pour un nouvel usage, et **la dette technique s'installe**...

Mais comment faire autrement ?

### Vers une autre solution

Prenons le temps de ce moment pour imaginer une solution alternative. Nous ne sommes pas (encore) dans le stress et n'avons pas (encore) le nez dans le guidon.

Ce ne sera qu'un exercice de l'imagination, OKLM.

#### Le contrat

Voici les objectifs de la solution à trouver:

- **Pas de réunion de modélisation de données**
  - Je dois pouvoir inclure toute l'équipe et tout le monde ne connait pas le SQL, l'UML, les entités, ... On reste dans les termes métier !
- **Pas de script de migration**
- **Pas de perte de données**

Infaisable ? Allez, je précise quelque chose qui rendra peut-être la tâche plus accessible:

- **Pas d'objectif en terme de perfs**
   - Il est toujours trop tôt mais jamais trop tard pour optimiser.

#### Quelques mots sur le produit

Alors, je me suis un peu perdu dans les explications du client, et les autres membres de l'équipe aussi...

Il est parti un peu vite de la réunion (un avion à prendre ?) et n'est pas joignable pour répondre à nos questions avant demain.

Cela dit, il nous a promis de nous consacrer 5 min chaque jour pour nous faire des retours. Pour le reste, il faudra voir avec les utilisateurs.

Une chose est sure c'est **une application web de photos**. Donc on peut partir sur ça et construire au fur et à mesure.

Je vous avais prévenus qu'il faudrait travailler dans l'incertitude. Mais c'est le cas plus ou moins de tous les projets, non ?


#### Et la stack technique

Je ne veux pas prendre de risque, je n'utilise que des technos que je maitrise bien. Peu importe les perfs.  

Pas de framework "magique" qui prend la main sur tout et introduit des incompatibilités.

- Typescript
- Node/Express
- React/Tailwind
- Jest/Storybook
- Postgresql
- Déployé en continu sur un PaaS (Scalingo)

Mais honnêtement, nous allons rester dans des choses très simples donc il est possible de suivre sans connaitre ces technos.

### Attaquons !

Je crée une branche pour suivre l'avancée chaque jour.  

Vous trouverez [la branche du premier jour ici](https://github.com/oklmdev/persiste/tree/day1/uploadPhoto).
</details>

## Jour 1

Qu'est-ce qu'une app de photos sans mécanisme d'upload de photo ?

### Page d'upload de photo

A chaud, je dirais qu'il nous faut:
- Une page avec un formulaire pour que l'utilisateur sélectionne une image à uploader
- Un point d'entrée back pour afficher cette page
- ...

✋🙈 STOP! Evitons de produire un backlog, faisons plutôt des petits pas ! 🐣

#### Formulaire d'upload
Pour créer une nouvelle vue, je n'ai besoin que d'un composant React et de Storybook pour l'essayer.

Je crée un dossier `AddNewPhotoPage` avec deux fichiers `AddNewPhotoPage.tsx` et `AddNewPhotoPage.stories.tsx`.

Je commence par faire quelques allers-retours avec ChatGPT, que j'essaye avec Storybook.  
En quelques minutes, j'ai une page visuellement passable ([AddNewPhotoPage.tsx](./src/AddNewPhotoPage/AddNewPhotoPage.tsx)).

> Remarquez que j'ai choisi d'utiliser des termes métier ("Add new photo") plutot que des termes techniques ("Formulaire d'upload d'image").
> 
> C'est subtil mais ça sera plus facile en discussion d'équipe.

On arrive ici : [7f79336d967a532d7f830b31dd393375704026db](7f79336d967a532d7f830b31dd393375704026db).

Cette page n'est pas encore accessible aux utilisateurs. Il faut lui donner une route et rajouter un lien sur la page d'accueil.  
Cette logique est gérée le fichier [addNewPhoto.route.ts](./src/AddNewPhotoPage/addNewPhoto.route.ts).

> Notre route ne retourne que du HTML tout simple (via le petit utilitaire local [responseAsHtml](./src/utils/responseAsHtml.ts), que je vous invite à lire).  
>
> En effet, ce n'est pas une SPA, il n'y même pas encore de javascript executé coté front.  
> 
> Pour rester au plus simple, toute la logique est gérée coté back. Le reste est géré avec des simples liens, des formulaires, etc.  
>
> Ce n'est pas courant sur les projets React donc ne soyez pas surpris d'être surpris 😆.
> 
> Mais ceci n'est pas le sujet !

#### Sauvegarde de la photo

Branchons maintenant sur un système de persistence de fichiers. Je prends ce que j'ai sous la main, qui permet d'uploader en local ou sur S3.

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

// To be called to persist each new Fact
export const addToHistory = async ({ id, type, details, occurredAt }: Fact) => {
  await postgres.query('INSERT INTO history (id, type, details, occurredAt) VALUES ($1, $2, $3, $4)', [
    id,
    type,
    details,
    occurredAt,
  ])
}


type Fact = {
  id: string
  type: string
  occurredAt: Date
  details: any
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

Ce qui est spécifique d'un fait à l'autre est `type` et `details`. `id` et `occurredAt` seront toujours traités de la même façon.

Rendons `Fact` générique puis implémentons une fonction `makeFact` pour gérer les répétitions autour de `id` et `occurredAt`:

```ts
//
// addToHistory.ts

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

//
// src/AddNewPhotoPage/NewPhotoAdded.ts

type NewPhotoAdded = Fact<
  'NewPhotoAdded',
  {
    photoId: string
    addedBy: string
  }
>

const NewPhotoAdded = makeFact<NewPhotoAdded>('NewPhotoAdded')

//
// src/AddNewPhotoPage/addNewPhoto.route.ts

const photoId = getUuid()
await addToHistory(
  NewPhotoAdded({
    photoId,
    addedBy: request.session.user.id,
  })
)

```

Bon, le typescript n'est pas forcément simple mais au moins l'appel à `addToHistory` l'est.
On peut mettre de coté les types de `addToHistory` et se concentrer sur ses appels.

Une dernière chose: les `details` d'un `Fact` doivent pouvoir être insérés dans une colonne de type `jsonb`. Cela veut dire que les `details` doivent être serialisables.
Ajoutons donc une petite contrainte typescript sur le type `Details`, comme ceci:

```ts
//
// addToHistory.ts
type Literal = boolean | null | number | string
type JSON = Literal | { [key: string]: JSON } | JSON[]

type Fact<Type extends string = string, Details extends JSON = any> = {
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