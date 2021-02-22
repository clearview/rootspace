import httpRequestContext from 'http-request-context'
import { Node } from '../../../../database/entities/Node'
import { entityRoomName } from '../../../../ws'
import { EntityActivity } from '../EntityActivity'
import { ActivityType } from '../types'
import { NodeActions } from './actions'

export class NodeActivity extends EntityActivity<Node> {
  constructor(action: string, node: Node, actorId?: number) {
    super(action, node)

    this._entityAttributes = ['id', 'spaceId', 'parentId', 'title', 'position']
    this._entityUpdateAttributes = ['parentId', 'title', 'position']

    this._actorId = actorId ?? httpRequestContext.get('user').id
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

  static created(node: Node, actorId?: number) {
    const activity = new NodeActivity(NodeActions.Created, node, actorId)
    activity.createContext()

    return activity
  }

  static updated(node: Node, updatedNode: Node, actorId?: number) {
    const activity = new NodeActivity(NodeActions.Updated, node, actorId)
    activity.createUpdateContext(updatedNode)

    return activity
  }

  static archived(node: Node, actorId?: number) {
    const activity = new NodeActivity(NodeActions.Archived, node, actorId)
    activity.createContext()

    return activity
  }

  static restored(node: Node, actorId?: number) {
    const activity = new NodeActivity(NodeActions.Restored, node, actorId)
    activity.createContext()

    return activity
  }

  static deleted(node: Node, actorId?: number) {
    const activity = new NodeActivity(NodeActions.Deleted, node, actorId)
    activity.createContext()

    return activity
  }

  private createContext() {
    this._context = {
      entity: this.filterEntityAttributes(this._entity, this._entityAttributes),
    }
  }

  private createUpdateContext(updatedNode: Node) {
    this._context = {
      updatedAttributes: this.getUpdatedAttributes(this._entity, updatedNode, this._entityUpdateAttributes),
      entity: this.filterEntityAttributes(this._entity, this._entityAttributes),
      updatedEntity: this.filterEntityAttributes(updatedNode, this._entityAttributes),
    }
  }
}
