import { sign, verify } from "hono/jwt";
import { jwtAccessSecret, jwtRefreshSecret } from "../../config.js";
import { TokenRepository } from "../repositories/token.repository.js";
export class TokenService {
    tokenRepository;
    constructor() {
        this.tokenRepository = new TokenRepository();
    }
    async generateTokens(payload) {
        const refreshToken = await sign({
            sub: payload.id,
            isActivated: payload.isActivated,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days,
            iat: Math.floor(Date.now() / 1000),
        }, jwtRefreshSecret);
        const accessToken = await sign({
            sub: payload.id,
            isActivated: payload.isActivated,
            exp: Math.floor(Date.now() / 1000) + 60 * 15, // 15 minutes,
            iat: Math.floor(Date.now() / 1000),
        }, jwtAccessSecret);
        return { accessToken, refreshToken };
    }
    async saveToken(token, userId) {
        return await this.tokenRepository.saveToken(token, userId);
    }
    async removeToken(token) {
        await this.tokenRepository.removeToken(token);
    }
    async validateAccessToken(token) {
        try {
            return (await verify(token, jwtAccessSecret));
        }
        catch {
            return null;
        }
    }
    static async validateAccessToken(token) {
        try {
            return (await verify(token, jwtAccessSecret));
        }
        catch {
            return null;
        }
    }
    async validateRefreshToken(token) {
        try {
            return (await verify(token, jwtRefreshSecret));
        }
        catch {
            return null;
        }
    }
    static async validateRefreshToken(token) {
        try {
            return (await verify(token, jwtRefreshSecret));
        }
        catch {
            return null;
        }
    }
    async findToken(token) {
        return await this.tokenRepository.findToken(token);
    }
}
//# sourceMappingURL=token.service.js.map