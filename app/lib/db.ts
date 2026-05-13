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

function getPool(): mysql.Pool | null {
  if (global._mysqlPool) {
    return global._mysqlPool;
  }
  if (process.env.NODE_ENV === "development" && !process.env.DB_HOST) {
    return null;
  }
  global._mysqlPool = createPool();
  return global._mysqlPool;
}

export const pool = {
  query<T extends mysql.RowDataPacket[]>(
    sql: string,
    values?: unknown[]
  ): Promise<[T, mysql.FieldPacket[]]> {
    const p = getPool();
    if (!p) {
      return Promise.resolve([[] as unknown as T, [] as mysql.FieldPacket[]]);
    }
    return p.query<T>(sql, values as (string | number | boolean | null | Buffer | Date)[]);
  },
  execute(
    sql: string,
    values?: unknown[]
  ): Promise<[mysql.ResultSetHeader, mysql.FieldPacket[]]> {
    const p = getPool();
    if (!p) {
      return Promise.resolve([{ insertId: 0, affectedRows: 0 } as mysql.ResultSetHeader, [] as mysql.FieldPacket[]]);
    }
    return p.execute(sql, values as (string | number | boolean | null | Buffer | Date)[]) as Promise<[mysql.ResultSetHeader, mysql.FieldPacket[]]>;
  },
};