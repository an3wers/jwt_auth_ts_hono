import type { CreateUserDto, UpdateUserDto } from "../dtos/user.dto.js";
import { DatabaseConnection } from "../../database/connection.js";
import { User } from "../model/user.model.js";
import { userRights } from "../constants.js";

export class UserRepository {
  async findOneById(id: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE user_id = $1";

    const { rows } = await DatabaseConnection.getPool().query(query, [id]);

    if (rows.length === 0) return null;

    const user = new User({
      id: rows[0].user_id,
      email: rows[0].email,
      passwordHash: rows[0].password_hash,
      isActivated: rows[0].is_activated,
      activationLink: rows[0].activation_link,
      rights: [userRights.USER],
    });

    return user;
  }
  async findOneByEmail(email: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE email = $1";

    const { rows } = await DatabaseConnection.getPool().query(query, [email]);

    if (rows.length === 0) return null;

    const user = new User({
      id: rows[0].user_id,
      email: rows[0].email,
      passwordHash: rows[0].password_hash,
      isActivated: rows[0].is_activated,
      activationLink: rows[0].activation_link,
      rights: rows[0].rights,
    });

    return user;
  }
  async findAll(): Promise<User[] | null> {
    const query = "SELECT * FROM users";

    const { rows } = await DatabaseConnection.getPool().query(query);

    if (rows.length === 0) return null;

    const users = rows.map(
      (user: Record<string, any>) =>
        new User({
          id: user.user_id,
          email: user.email,
          passwordHash: user.password_hash,
          isActivated: user.is_activated,
          activationLink: user.activation_link,
          rights: user.rights,
        })
    );

    return users;
  }
  async create(user: CreateUserDto): Promise<User> {
    const query =
      "INSERT INTO users (email, password_hash, activation_link, is_activated) VALUES ($1, $2, $3, $4) RETURNING *";

    const { rows } = await DatabaseConnection.getPool().query(query, [
      user.email,
      user.password,
      user.activationLink,
      user.isActivated,
    ]);

    const createdUser = new User({
      id: rows[0].user_id,
      email: rows[0].email,
      passwordHash: rows[0].password_hash,
      isActivated: rows[0].is_activated,
      activationLink: rows[0].activation_link,
      rights: rows[0].rights,
    });

    return createdUser;
  }

  async update(user: UpdateUserDto): Promise<User> {
    const query =
      "UPDATE users SET email = $1, is_activated = $2, rights = $3 WHERE user_id = $4 RETURNING *";

    const { rows } = await DatabaseConnection.getPool().query(query, [
      user.email,
      user.isActivated,
      `{${user.rights.join(",")}}`,
      user.id,
    ]);

    const updatedUser = new User({
      id: rows[0].user_id,
      email: rows[0].email,
      passwordHash: rows[0].password_hash,
      isActivated: rows[0].is_activated,
      activationLink: rows[0].activation_link,
      rights: rows[0].rights,
    });

    return updatedUser;
  }
}
