# Configuration des fichiers d'envirronement

*Fichiers à créer dans le dossier `/config`*

## `auth-bdd.env`

### Structure

```env
MARIADB_ROOT_PASSWORD=
MARIADB_HOST=
MARIADB_DATABASE=
MARIADB_USER=
MARIADB_PASSWORD=
```

### Exemple

```env
MARIADB_ROOT_PASSWORD=oui
MARIADB_HOST=Reunionou_api_db
MARIADB_DATABASE=reunionou
MARIADB_USER=api_client
MARIADB_PASSWORD=non
```

## `main-bdd.env`

### Structure

```env
MARIADB_ROOT_PASSWORD=
MARIADB_HOST=
MARIADB_DATABASE=
MARIADB_USER=
MARIADB_PASSWORD=
```

### Exemple

```env
MARIADB_ROOT_PASSWORD=oui
MARIADB_HOST=Reunionou_api_db
MARIADB_DATABASE=reunionou
MARIADB_USER=api_client
MARIADB_PASSWORD=non
```
## `auth.env`

### Structure

```env
API_MAIN_URL=

SECRETPASSWDTOKEN=
```

### Exemple

```env
API_MAIN_URL=http://Reunionou_api_main_g5_v2:3000/api

SECRETPASSWDTOKEN=SG$SZlDSl@R58
```

## `gateway.env`

### Structure

```env
API_MAIN_URL=
API_AUTH_URL=
```

### Exemple

```env
API_MAIN_URL=http://Reunionou_api_main_g5_v2:3000/api
API_AUTH_URL=http://Reunionou_api_auth_g5_v2:3000/api
```
