import { EventEmitter } from 'events'
import * as Y from 'yjs'
import { yDocToProsemirrorJSON } from 'y-prosemirror'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { DocUpdateValue } from '../services/content/doc'
import { debounce } from '../utils'

interface StateAction {
  name: string
  lock: boolean
  docName: string
  userId: number
  data: ActionSaveData | ActionRestoreData
}

interface ActionSaveData {
  state: Uint8Array
  json: object
}

interface ActionRestoreData {
  revisionId: number
}

class StateQueue extends EventEmitter {
  private queue = new Map<string, StateAction[]>()
  private running = new Set<string>()
  private locks = new Set<string>()

  enqueue(action: StateAction) {
    console.log('StateQueue enqueue', action.name, action.docName, 'user', action.userId) // tslint:disable-line

    if (this.locks.has(action.docName)) {
      return
    }

    if (this.queue.has(action.docName) === false) {
      this.queue.set(action.docName, [])
    }

    if (action.lock) {
      this.locks.add(action.docName)
    }

    this.queue.get(action.docName).push(action)

    if (this.running.has(action.docName) === false) {
      this.run(action.docName)
    }
  }

  get() {
    return this.queue
  }

  isRunning(docName: string): boolean {
    return this.running.has(docName)
  }

  private async run(docName: string) {
    console.log('StateQueue run, queue', this.queue) // tslint:disable-line

    const action = this.queue.get(docName).shift()

    if (!action) {
      this.running.delete(docName)
      this.locks.delete(docName)
      this.queue.delete(docName)

      this.emit('dequeued', docName)

      return
    }

    this.running.add(docName)

    if (action.name === 'save') {
      const data = action.data as ActionSaveData

      try {
        await save(action.docName, action.userId, data.state, data.json)
      } catch (error) {
        console.log(error) // tslint:disable-line
      } finally {
        this.run(docName)
      }

      return
    }

    if (action.name === 'restore') {
      const data = action.data as ActionRestoreData

      try {
        await restore(action.docName, action.userId, data.revisionId)
      } catch (error) {
        console.log(error) // tslint:disable-line
      } finally {
        this.run(docName)
      }

      return
    }

    this.run(docName)
  }
}

export const queue = new StateQueue()
export const updates = new Map<string, Map<number, { lastSave: number; saved: boolean }>>()

// debouncing enqueueSave so that we do not abuse the enqueue function
const debouncedQueueSave = debounce(({ docName, userId, ydoc }: any) => enqueueSave(docName, userId, ydoc), 2000)

export const onUpdate = (docName: string, userId: number, ydoc: Y.Doc) => {
  // console.log('state onUpdate', docName, 'user', userId) // tslint:disable-line

  if (!updates.get(docName)) {
    updates.set(docName, new Map())
  }

  if (!updates.get(docName).has(userId)) {
    updates.get(docName).set(userId, { lastSave: Date.now(), saved: false })
    return
  }

  updates.get(docName).get(userId).saved = false

  // calling the function which enqueue the save action the document to save the doc in db
  debouncedQueueSave({ docName, userId, ydoc })
}

export const onRestore = (docName: string, userId: number, revisionId: number, ydoc: Y.Doc) => {
  console.log('state onRestore', docName, 'user', userId, 'revisionId', revisionId) // tslint:disable-line

  if (updates.has(docName)) {
    updates.get(docName).forEach((info, updateBy) => {
      if (info.saved === false) {
        enqueueSave(docName, updateBy, ydoc)
      }
    })
  }

  const action: StateAction = {
    name: 'restore',
    lock: true,
    docName,
    userId,
    data: {
      revisionId,
    },
  }

  queue.enqueue(action)
}

export const onClientClose = (docName: string, userId: number, ydoc: Y.Doc) => {
  console.log('state onClientClose', docName, 'user', userId) // tslint:disable-line

  if (!updates.has(docName) || !updates.get(docName).has(userId)) {
    return
  }

  if (updates.get(docName).get(userId).saved === false) {
    enqueueSave(docName, userId, ydoc)
  }

  updates.get(docName).delete(userId)
}

const enqueueSave = (docName: string, userId: number, ydoc: Y.Doc) => {
  const action: StateAction = {
    name: 'save',
    lock: false,
    docName,
    userId,
    data: {
      state: Y.encodeStateAsUpdate(ydoc),
      json: yDocToProsemirrorJSON(ydoc),
    },
  }

  queue.enqueue(action)

  if (updates.get(docName)) {
    updates.get(docName).get(userId).lastSave = Date.now()
    updates.get(docName).get(userId).saved = true
  }
}

export const save = async (docName: string, userId: number, state: Uint8Array, json: object) => {
  console.log('state save', docName, 'user', userId) // tslint:disable-line

  const docId = Number(docName.split('_').pop())

  const data = DocUpdateValue.fromObject({
    contentState: Array.from(state),
    content: json,
  })

  await ServiceFactory.getInstance()
    .getDocService()
    .update(data, docId, userId)

  console.log('state saved', docName, 'user', userId) // tslint:disable-line
}

export const restore = async (docName: string, userId: number, revisionId: number) => {
  console.log('state restore', docName, 'user', userId, 'revisionId', revisionId) // tslint:disable-line

  await ServiceFactory.getInstance()
    .getDocService()
    .restoreRevision(revisionId, userId)

  console.log('state restored', docName, 'user', userId, 'revisionId', revisionId) // tslint:disable-line
}

export const persistence = {
  bindState: async (docName: string, ydoc: Y.Doc): Promise<void> => {
    console.log('bindState for', docName) // tslint:disable-line

    const docId = Number(docName.split('_').pop())

    const doc = await ServiceFactory.getInstance()
      .getDocService()
      .getById(docId)

    if (doc && doc.contentState) {
      const state = new Uint8Array(doc.contentState)
      Y.applyUpdate(ydoc, state)
    }
  },
  writeState: async (docName: string, ydoc: Y.Doc): Promise<void> => {
    console.log('writeState for', docName, '(does nothing)') // tslint:disable-line

    updates.delete(docName)
    console.log('state updates', updates) // tslint:disable-line
  },
}
