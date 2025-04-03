import { sign } from "hono/jwt";
import { jwtAccessSecret, jwtRefreshSecret } from "../../config.js";
import { TokenRepository } from "../repositories/token.repository.js";

export class TokenService {
  tokenRepository: TokenRepository;

  constructor() {
    this.tokenRepository = new TokenRepository();
  }

  async generateTokens(payload: { id: string; isActivated: boolean }) {
    const refreshToken = await sign(
      {
        sub: payload.id,
        isActivated: payload.isActivated,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days,
        iat: Math.floor(Date.now() / 1000),
      },
      jwtRefreshSecret
    );

    const accessToken = await sign(
      {
        sub: payload.id,
        isActivated: payload.isActivated,
        exp: Math.floor(Date.now() / 1000) + 60 * 15, // 15 minutes,
        iat: Math.floor(Date.now() / 1000),
      },
      jwtAccessSecret
    );

    return { accessToken, refreshToken };
  }

  async saveToken(token: string, userId: string): Promise<void> {
    return await this.tokenRepository.saveToken(token, userId);
  }

  async removeToken(token: string): Promise<void> {
    await this.tokenRepository.removeToken(token);
  }
}
