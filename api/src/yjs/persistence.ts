import * as Y from 'yjs'
import { yDocToProsemirrorJSON } from 'y-prosemirror'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { DocUpdateValue } from '../values/doc'

export const docMonitor = new Map<string, { listening: boolean; updatedBy: number[] }>()

export const saveState = async (docName: string, userId: number, ydoc: Y.Doc) => {
  console.log('yjs saveDocState for', docName, userId) // tslint:disable-line

  const docId = Number(docName.split('_').pop())

  const data = DocUpdateValue.fromObject({
    content: yDocToProsemirrorJSON(ydoc),
    contentState: Array.from(Y.encodeStateAsUpdate(ydoc)),
  })

  await ServiceFactory.getInstance()
    .getDocService()
    .update(data, docId, userId)
}

export const onDocUpdate = (docName: string, userId: number) => {
    console.log(`onDocUpdate`, userId) // tslint:disable-line
    console.log(docMonitor)

    const info = docMonitor.get(docName)

    if (info && !info.updatedBy.includes(userId)) {
      info.updatedBy.push(userId)
    }
  }

export const persistence = {
  bindState: async (docName: string, ydoc: Y.Doc): Promise<void> => {
    console.log('yjs bindState for', docName) // tslint:disable-line

    docMonitor.set(docName, { listening: false, updatedBy: [] })

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
