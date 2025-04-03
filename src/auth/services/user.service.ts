import type { UserRepository } from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { UserDto } from "../dtos/user.dto.js";
import type { TokenService } from "./token.service.js";
import type { MailService } from "./mail.service.js";
import { isDev } from "../../utils/is-dev.js";

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService
  ) {}

  async register(email: string, password: string) {
    const condidate = await this.userRepository.findOneByEmail(email);

    if (condidate) {
      throw new Error(`User with email ${email} already exist`);
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
}
