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

export class PostgresDatabase {
  async list(search) {
    if (search) {
      return sql`
        SELECT id, title, description, tempo_preparo AS "tempoPreparo"
        FROM recipes
        WHERE title ILIKE ${`%${search}%`}
        ORDER BY created_at DESC
      `;
    }

    return sql`
      SELECT id, title, description, tempo_preparo AS "tempoPreparo"
      FROM recipes
      ORDER BY created_at DESC
    `;
  }

  async create(recipe) {
    const { title, description, tempoPreparo } = recipe;

    await sql`
      INSERT INTO recipes (title, description, tempo_preparo)
      VALUES (${title}, ${description}, ${tempoPreparo})
    `;
  }

  async update(id, recipe) {
    const { title, description, tempoPreparo } = recipe;

    await sql`
      UPDATE recipes
      SET title = ${title},
          description = ${description},
          tempo_preparo = ${tempoPreparo},
          updated_at = NOW()
      WHERE id = ${id}
    `;
  }

  async delete(id) {
    await sql`DELETE FROM recipes WHERE id = ${id}`;
  }
}
