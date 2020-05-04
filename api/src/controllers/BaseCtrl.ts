import { ResponseContent } from '../response/ResponseContent'

export class BaseCtrl {
  protected responseContent(data: object | object[]) {
    return new ResponseContent(data)
  }
}
