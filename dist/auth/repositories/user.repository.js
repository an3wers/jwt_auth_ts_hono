import { DatabaseConnection } from "../../database/connection.js";
import { User } from "../model/user.model.js";
export class UserRepository {
    async findOneById(id) {
        const query = "SELECT * FROM users WHERE id = $1";
        const { rows } = await DatabaseConnection.getPool().query(query, [id]);
        if (rows.length === 0)
            return null;
        const user = new User({
            id: rows[0].user_id,
            email: rows[0].email,
            passwordHash: rows[0].password_hash,
            isActivated: rows[0].is_activated,
            activationLink: rows[0].activation_link,
        });
        return user;
    }
    async findOneByEmail(email) {
        const query = "SELECT * FROM users WHERE email = $1";
        const { rows } = await DatabaseConnection.getPool().query(query, [email]);
        if (rows.length === 0)
            return null;
        const user = new User({
            id: rows[0].user_id,
            email: rows[0].email,
            passwordHash: rows[0].password_hash,
            isActivated: rows[0].is_activated,
            activationLink: rows[0].activation_link,
        });
        return user;
    }
    async findAll() {
        const query = "SELECT * FROM users";
        const { rows } = await DatabaseConnection.getPool().query(query);
        if (rows.length === 0)
            return null;
        const users = rows.map((user) => new User({
            id: user.user_id,
            email: user.email,
            passwordHash: user.password_hash,
            isActivated: user.is_activated,
            activationLink: user.activation_link,
        }));
        return users;
    }
    async create(user) {
        const query = "INSERT INTO users (email, password_hash, activation_link, is_activated) VALUES ($1, $2, $3, $4) RETURNING *";
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
        });
        return createdUser;
    }
}
//# sourceMappingURL=user.repository.js.map