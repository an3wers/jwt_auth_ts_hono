export class UserDto {
  id: string;
  email: string;
  isActivated: boolean;

  constructor(model: { email: string; id: string; isActivated: boolean }) {
    this.email = model.email;
    this.id = model.id;
    this.isActivated = model.isActivated;
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
