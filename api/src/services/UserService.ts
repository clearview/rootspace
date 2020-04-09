import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";

export class UserService {
  getByEmail = (email: string) => {
    return this.getUserRepository().getByEmail(email);
  };

  private getUserRepository = () => {
    return getCustomRepository(UserRepository);
  };
}
