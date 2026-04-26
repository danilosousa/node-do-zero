import "dotenv/config";
import dns from "node:dns";
import { neon } from "@neondatabase/serverless";

dns.setDefaultResultOrder("ipv4first");

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL nao definida. Crie um arquivo .env com sua connection string da Neon."
  );
}

const sql = neon(DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tempo_preparo TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

console.log("Tabela 'recipes' criada com sucesso.");