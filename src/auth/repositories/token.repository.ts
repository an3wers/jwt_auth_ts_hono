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
}
