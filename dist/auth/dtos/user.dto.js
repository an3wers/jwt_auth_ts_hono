export class UserDto {
    id;
    email;
    isActivated;
    constructor(model) {
        this.email = model.email;
        this.id = model.id;
        this.isActivated = model.isActivated;
    }
}
export class CreateUserDto {
    email;
    password;
    activationLink;
    isActivated;
    constructor(model) {
        this.email = model.email;
        this.password = model.password;
        this.isActivated = model.isActivated ?? false;
        this.activationLink = model.activationLink;
    }
}
//# sourceMappingURL=user.dto.js.map