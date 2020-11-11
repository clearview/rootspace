import EditorJS from '@editorjs/editorjs'
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
import Paragraph from '@editorjs/paragraph'
import Checklist from '@editorjs/checklist'

import { createHeading } from './createHeader'

import api from '@/utils/api'
import store from '@/store'
import router from '@/router'

type EditorConfig = Partial<EditorJS.EditorConfig>
type EditorData = EditorJS.OutputData
type EditorBlockData = {
  [key: string]: string | number;
}

function transform (data?: EditorData): EditorData | undefined {
  if (!data) {
    return
  }

  const blocks = data.blocks && data.blocks.map(block => {
    const data = block.data as EditorBlockData

    switch (block.type) {
      default:
        return block

      case 'header':
        return { ...block, type: `h${data.level}` }
    }
  })

  return { ...data, blocks }
}

export function createEditor (config: EditorConfig): EditorJS {
  const defaultConfig: EditorConfig = {
    placeholder: 'Let`s write an awesome document!',
    logLevel: 'ERROR' as EditorJS.LogLevels,
    tools: {
      h1: {
        class: createHeading({ level: 1 }),
        inlineToolbar: ['bold', 'italic', 'marker']
      },
      h2: {
        class: createHeading({ level: 2 }),
        inlineToolbar: ['bold', 'italic', 'marker']
      },
      h3: {
        class: createHeading({ level: 3 }),
        inlineToolbar: ['bold', 'italic', 'marker']
      },
      list: {
        class: List,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+L'
      },
      image: {
        class: Image,
        config: {
          uploader: {
            uploadByFile (file: any) {
              const currentSpaceId = store.getters['space/activeSpace'].id
              const docId = router.currentRoute.params.id

              const formData = new FormData()
              formData.append('file', file)
              formData.append('entityId', docId)
              formData.append('entity', 'Doc')
              formData.append('type', 'docContent')
              formData.append('spaceId', currentSpaceId)

              const uploadFile = api.post('/uploads', formData)
              return uploadFile.then((response) => {
                return {
                  success: 1,
                  file: {
                    url: response.data.data.location
                  }
                }
              })
            },
            uploadByUrl (url: string) {
              const fetchURL = new Promise(
                function (resolve) {
                  const callback = {
                    success: 1,
                    file: {
                      url: url
                    }
                  }

                  resolve(callback)
                }
              )

              return fetchURL.then((response) => {
                return response
              })
            }
          }
        }
      },
      inlineCode: {
        class: InlineCode,
        shortcut: 'CMD+SHIFT+C'
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
      quote: {
        class: Quote,
        inlineToolbar: true,
        config: {
          quotePlaceholder: 'Enter a quote',
          captionPlaceholder: 'Quote\'s author'
        },
        shortcut: 'CMD+SHIFT+O'
      },
      marker: {
        class: Marker,
        shortcut: 'CMD+SHIFT+M'
      },
      code: {
        class: Code,
        shortcut: 'CMD+SHIFT+C'
      },
      linkTool: LinkTool,
      delimiter: Delimiter,
      raw: Raw,
      table: {
        class: Table,
        inlineToolbar: true,
        shortcut: 'CMD+ALT+T'
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
      paragraph: {
        class: Paragraph,
        inlineToolbar: true
      },
      checklist: {
        class: Checklist,
        inlineToolbar: true
      }
    }
  }

  return new EditorJS({
    ...defaultConfig,
    ...config,

    data: transform(config.data)
  })
}
