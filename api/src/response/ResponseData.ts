import { isArray } from 'util'

export class ResponseData {
  protected data: object | object[] | string
  protected included: object

  constructor(data: object | object[] | string) {
    this.data = this.buildData(data)
  }

  includes(data: object | object, name: string) {
    const include = { [name]: this.buildData(data) }

    if (this.included === undefined) {
      this.included = include
      return
    }

    Object.assign(this.included, include)
  }

  protected buildData(data: object | object[] | string): object | object[] | string {
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
