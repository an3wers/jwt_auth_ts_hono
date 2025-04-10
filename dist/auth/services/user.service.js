import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { UserDto } from "../dtos/user.dto.js";
import { isDev } from "../../utils/is-dev.js";
export class UserService {
    userRepository;
    tokenService;
    mailService;
    constructor(userRepository, tokenService, mailService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.mailService = mailService;
    }
    async register(email, password) {
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
    async login(email, password) {
        const user = await this.userRepository.findOneByEmail(email);
        // TODO: add errors handler
        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            throw new Error("Invalid data");
        }
        const tokens = await this.tokenService.generateTokens({
            id: user.id,
            isActivated: user.isActivated,
        });
        await this.tokenService.saveToken(tokens.refreshToken, user.id);
        return {
            ...tokens,
            user: new UserDto({
                email: user.email,
                id: user.id,
                isActivated: user.isActivated,
            }),
        };
    }
    async logout(refreshToken) {
        await this.tokenService.removeToken(refreshToken);
    }
    async getMe(userId) {
        const user = await this.userRepository.findOneById(userId);
        return user;
    }
    async getUsers() {
        const users = await this.userRepository.findAll();
        return users;
    }
    async refresh(refreshToken) {
        const payload = await this.tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await this.tokenService.findToken(refreshToken);
        if (!payload || !tokenFromDB) {
            throw new Error("Unauthorized");
        }
        const user = await this.userRepository.findOneById(payload.sub);
        if (!user) {
            throw new Error("User not found");
        }
        const newTokens = await this.tokenService.generateTokens({
            id: user.id,
            isActivated: user.isActivated,
        });
        await this.tokenService.saveToken(newTokens.refreshToken, user.id);
        // remove old refresh token from db
        await this.tokenService.removeToken(refreshToken);
        return newTokens;
    }
}
//# sourceMappingURL=user.service.js.map