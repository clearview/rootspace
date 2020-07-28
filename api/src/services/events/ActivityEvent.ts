export class ActivityEvent {
  private action: string
  private actorId: number
  private entity: any

  private constructor(action: string) {
    this.action = action
  }

  public static withAction(action: string): ActivityEvent {
    return new ActivityEvent(action)
  }

  fromUser(userId: number): ActivityEvent {
    this.actorId = userId
    return this
  }

  forEntity(entity: any): ActivityEvent {
    // if (typeof entity !== 'Entity') {
    //   throw new Error('ActivityEvent entity is not of Entity type')
    // }

    this.entity = entity
    return this
  }
}