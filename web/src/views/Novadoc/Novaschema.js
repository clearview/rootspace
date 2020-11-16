import { Doc } from 'tiptap'

export default class Novaschema extends Doc {
  get schema () {
    return {
      content: 'title block*'
    }
  }
}
