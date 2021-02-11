import * as WebSocket from 'ws'
import * as Y from 'yjs'
import { yDocToProsemirrorJSON } from 'y-prosemirror'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { DocUpdateValue } from '../values/doc'

export const docMonitor = new Map<string, { updatedBy: number[] }>()
export const restoreMonitor = new Map<string, { userId: number; revisionId: number }>()
export const locks = new Map<string, WebSocket[]>()

export const clearMonitoring = (docName: string) => {
  console.log('clearMonitoring', docName) // tslint:disable-line
  docMonitor.delete(docName)
  restoreMonitor.delete(docName)
}

export const lock = (docName: string) => {
  console.log(`lockDoc`, docName) // tslint:disable-line
  locks.set(docName, [])
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

  if (docMonitor.get(docName).updatedBy.includes(userId) === false) {
    docMonitor.get(docName).updatedBy.push(userId)
  }
}

export const onRestore = (docName: string, userId: number, revisionId: number) => {
  console.log('onRestore ', docName, 'user id', userId, 'revisionId', revisionId) // tslint:disable-line
  restoreMonitor.set(docName, { userId, revisionId })
}

export const save = async (docName: string, userId: number, ydoc: Y.Doc) => {
  const docId = Number(docName.split('_').pop())
  console.log('saveState for', docName, 'user id', userId) // tslint:disable-line

  if (docMonitor.get(docName).updatedBy.includes(userId) === false) {
    console.log('user not updated dcument') // tslint:disable-line
    return
  }

  docMonitor.get(docName).updatedBy.filter((value) => value !== userId)

  const data = DocUpdateValue.fromObject({
    content: yDocToProsemirrorJSON(ydoc),
    contentState: Array.from(Y.encodeStateAsUpdate(ydoc)),
  })

  console.log('saving state') // tslint:disable-line

  await ServiceFactory.getInstance()
    .getDocService()
    .update(data, docId, userId)
}

export const restore = async (revisionId: number, userId: number) => {
  console.log('restoreDoc', revisionId, userId) // tslint:disable-line

  await ServiceFactory.getInstance()
    .getDocService()
    .restoreRevision(revisionId, userId)
}

export const persistence = {
  bindState: async (docName: string, ydoc: Y.Doc): Promise<void> => {
    console.log('bindState for', docName) // tslint:disable-line

    docMonitor.set(docName, { updatedBy: [] })

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