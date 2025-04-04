import { DatabaseConnection } from "../../database/connection.js";

export class TokenRepository {
  async saveToken(token: string, userId: string): Promise<void> {
    const query = "INSERT INTO tokens (token, user_id) VALUES ($1, $2)";

    await DatabaseConnection.getPool().query(query, [token, userId]);
  }

  async removeToken(token: string): Promise<void> {
    const query = "DELETE FROM tokens WHERE token = $1";

    await DatabaseConnection.getPool().query(query, [token]);
  }

  async findToken(token: string): Promise<string | null> {
    const query = "SELECT token FROM tokens WHERE token = $1";

    const { rows } = await DatabaseConnection.getPool().query(query, [token]);

    if (rows.length === 0) return null;

    return rows[0].token;
  }
}
