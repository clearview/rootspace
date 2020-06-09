import Editor, { EditorConfig } from '@editorjs/editorjs'
import Paragraph from '@editorjs/paragraph'
import List from '@editorjs/list'
import Image from '@editorjs/image'
import InlineCode from '@editorjs/inline-code'
import Embed from '@editorjs/embed'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import Code from '@editorjs/code'
import LinkTool from '@editorjs/link'
import Delimiter from '@editorjs/delimiter'
import Raw from '@editorjs/raw'
import Table from '@editorjs/table'
import Warning from '@editorjs/warning'
import Checklist from '@editorjs/checklist'

import { createHeading } from './plugins/heading'

export function createEditor (setting: Partial<EditorConfig>): Editor {
  const defaultSetting: Partial<EditorConfig> = {
    placeholder: 'Let`s write an awesome document!',
    tools: {
      paragraph: {
        class: Paragraph,
        inlineToolbar: true
      },
      h1: {
        class: createHeading(1),
        inlineToolbar: ['bold', 'italic'],
        config: {
          placeholder: 'Heading 1'
        }
      },
      h2: {
        class: createHeading(2),
        inlineToolbar: ['bold', 'italic'],
        config: {
          placeholder: 'Heading 2'
        }
      },
      h3: {
        class: createHeading(3),
        inlineToolbar: ['bold', 'italic'],
        config: {
          placeholder: 'Heading 3'
        }
      },
      quote: {
        class: Quote,
        inlineToolbar: true,
        config: {
          quotePlaceholder: 'Enter a quote',
          captionPlaceholder: 'Quote\'s author'
        },
        shortcut: 'CMD+SHIFT+O'
      },
      code: {
        class: Code,
        shortcut: 'CMD+SHIFT+C'
      },
      inlineCode: {
        class: InlineCode,
        shortcut: 'CMD+SHIFT+C'
      },
      marker: {
        class: Marker,
        shortcut: 'CMD+SHIFT+M'
      },
      list: {
        class: List,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+L'
      },
      checklist: {
        class: Checklist,
        inlineToolbar: true
      },
      linkTool: {
        class: LinkTool
      },
      table: {
        class: Table,
        inlineToolbar: true,
        shortcut: 'CMD+ALT+T'
      },
      image: {
        class: Image
      },
      embed: {
        class: Embed,
        config: {
          services: {
            youtube: true,
            codepen: true,
            instagram: true,
            twitter: true
          }
        }
      },
      warning: {
        class: Warning,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+W',
        config: {
          titlePlaceholder: 'Title',
          messagePlaceholder: 'Message'
        }
      },
      raw: {
        class: Raw
      },
      delimiter: {
        class: Delimiter
      }
    }
  }

  return new Editor({
    ...defaultSetting,
    ...setting
  })
}
