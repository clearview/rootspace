import { Node } from '../../../../database/entities/Node'
import { entityRoomName } from '../../../../ws'
import { EntityActivity } from '../EntityActivity'
import { ActivityType } from '../types'
import { NodeActions } from './actions'

export class NodeActivity extends EntityActivity<Node> {
  constructor(action: string, node: Node, actorId: number) {
    super(action, node)

    this._entityAttributes = ['id', 'spaceId', 'parentId', 'title', 'position']
    this._entityUpdateAttributes = ['parentId', 'title', 'position']

    this._spaceId = node.spaceId
  }

  getEntityName(): string {
    return 'Node'
  }

  type(): string {
    return ActivityType.Space
  }

  push(): boolean {
    return true
  }

  pushTo(): string {
    return entityRoomName(this._entity.spaceId, this.getEntityName())
  }

  persist(): boolean {
    return false
  }

  handler(): string | null {
    return null
  }

  static created(node: Node, actorId: number) {
    const activity = new NodeActivity(NodeActions.Created, node, actorId)
    activity._buildContext()

    return activity
  }

  static updated(node: Node, updatedNode: Node, actorId: number) {
    const activity = new NodeActivity(NodeActions.Updated, node, actorId)
    activity._buildUpdateContext(updatedNode)

    return activity
  }

  static archived(node: Node, actorId: number) {
    const activity = new NodeActivity(NodeActions.Archived, node, actorId)
    activity._buildContext()

    return activity
  }

  static restored(node: Node, actorId: number) {
    const activity = new NodeActivity(NodeActions.Restored, node, actorId)
    activity._buildContext()

    return activity
  }

  static deleted(node: Node, actorId: number) {
    const activity = new NodeActivity(NodeActions.Deleted, node, actorId)
    activity._buildContext()

    return activity
  }
}
