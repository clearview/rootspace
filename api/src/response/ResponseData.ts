import { isArray } from 'util'

export class ResponseData {
  protected data: object | object[] | string

  constructor(data: object | object[] | string) {
    this.data = this.buildData(data)
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
