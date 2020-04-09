import { getCustomRepository } from "typeorm";
import { SpaceRepository } from "../repositories/SpaceRepository";
import { Space } from "../entities/Space";

export class SpaceService {
  create(data: Object): Promise<Space> {
    const space = getCustomRepository(SpaceRepository).create(data);
    return getCustomRepository(SpaceRepository).save(space);
  }
}
