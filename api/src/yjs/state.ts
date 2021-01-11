import * as WebSocket from 'ws'
import * as Y from 'yjs'
import { yDocToProsemirrorJSON } from 'y-prosemirror'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { DocUpdateValue } from '../values/doc'

export const locks = new Map<string, WebSocket[]>()

export const docMonitor = new Map<
  string,
  {
    updatedBy: number[]
    connsCount: number
  }
>()

export const restoreMonitor = new Map<string, { userId: number; revisionId: number }>()

export const clearMonitors = (docName: string) => {
  console.log('clear monitors') // tslint:disable-line
  docMonitor.delete(docName)
  restoreMonitor.delete(docName)
}

export const lock = (docName: string) => {
  console.log(`lockDoc`, docName) // tslint:disable-line
  if (!locks.has(docName)) {
    locks.set(docName, [])
  }
}

export const unlock = (docName: string) => {
  console.log(`unlockDoc`, docName) // tslint:disable-line
  locks.delete(docName)
}

export const isLocked = (docName: string): boolean => {
  return locks.has(docName)
}

export const onUpdate = (docName: string, userId: number) => {
  console.log(`onYDocUpdate`, docName, 'user id', userId) // tslint:disable-line

  const info = docMonitor.get(docName)

  if (info && !info.updatedBy.includes(userId)) {
    info.updatedBy.push(userId)
  }

  console.log(docMonitor) // tslint:disable-line
}

export const onRestore = (docName: string, userId: number, revisionId: number) => {
  console.log('onRestore ', docName, 'user id', userId, 'revisionId', revisionId) // tslint:disable-line
  restoreMonitor.set(docName, { userId, revisionId })
}

export const save = async (docName: string, userId: number, ydoc: Y.Doc) => {
  const docId = Number(docName.split('_').pop())
  console.log('saveState for', docName, 'user id', userId) // tslint:disable-line

  if (docMonitor.has(docName) === false) {
    return
  }

  const updatedBy = docMonitor.get(docName).updatedBy

  if (!docMonitor.get(docName).updatedBy.includes(userId)) {
    console.log('user not updated dcument') // tslint:disable-line
    return
  }

  docMonitor.get(docName).updatedBy = updatedBy.filter((value) => value !== userId)

  console.log('saving state') // tslint:disable-line

  const data = DocUpdateValue.fromObject({
    content: yDocToProsemirrorJSON(ydoc),
    contentState: Array.from(Y.encodeStateAsUpdate(ydoc)),
  })

  await ServiceFactory.getInstance()
    .getDocService()
    .update(data, docId, userId)
}

export const restore = async (docName: string, userId: number, revisionId: number, ydoc: Y.Doc) => {
  console.log('restoreDoc', docName, revisionId, userId) // tslint:disable-line

  if (docMonitor.has(docName)) {
    const updateBy = docMonitor.get(docName).updatedBy

    for (const actorId of updateBy) {
      await save(docName, actorId, ydoc)
    }
  }

  console.log('restoring doc', docName, revisionId, userId) // tslint:disable-line

  await ServiceFactory.getInstance()
    .getDocService()
    .restoreRevision(revisionId, userId)
}

export const persistence = {
  bindState: async (docName: string, ydoc: Y.Doc): Promise<void> => {
    console.log('bindState for', docName) // tslint:disable-line

    docMonitor.set(docName, { updatedBy: [], connsCount: 0 })

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
  },
}
