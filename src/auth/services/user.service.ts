import type { UserRepository } from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { UpdateUserDto, UserDto } from "../dtos/user.dto.js";
import type { TokenService } from "./token.service.js";
import type { MailService } from "./mail.service.js";
import { isDev } from "../../utils/is-dev.js";
import { HTTPException } from "hono/http-exception";
import type { User } from "../model/user.model.js";

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService
  ) {}

  async register(
    email: string,
    password: string
  ): Promise<{ user: UserDto; refreshToken: string; accessToken: string }> {
    const condidate = await this.userRepository.findOneByEmail(email);

    if (condidate) {
      throw new HTTPException(400, {
        message: `User with email ${email} already exist`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const _activationLink = nanoid();

    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      activationLink: _activationLink,
      isActivated: isDev() ? true : false,
    });

    // commented for dev
    // await this.mailService.sendActivationMail(email, _activationLink);

    const { passwordHash, activationLink, ...userProps } = user;
    const userDto = new UserDto(userProps);

    const tokens = await this.tokenService.generateTokens(userDto);
    await this.tokenService.saveToken(tokens.refreshToken, userDto.id);

    return { ...tokens, user: userDto };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: UserDto; refreshToken: string; accessToken: string }> {
    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      throw new HTTPException(404, {
        message: `User with email ${email} not found`,
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw new HTTPException(400, {
        message: "Invalid data",
      });
    }

    const tokens = await this.tokenService.generateTokens({
      id: user.id,
      isActivated: user.isActivated,
      rights: user.rights,
    });

    await this.tokenService.saveToken(tokens.refreshToken, user.id);

    return {
      ...tokens,
      user: new UserDto({
        email: user.email,
        id: user.id,
        isActivated: user.isActivated,
        rights: user.rights,
      }),
    };
  }

  async logout(refreshToken: string) {
    await this.tokenService.removeToken(refreshToken);
  }

  getMe(userId: string): Promise<User | null> {
    return this.userRepository.findOneById(userId);
  }

  getUsers(): Promise<User[] | null> {
    return this.userRepository.findAll();
  }

  updateUser(user: UpdateUserDto): Promise<User | null> {
    const candidate = this.userRepository.findOneById(user.id);

    if (!candidate) {
      throw new HTTPException(404, {
        message: "Not found",
      });
    }

    return this.userRepository.update(user);
  }

  async refresh(refreshToken: string) {
    const payload = await this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await this.tokenService.findToken(refreshToken);

    if (!payload || !tokenFromDB) {
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }

    const user = await this.userRepository.findOneById(payload.sub);

    if (!user) {
      throw new HTTPException(404, {
        message: "Not found",
      });
    }

    const newTokens = await this.tokenService.generateTokens({
      id: user.id,
      isActivated: user.isActivated,
      rights: user.rights,
    });

    await this.tokenService.saveToken(newTokens.refreshToken, user.id);

    // remove old refresh token from db
    await this.tokenService.removeToken(refreshToken);

    return newTokens;
  }
}
