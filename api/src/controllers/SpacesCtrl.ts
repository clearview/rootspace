import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { BaseCtrl } from "./BaseCtrl";
import { SpaceRepository } from "../repositories/SpaceRepository";
import { SpaceService } from "../services/SpaceService";
import { InviteService } from "../services/InviteService";

export class SpacesCtrl extends BaseCtrl {
  private spaceService: SpaceService;
  private inviteService: InviteService;

  constructor() {
    super();
    this.inviteService = new InviteService();
    this.spaceService = new SpaceService();
  }

  public async view(req: Request, res: Response) {
    const space = await getCustomRepository(SpaceRepository).findOne({
      id: Number(req.params.id),
      userId: req.user.id,
    });
    res.send(space);
  }

  public async listAll(req: Request, res: Response) {
    const spaces = await getCustomRepository(SpaceRepository).find({
      userId: req.user.id,
    });
    res.send(spaces);
  }

  public async create(req: Request, res: Response) {
    const data: object = {
      title: req.body.title,
      userId: req.user.id,
    };

    const space = await this.spaceService.create(data);
    res.send(space);

    this.inviteService.createfromArray(req.body.invites, space.id);
  }

  public async update(req: Request, res: Response) {
    const space = await getCustomRepository(SpaceRepository).update(
      {
        id: Number(req.params.id),
        userId: req.user.id,
      },
      req.body
    );
    return this.view(req, res);
  }

  public async delete(req: Request, res: Response) {
    const space = await getCustomRepository(SpaceRepository).delete({
      id: Number(req.params.id),
      userId: req.user.id,
    });
    res.send({ deleted: true });
  }
}
