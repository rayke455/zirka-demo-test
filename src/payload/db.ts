import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";

/**
 * DATABASE_URI is what this project sets by hand. DATABASE_URL is what the
 * Neon and Vercel Postgres integrations add to a project on their own, and
 * missing it is how a deployment silently falls back to a SQLite file that the
 * host wipes between requests. Accept either.
 */
const uri = process.env.DATABASE_URI || process.env.DATABASE_URL || "file:./zirka.db";
const isPostgres = uri.startsWith("postgres");

/**
 * Postgres in production (Vercel gives each request a fresh, read-only disk, so a
 * SQLite file cannot survive there). SQLite stays available for local work.
 * Schema changes go through migrations — automatic push is off because it
 * generated duplicate index statements on this schema.
 */
export const db = isPostgres
  ? postgresAdapter({ push: false, pool: { connectionString: uri } })
  : sqliteAdapter({ push: false, client: { url: uri } });

export const dbKind = isPostgres ? "postgres" : "sqlite";
