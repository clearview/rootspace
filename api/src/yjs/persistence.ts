import * as Y from 'yjs'
import { yDocToProsemirrorJSON } from 'y-prosemirror'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { DocUpdateValue } from '../values/doc'

export const docMonitor = new Map<string, { updatedBy: number[] }>()

export const onDocUpdate = (docName: string, userId: number) => {
  console.log(`onYDocUpdate`, docName, 'user id', userId) // tslint:disable-line

  const info = docMonitor.get(docName)

  if (info && !info.updatedBy.includes(userId)) {
    info.updatedBy.push(userId)
  }

  console.log(docMonitor) // tslint:disable-line
}

export const onUserDisconnect = async (docName: string, userId: number, ydoc: Y.Doc) => {
  console.log('yjs onUserDisconnect for', docName, userId) // tslint:disable-line

  if (docMonitor.has(docName) === false) {
    return
  }

  const updatedBy = docMonitor.get(docName).updatedBy

  if (!updatedBy.includes(userId)) {
    return
  }

  docMonitor.get(docName).updatedBy = updatedBy.filter((value) => value !== userId)

  await saveState(docName, userId, ydoc)
}

export const saveState = async (docName: string, userId: number, ydoc: Y.Doc) => {
  console.log('yjs saveState for', docName, 'user id', userId) // tslint:disable-line

  const docId = Number(docName.split('_').pop())

  const data = DocUpdateValue.fromObject({
    content: yDocToProsemirrorJSON(ydoc),
    contentState: Array.from(Y.encodeStateAsUpdate(ydoc)),
  })

  await ServiceFactory.getInstance()
    .getDocService()
    .update(data, docId, userId)
}

export const persistence = {
  bindState: async (docName: string, ydoc: Y.Doc): Promise<void> => {
    console.log('yjs bindState for', docName) // tslint:disable-line

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
    console.log('yjs writeState for', docName) // tslint:disable-line
    docMonitor.delete(docName)
  },
}
