import postgres from 'postgres';

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID} = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    application_name: ENDPOINT_ID,
  },
});

export default sql;