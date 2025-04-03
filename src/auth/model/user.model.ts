export class User {
  id: string;
  email: string;
  passwordHash: string;
  isActivated: boolean;
  activationLink: string;

  constructor(model: {
    id: string;
    email: string;
    passwordHash: string;
    isActivated: boolean;
    activationLink: string;
  }) {
    this.id = model.id;
    this.email = model.email;
    this.passwordHash = model.passwordHash;
    this.isActivated = model.isActivated;
    this.activationLink = model.activationLink;
  }
}
