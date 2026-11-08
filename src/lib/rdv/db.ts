import type { PGlite, Transaction } from '@electric-sql/pglite';
import type { Pool, PoolClient } from 'pg';
import { applySchema } from './schema';

export interface Db {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]>;
  /** Tout ce que fait `fn` est annulé si elle lève une erreur. */
  tx<T>(fn: (db: Db) => Promise<T>): Promise<T>;
}

function createPgDb(pool: Pool): Db {
  const onClient = (client: PoolClient): Db => {
    const db: Db = {
      query: async <T>(sql: string, params: unknown[] = []) => (await client.query(sql, params)).rows as T[],
      tx: (fn) => fn(db),
    };
    return db;
  };
  return {
    query: async <T>(sql: string, params: unknown[] = []) => (await pool.query(sql, params)).rows as T[],
    tx: async (fn) => {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const result = await fn(onClient(client));
        await client.query('COMMIT');
        return result;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    },
  };
}

/** Base locale pour les tests et le développement. */
export function createPgliteDb(pg: PGlite): Db {
  const onTx = (tx: Transaction): Db => {
    const db: Db = {
      query: async <T>(sql: string, params: unknown[] = []) => (await tx.query<T>(sql, params)).rows,
      tx: (fn) => fn(db),
    };
    return db;
  };
  return {
    query: async <T>(sql: string, params: unknown[] = []) => (await pg.query<T>(sql, params)).rows,
    tx: async <T>(fn: (db: Db) => Promise<T>) => (await pg.transaction((tx) => fn(onTx(tx)))) as T,
  };
}

async function connect(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL manquante');
  if (url.startsWith('pglite://')) {
    const { PGlite } = await import('@electric-sql/pglite');
    const db = createPgliteDb(new PGlite(url.slice('pglite://'.length)));
    await applySchema(db);
    return db;
  }
  const { Client, Pool } = await import('pg');
  // Neon : le schéma passe par la connexion directe, les requêtes par le pooler (PgBouncer).
  const direct = new Client({ connectionString: process.env.DATABASE_URL_UNPOOLED || url });
  await direct.connect();
  try {
    await applySchema({
      query: async <T>(sql: string, params: unknown[] = []) => (await direct.query(sql, params)).rows as T[],
      tx: () => Promise.reject(new Error('transaction non prévue pendant la création du schéma')),
    });
  } finally {
    await direct.end();
  }
  return createPgDb(new Pool({ connectionString: url, max: 5 }));
}

const store = globalThis as unknown as { rdvDb?: Promise<Db> };

export function getDb(): Promise<Db> {
  store.rdvDb ??= connect()
    .catch((error) => {
      store.rdvDb = undefined;
      throw error;
    });
  return store.rdvDb;
}
