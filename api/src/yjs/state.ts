import * as Y from 'yjs'
import { yDocToProsemirrorJSON } from 'y-prosemirror'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { DocUpdateValue } from '../values/doc'

const locks = new Map()
const monitor = new Map<string, { updatedBy: number[] }>()

export const lock = (docName: string) => {
  console.log(`lockDoc`, docName) // tslint:disable-line
  if (!locks.has(docName)) {
    locks.set(docName, new Set())
  }
}

export const unlock = (docName: string) => {
  console.log(`unlockDoc`, docName) // tslint:disable-line
  locks.delete((docName))
  console.log(locks)
}

export const isLocked = (docName: string): boolean => {
  return locks.has(docName)
}

export const onUpdate = (docName: string, userId: number) => {
  console.log(`onYDocUpdate`, docName, 'user id', userId) // tslint:disable-line

  const info = monitor.get(docName)

  if (info && !info.updatedBy.includes(userId)) {
    info.updatedBy.push(userId)
  }

  console.log(monitor) // tslint:disable-line
}

export const save = async (docName: string, userId: number, ydoc: Y.Doc) => {
  const docId = Number(docName.split('_').pop())
  console.log('saveState for', docName, 'user id', userId) // tslint:disable-line

  if (monitor.has(docName) === false) {
    return
  }

  const updatedBy = monitor.get(docName).updatedBy

  if (!monitor.get(docName).updatedBy.includes(userId)) {
    console.log('user not updated dcument') // tslint:disable-line
    return
  }

  monitor.get(docName).updatedBy = updatedBy.filter((value) => value !== userId) 

  console.log('saving state') // tslint:disable-line

  const data = DocUpdateValue.fromObject({
    content: yDocToProsemirrorJSON(ydoc),
    contentState: Array.from(Y.encodeStateAsUpdate(ydoc)),
  })

  await ServiceFactory.getInstance()
    .getDocService()
    .update(data, docId, userId)
}

export const restore = async (docName: string, userId:number, revisionId: number, ydoc: Y.Doc) => {
  console.log('restoreDoc', docName, revisionId, userId) // tslint:disable-line

  if(monitor.has(docName)){
    const updateBy = monitor.get(docName).updatedBy
    
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

    monitor.set(docName, { updatedBy: [] })

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
    console.log('writeState for', docName) // tslint:disable-line
    monitor.delete(docName)
  },
}
