# Projet Reunionou

## Documents fournis

- [Page Arches](https://arche.univ-lorraine.fr/course/view.php?id=6849)
- [Consignes](https://arche.univ-lorraine.fr/mod/resource/view.php?id=1406139)
- [Déployement Docketu](https://arche.univ-lorraine.fr/mod/resource/view.php?id=1151738)
- [Sujet](https://arche.univ-lorraine.fr/mod/resource/view.php?id=1413704)
- [Présentaton du projet](https://arche.univ-lorraine.fr/mod/resource/view.php?id=1413708)

## Contributions

- Hugo Bernard `bernar323u`
  - Setup Git, Workflows et Linters
  - Modèles de donnée `UML`
  - Modèles Sequelize de la BDD `TS`
  - Mise en place du docker
  - Déployement de l'API sur Docketu
  - Routes Express de l'API `TS`
  - [Documentation de l'API](https://github.com/Tenebrosful/Reunionou-Api/wiki/Api-Endpoint)

- Geoffrey Porayko `porayko1u`
  - Backend API
    - Mise en place de la base du Gateway `TS`
    - Mise en place authentification et token `TS, JWT` 
    - Mise en place de diverses routes `TS`
  - Application web
    - Géolocalisation des évènements
    - Affichage des évènement
    - Affichage des participant à un évènement
    - Affichage des commentaire
    - Affichage des informations supplémentaire
    - Affichage du profil
    - Possibilité de s'enregistrer (rejoindre ou décliner) à un évènement pour lequel on est invité
    - Possibilité d'ajouter des participants à notre évènement
    - Possibilité d'ajouter ou de supprimer un commentaire sur un évènement
    - Création d'un évènement
    - Inscription et Authentification
    - Modification du profil
    - Menu affichage des listes des évènement auquels je suis convié et de mes évènements
  
 
- Tania Olivia `olivia1u` 
  - BackOffice
    - Les maquettes de BackOffice `balsamiq`
    - L'interface de BackOffice `VueJS`
    - Gestion des utilisateurs `VueJS, Axios`
    - Gestion des événements `VueJS, Axios`
    - Connexion avec authentification `JS, Axios`
    - Stockage des données (token, connexion(boolean), admin) `VueJS, Vuex` 
  - MobileApp
    - L'interface de MobileApp `Dart`
    - Géolocaliser l'événement `GoogleMap, Dart, http`
    - Je viens et désolée `Dart, http, flutter_secure_storage`
    - Commentaires `Dart, http, flutter_secure_storage`
    - Participants `Dart, http, flutter_secure_storage`
    - Connexion avec authentification `Dart, http, JWT, flutter_secure_storage`
    - Stockage des données (token, id, username) `Dart, flutter_secure_storage`
    - Partager un événement `Dart, http, flutter_secure_storage`


- Ziyi Wang `wang272u` 
  - Les maquettes de MobileApp `balsamiq`
  - L'interface de MobileApp `Dart`
  - Géolocaliser l'événement `GoogleMap, Dart, http, flutter_secure_storage`
  - Gestion de profil `GoogleMap, Dart, http, flutter_secure_storage`
  - Créer un événement `Dart, flutter_google_places, http`
  - Géolicalisation par adresse `Dart, flutter_google_places, http`
  - Connexion avec authentification `Dart, http, JWT, flutter_secure_storage`
  - Stockage des données (token, id, username) `Dart, flutter_secure_storage`
  - Partager un événement `Dart, http, flutter_secure_storage`
