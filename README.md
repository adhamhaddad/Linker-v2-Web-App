# Linker-v2

- [Linker-v2](#linker-v2)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [API Documentation](#api-documentation)
  - [Install App Dependencies](#install-app-dependencies)
  - [Running the app](#running-the-app)
  - [Database](#database)
  - [Built with](#built-with)
  - [License](#license)

## Installation

1. Clone the repository to your local machine.

## Database Setup

1. Create a new PostgreSQL database named `linker_v2`.
   - `CREATE DATABASE linker_v2;`
2. Run the following commands to create a new PostgreSQL user:
   - `CREATE ROLE admin WITH LOGIN PASSWORD 'admin';`
   - `ALTER ROLE admin SUPERUSER CREATEROLE CREATEDB;`
   - `GRANT ALL PRIVILEGES ON DATABASE linker_v2 TO admin;`
3. Run Redis server on port `6379`

**Note:** The `.env.example` file contains environment variables that are used by the application to connect to the database and Redis server, as well as the session secret key. Please review the file carefully before using it, and make any necessary changes to ensure that it works with your specific environment.

## API Documentation

[API](./documents/api-endpoints.md) - Read the APIs documentation.

## Install App Dependencies

```bash
# install server dependencies
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Database

```bash
# to create a migration
$ pnpm run migration:create ./src/database/migrations/name

# to generate a migration
$ pnpm run migration:generate ./src/database/migrations/name

# to run migrations
$ pnpm run migration:run

# to rollback migrations
$ pnpm run migration:rollback

# to drop schema
$ pnpm run schema:drop

```

## Built with

- Nest.js
- PostgreSQL
- MongoDB
- Redis

## License

Linker-v2-Web-App is [MIT licensed](LICENSE).
