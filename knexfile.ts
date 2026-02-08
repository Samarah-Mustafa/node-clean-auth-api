// knexfile.ts
import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./database.sqlite"
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./src/infrastructure/database/migrations",
      extension: "ts"
    },
    seeds: {
      directory: "./src/infrastructure/database/seeds",
      extension: "ts"
    }
  }
};

export default config;