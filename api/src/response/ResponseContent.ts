import { isArray } from 'util'

export class ResponseContent {
  protected data: object | object[]
  protected included: object

  constructor(data: object) {
    this.data = this.createResponseData(data)
  }

  includes(data: object | object, name: string) {
    const include = { [name]: this.createResponseData(data) }

    if (this.included === undefined) {
      this.included = include
      return
    }

    Object.assign(this.included, include)
  }

  protected createResponseData(data: object | object[]): object | object[] {
    if (!isArray(data)) {
      return data
    }

    const reponseData: object[] = []

    data.forEach((value) => {
      reponseData.push(value)
    })

    return reponseData
  }
}
