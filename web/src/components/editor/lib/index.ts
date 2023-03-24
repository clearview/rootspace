import { Editor } from 'tiptap'
import {
  Blockquote,
  Bold,
  BulletList,
  Code,
  CodeBlock,
  History,
  Italic,
  Link,
  ListItem,
  OrderedList,
  Placeholder,
  Strike,
  TrailingNode,
  Underline
} from 'tiptap-extensions'

import Paragraph from './Paragraph'
import TextColor from './TextColor'
import BgColor from './BgColor'
import ListMerger from './ListMerger'
import TabEater from './TabEater'

interface CreateEditorParams {
  content: string | Record<string, any>
  editable: boolean
  onUpdate?(context: any): void
}

export function createEditor ({
  content,
  editable,
  onUpdate
}: CreateEditorParams) {
  const extensions = [
    new Paragraph(),
    new TextColor(),
    new BgColor(),
    new Bold(),
    new Blockquote(),
    new Italic(),
    new Underline(),
    new Strike(),
    new Code(),
    new CodeBlock(),
    new History(),
    new BulletList(),
    new ListItem(),
    new OrderedList(),
    new ListMerger(),
    new Link(),
    new TrailingNode({
      node: 'paragraph',
      notAfter: ['paragraph']
    }),
    new Placeholder(),
    new TabEater()
  ]

  return new Editor({
    editable,
    extensions,
    content,
    onUpdate,
    emptyDocument: {
      type: 'doc',
      content
    }
  })
}
