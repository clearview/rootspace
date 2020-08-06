import {
  NodeService,
  LinkService,
  DocService,
  EmbedService,
  FollowService,
  TaskBoardService,
  UserService,
  MailService
} from '../'
import { NodeContentMediator } from '../content/NodeContentMediator'

export class ServiceFactory {
  private nodeService: NodeService
  private linkService: LinkService
  private docService: DocService
  private embedService: EmbedService
  private taskBoardService: TaskBoardService
  private followService: FollowService
  private userService: UserService
  private mailService: MailService

  private constructor() {}

  static instance: ServiceFactory
  static getInstance() {
    if (ServiceFactory.instance) {
      return ServiceFactory.instance
    }

    return (ServiceFactory.instance = new ServiceFactory())
  }

  getNodeService() {
    if (!this.nodeService) {
      this.initNodeContentServices()
    }

    return this.nodeService
  }

  getLinkservice() {
    if (!this.linkService) {
      this.initNodeContentServices()
    }

    return this.linkService
  }

  getDocService() {
    if (!this.docService) {
      this.initNodeContentServices()
    }

    return this.docService
  }

  getEmbedService() {
    if (!this.embedService) {
      this.initNodeContentServices()
    }

    return this.embedService
  }

  getFollowService() {
    if (!this.followService) {
      this.initNodeContentServices()
    }

    return this.followService
  }

  getTaskBoardService() {
    if (!this.taskBoardService) {
      this.initNodeContentServices()
    }

    return this.taskBoardService
  }

  getUserService() {
    if (!this.userService) {
      this.initNodeContentServices()
    }

    return this.userService
  }

  getMailService() {
    if (!this.mailService) {
      this.initNodeContentServices()
    }

    return this.mailService
  }

  private initNodeContentServices() {
    this.nodeService = NodeService.getInstance()
    this.linkService = LinkService.getInstance()
    this.docService = DocService.getInstance()
    this.embedService = EmbedService.getInstance()
    this.followService = FollowService.getInstance()
    this.taskBoardService = TaskBoardService.getInstance()
    this.userService = UserService.getInstance()
    this.mailService = new MailService()

    const mediator = new NodeContentMediator(this.nodeService)

    mediator.addContentService(this.linkService)
    mediator.addContentService(this.docService)
    mediator.addContentService(this.embedService)
    mediator.addContentService(this.taskBoardService)
  }
}
