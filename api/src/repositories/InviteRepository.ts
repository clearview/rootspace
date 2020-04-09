import { EntityRepository, Repository } from "typeorm";
import { Invite } from "../entities/Invite";

@EntityRepository(Invite)
export class InviteRepository extends Repository<Invite> {}
