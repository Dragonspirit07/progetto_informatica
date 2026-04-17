import mysql from "mysql2/promise";
 
declare global {
  var _mysqlPool: mysql.Pool | undefined;
}
 
function createPool(): mysql.Pool {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;

  if (!host || !user || !password || !database) {
    throw new Error("Missing required DB environment variables: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME");
  }

  const port = Number(process.env.DB_PORT ?? 3306);
  if (isNaN(port)) {
    throw new Error("Invalid DB_PORT: must be a number");
  }

  return mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

function getPool(): mysql.Pool {
  if (!global._mysqlPool) {
    global._mysqlPool = createPool();
  }
  return global._mysqlPool;
}

type QueryResult = mysql.RowDataPacket[] | mysql.ResultSetHeader;

export const pool = {
  query<T extends mysql.RowDataPacket[]>(
    sql: string,
    values?: unknown[]
  ): Promise<[T, mysql.FieldPacket[]]> {
    return getPool().query<T>(sql, values as (string | number | boolean | null | Buffer | Date)[]);
  },
  execute(
    sql: string,
    values?: unknown[]
  ): Promise<[mysql.ResultSetHeader, mysql.FieldPacket[]]> {
    return getPool().execute(sql, values as (string | number | boolean | null | Buffer | Date)[]) as Promise<[mysql.ResultSetHeader, mysql.FieldPacket[]]>;
  },
};