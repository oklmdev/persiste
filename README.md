# Persistence OKLM
Comment démarrer un projet sans passer par la case modélisation de données ?

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

