import "dotenv/config";
import http from "node:http";
import dns from "node:dns";
import { neon } from "@neondatabase/serverless";

dns.setDefaultResultOrder("ipv4first");

const { DATABASE_URL, PORT = 3333 } = process.env;

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL nao definida. Crie um arquivo .env com sua connection string da Neon."
  );
}

const sql = neon(DATABASE_URL);

const requestHandler = async (_req, res) => {
  try {
    const [row] = await sql`SELECT version()`;
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(`Conectado ao Neon.\n${row.version}`);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(`Erro ao conectar no Neon: ${error.message}`);
  }
};

http.createServer(requestHandler).listen(Number(PORT), () => {
  console.log(`Server running at http://localhost:${PORT}`);
});