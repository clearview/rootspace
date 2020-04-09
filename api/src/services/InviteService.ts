import { getCustomRepository } from "typeorm";
import { InviteRepository } from "../repositories/InviteRepository";
import { Invite } from "../entities/Invite";
import { UserService } from "../services/UserService";
import { MailService } from "./mail/MailService";

export class InviteService {
  private userService: UserService;
  private mailSerivce: MailService;

  constructor() {
    this.userService = new UserService();
    this.mailSerivce = new MailService();
  }

  createfromArray = (invites: Array<string>, spaceId: number) => {
    for (let i = 0; i < invites.length; i++) {
      this.createWithEmail(invites[i], spaceId);
    }
  };

  createWithEmail = async (email: string, spaceId: number) => {
    const user = await this.userService.getByEmail(email);

    let invite = new Invite();
    invite.email = email;
    invite.spaceId = spaceId;
    invite.userId = user ? user.id : null;

    invite = this.getInviteRepository().create(invite);
    invite = await this.getInviteRepository().save(invite);

    this.sendInvitationEmail(invite);
  };

  sendInvitationEmail = async (invite: Invite) => {
    try {
      await this.mailSerivce.sendMail(invite.email, "Root invite", "Invite");
    } catch (error) {
      console.log(error);
    }
  };

  private getInviteRepository(): InviteRepository {
    return getCustomRepository(InviteRepository);
  }
}
