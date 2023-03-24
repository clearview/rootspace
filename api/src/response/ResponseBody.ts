export class ResponseBody {
  data: object | object[] | string

  constructor(data: object | object[] | string) {
    this.data = data
  }

  with(attribute: string, value: object | object[] | string) {
    this[attribute] = value
    return this
  }
}
