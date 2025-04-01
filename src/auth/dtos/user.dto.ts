export class UserDto {
  email: string;
  id: string;
  isActivated: boolean;

  constructor(model: { email: string; id: string; isActivated: boolean }) {
    this.email = model.email;
    this.id = model.id;
    this.isActivated = model.isActivated;
  }
}
