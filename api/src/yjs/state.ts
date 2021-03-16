import * as Y from 'yjs'
import { yDocToProsemirrorJSON } from 'y-prosemirror'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { DocUpdateValue } from '../values/doc'

export const updates = new Map<string, Set<number>>()
export const restores = new Map<string, { userId: number; revisionId: number }>()
export const locks = new Map<string, number>()

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const clearMonitoring = (docName: string) => {
  console.log('clearMonitoring', docName) // tslint:disable-line

  updates.delete(docName)
  restores.delete(docName)
  locks.delete(docName)
}

export const lock = (docName: string) => {
  console.log('state lock', docName) // tslint:disable-line
  const count = locks.get(docName)
  locks.set(docName, count + 1)
}

export const unlock = (docName: string) => {
  console.log('state unlock', docName) // tslint:disable-line
  const count = locks.get(docName)

  if (count === 0) {
    console.log('error unlocking doc, locks count 0')
    return
  }

  locks.set(docName, count - 1)
}

export const onUpdate = (docName: string, userId: number) => {
  updates.get(docName).add(userId)
}

export const onRestore = (docName: string, userId: number, revisionId: number) => {
  console.log('state onRestore ', docName, 'revision', revisionId, 'user', userId) // tslint:disable-line
  restores.set(docName, { userId, revisionId })
}

export const save = async (docName: string, userId: number, ydoc: Y.Doc) => {
  const docId = Number(docName.split('_').pop())
  console.log('state save', docName, 'user', userId) // tslint:disable-line

  if (updates.get(docName).has(userId) === false) {
    console.log('user not updated document', docName, 'user', userId) // tslint:disable-line
    return
  }

  updates.get(docName).delete(userId)

  const data = DocUpdateValue.fromObject({
    content: yDocToProsemirrorJSON(ydoc),
    contentState: Array.from(Y.encodeStateAsUpdate(ydoc)),
  })

  console.log('saving state', docName, 'user', userId) // tslint:disable-line

  await ServiceFactory.getInstance()
    .getDocService()
    .update(data, docId, userId)
}

export const restore = async (docName: string, ydoc: Y.Doc) => {
  const { revisionId, userId } = restores.get(docName)

  console.log('state restore', docName, 'user', userId) // tslint:disable-line

  sleep(2000)

  for (let userId of Array.from(updates.get(docName))) {
    await save(docName, userId, ydoc)
  }

  console.log('restoring', docName, 'revision', revisionId, 'user', userId) // tslint:disable-line

  await ServiceFactory.getInstance()
    .getDocService()
    .restoreRevision(revisionId, userId)
}

export const persistence = {
  bindState: async (docName: string, ydoc: Y.Doc): Promise<void> => {
    console.log('bindState for', docName) // tslint:disable-line

    updates.set(docName, new Set())
    locks.set(docName, 0)

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
    // console.log('writeState for', docName, '(does nothing)') // tslint:disable-line
  },
}
