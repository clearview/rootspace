export const Client = (window as any).Primus
export const PrimusClient = (window as any).Primus

export type PrimusPayload = string | {
  type: string
  [key: string]: any
}

type CallbackFn = (data: PrimusPayload) => void

export default class Primus {
  private client: any

  constructor (token: string) {
    const url = process.env.VUE_APP_API_URL + '?token=' + token

    this.client = new Client(url)
  }

  static connect (token: string) {
    return new Primus(token)
  }

  disconnect () {
    this.client.end()
  }

  on (event: string, callback: CallbackFn) {
    this.client.on(event, callback)
  }

  broadcast (room: string, payload: PrimusPayload) {
    this.client.write({ room, payload })
  }

  join (room: string) {
    this.client.write({ action: 'join', room })
  }

  leave (room: string) {
    this.client.write({ action: 'leave', room })
  }
}
