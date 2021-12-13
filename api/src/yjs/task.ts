import * as Y from 'yjs'

export default class TaskState {
    private updates = new Map<string, Map<number, { lastSave: number; saved: boolean }>>()

    onUpdate(docName: string, userId: number, ydoc: Y.Doc) {
        console.log('state onUpdate for Task', docName, 'user', userId) // tslint:disable-line

        // if (!this.updates.get(docName)) {
        //     this.updates.set(docName, new Map())
        // }

        // if (!this.updates.get(docName).has(userId)) {
        //     this.updates.get(docName).set(userId, { lastSave: Date.now(), saved: false })
        //     return
        // }

        // this.updates.get(docName).get(userId).saved = true
    }

    onRestore(docName: string, userId: number, revisionId: number, ydoc: Y.Doc) {
        console.log('state onRestore', docName, 'user', userId, 'revisionId', revisionId) // tslint:disable-line
    }

    onClientClose(docName: string, userId: number, ydoc: Y.Doc) {
        console.log('state onClientClose Task', docName, 'user', userId) // tslint:disable-line

        // if (!this.updates.has(docName) || !this.updates.get(docName).has(userId)) {
        //     return
        // }

        // this.updates.get(docName).delete(userId)
    }

    async bindState(docName: string, ydoc: Y.Doc): Promise<void> {
        console.log('bindState for Task', docName) // tslint:disable-line

        // const map = ydoc.getMap(docName)
        ydoc.on('update', (event) => {
            Y.applyUpdate(ydoc, event)
        })
    }

    async writeState(docName: string, ydoc: Y.Doc) {
        console.log('writeState for Task', docName, '(does nothing)') // tslint:disable-line

        // this.updates.delete(docName)
    }
}