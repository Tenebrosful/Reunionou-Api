# Projet Reunionou (API)

*Atelier du 21/03/2022 au 30/03/2022*

*[Lire le README-GLOBAL du projet](./README-GLOBAL.md)*

## Configuration des fichiers d'envirronement

### `.env` du docker-compose à la racine du projet

```env
EXPOSED_ADMINER_PORT=
EXPOSED_GATEWAY_API_PORT=
```

### Autres fichiers d'envirronement

[Voir le dossier config](./config/README.md)

## Adresse de déployement

- http://docketu.iutnc.univ-lorraine.fr:62461

## Contributions (Dépôt API)

- Hugo Bernard `bernar323u`
  - Setup Git, Workflows et Linters
  - Modèles de donnée `UML`
  - Modèles Sequelize de la BDD `TS`
  - Mise en place du docker
  - Déployement de l'API sur Docketu
  - Routes Express de l'API `TS`
  - [Documentation de l'API](https://github.com/Tenebrosful/Reunionou-Api/wiki/Api-Endpoint)
- Geoffrey Porayko `porayko1u`
  - Mise en place de la base du Gateway `TS`
  - Mise en place authentification et token `TS, JWT` 
  - Mise en place de diverses routes `TS`
