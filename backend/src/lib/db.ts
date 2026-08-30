import mysql from 'mysql2/promise';

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
  database: process.env.DB_NAME || 'velocity_shoes_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Prevent multiple pools in Next.js development hot-reloading
const globalForDb = globalThis as unknown as {
  dbPool: mysql.Pool | undefined;
};

export const dbPool = globalForDb.dbPool ?? mysql.createPool(poolConfig);

if (process.env.NODE_ENV !== 'production') {
  globalForDb.dbPool = dbPool;
}

let isAuthDbInitialized = false;

// Dynamic database connectivity check
export async function testConnection(): Promise<boolean> {
  try {
    const connection = await dbPool.getConnection();
    connection.release();

    if (!isAuthDbInitialized) {
      isAuthDbInitialized = true;
      const { initAuthTables } = await import('./user-store');
      initAuthTables().catch(err => {
        isAuthDbInitialized = false;
        console.error('[MySQL] initAuthTables async error:', err);
      });
    }

    return true;
  } catch (error) {
    console.warn('[MySQL db] Connection test failed. Database is likely offline.');
    return false;
  }
}

// SQL query wrapper
export async function query<T>(sql: string, params?: any[]): Promise<T> {
  const [results] = await dbPool.execute(sql, params);
  return results as T;
}
