import { ResponseData } from '../response/ResponseData'

export class BaseCtrl {
  protected responseData(data: object | object[]) {
    return new ResponseData(data)
  }
}
