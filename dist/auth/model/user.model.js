export class User {
    id;
    email;
    passwordHash;
    isActivated;
    activationLink;
    constructor(model) {
        this.id = model.id;
        this.email = model.email;
        this.passwordHash = model.passwordHash;
        this.isActivated = model.isActivated;
        this.activationLink = model.activationLink;
    }
}
//# sourceMappingURL=user.model.js.map