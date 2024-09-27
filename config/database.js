const path = require('path');
const { parse } = require("pg-connection-string");


module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT');
  const connection = env('DATABASE_ENV');

  const { host, port, database, user, password } = connection === 'postgres_prod' 
    ? parse(env("DATABASE_URL")) 
    : {};

  const connections = {
    postgres_local: {
      connection: {
        connectionString: env('DATABASE_URL'),
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5433),
        database: env('DATABASE_NAME', 'strapi-biz-backend-demo'),
        user: env('DATABASE_USERNAME', 'postgres'),
        password: env('DATABASE_PASSWORD'),
        ssl: env.bool('DATABASE_SSL', false) && {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool(
            'DATABASE_SSL_REJECT_UNAUTHORIZED',
            true
          ),
        },
        schema: env('DATABASE_SCHEMA', 'public'),
      },
      pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
    },
    postgres_prod_remote: {
      client: "postgres",
      connection: {
        host,
        port: '5432',
        database,
        user,
        password,
        ssl: env.bool("DATABASE_SSL", true),
      },
      debug: false
    },
    postgres_prod: {
      client: "postgres",
      connection: {
        host,
        port: '5432',
        database,
        user,
        password,
      },
      debug: false
    },
    sqlite: {
      connection: {
        filename: path.join(
          __dirname,
          '..',
          env('DATABASE_FILENAME', '.tmp/data.db')
        ),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      ...connections[connection],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
