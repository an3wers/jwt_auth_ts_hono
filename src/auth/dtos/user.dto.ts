import type { UserRights } from "../constants.js";

export class UserDto {
  id: string;
  email: string;
  isActivated: boolean;
  rights: UserRights[];

  constructor(model: {
    email: string;
    id: string;
    isActivated: boolean;
    rights: UserRights[];
  }) {
    this.email = model.email;
    this.id = model.id;
    this.isActivated = model.isActivated;
    this.rights = model.rights;
  }
}

export class CreateUserDto {
  email: string;
  password: string;
  activationLink: string;
  isActivated: boolean;

  constructor(model: {
    email: string;
    password: string;
    activationLink: string;
    isActivated: boolean;
  }) {
    this.email = model.email;
    this.password = model.password;
    this.isActivated = model.isActivated ?? false;
    this.activationLink = model.activationLink;
  }
}

export class UpdateUserDto {
  id: string;
  email?: string;
  isActivated?: boolean;
  rights?: UserRights[];
  oldPassword?: string;
  newPassword?: string;

  constructor(model: {
    id: string;
    email?: string;
    isActivated?: boolean;
    rights?: UserRights[];
    oldPassword?: string;
    newPassword?: string;
  }) {
    this.email = model.email;
    this.isActivated = model.isActivated;
    this.rights = model.rights;
    this.id = model.id;
    this.oldPassword = model.oldPassword;
    this.newPassword = model.newPassword;
  }
}
