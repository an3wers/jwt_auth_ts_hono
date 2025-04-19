import type { UserRights } from "../constants.js";

export class User {
  id: string;
  email: string;
  passwordHash: string;
  isActivated: boolean;
  activationLink: string;
  rights: UserRights[];

  constructor(model: {
    id: string;
    email: string;
    passwordHash: string;
    isActivated: boolean;
    activationLink: string;
    rights: UserRights[];
  }) {
    this.id = model.id;
    this.email = model.email;
    this.passwordHash = model.passwordHash;
    this.isActivated = model.isActivated;
    this.activationLink = model.activationLink;
    this.rights = model.rights;
  }
}
