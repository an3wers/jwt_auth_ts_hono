import { sign, verify } from "hono/jwt";
import { jwtAccessSecret, jwtRefreshSecret } from "../../config.js";
import { TokenRepository } from "../repositories/token.repository.js";
import type { User } from "../model/user.model.js";
import type { UserRights } from "../constants.js";

export class TokenService {
  tokenRepository: TokenRepository;

  constructor() {
    this.tokenRepository = new TokenRepository();
  }

  async generateTokens(payload: {
    id: string;
    isActivated: boolean;
    rights: UserRights[];
  }) {
    const refreshToken = await sign(
      {
        sub: payload.id,
        isActivated: payload.isActivated,
        rights: JSON.stringify(payload.rights),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days,
        iat: Math.floor(Date.now() / 1000),
      },
      jwtRefreshSecret
    );

    const accessToken = await sign(
      {
        sub: payload.id,
        isActivated: payload.isActivated,
        rights: JSON.stringify(payload.rights),
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

  async validateAccessToken(token: string) {
    try {
      return (await verify(token, jwtAccessSecret)) as {
        sub: string;
        isActivated: boolean;
        rights: string;
        iat: number;
        exp: number;
      };
    } catch {
      return null;
    }
  }

  static async validateAccessToken(token: string) {
    try {
      return (await verify(token, jwtAccessSecret)) as {
        sub: string;
        isActivated: boolean;
        rights: string;
        iat: number;
        exp: number;
      };
    } catch {
      return null;
    }
  }

  async validateRefreshToken(token: string) {
    try {
      return (await verify(token, jwtRefreshSecret)) as {
        sub: string;
        isActivated: boolean;
        rights: string;
        iat: number;
        exp: number;
      };
    } catch {
      return null;
    }
  }
  static async validateRefreshToken(token: string) {
    try {
      return (await verify(token, jwtRefreshSecret)) as {
        sub: string;
        isActivated: boolean;
        rights: string;
        iat: number;
        exp: number;
      };
    } catch {
      return null;
    }
  }

  findToken(token: string) {
    return this.tokenRepository.findToken(token);
  }
}
