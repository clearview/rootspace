import { ResponseData } from '../response/ResponseData'

export class BaseCtrl {
  protected responseData(data: object | object[] | string) {
    return new ResponseData(data)
  }
}
