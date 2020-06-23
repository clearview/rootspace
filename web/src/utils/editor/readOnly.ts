import { OutputData } from '@editorjs/editorjs/types/data-formats/output-data'
// import { BlockToolData } from '@editorjs/editorjs/types/tools'

export default function readOnly (json: OutputData) {
  let articleHTML = ''
  let tableRow = ''
  let checkList = []
  json.blocks.map(obj => {
    switch (obj.type) {
      case 'paragraph':
        articleHTML += `<div class="ce-block">
          <div class="ce-block__content">
            <div class="ce-paragraph cdx-block">
              ${obj.data.text}
            </div>
          </div>
        </div>\n`
        break
      case 'image':
        articleHTML += `<div class="ce-block">
          <div class="ce-block__content">
            <div class="cdx-block image-tool image-tool--empty">
              <div class="image-tool__image">
                <div class="image-tool__image-preloader"></div>
              </div>
              <div class="cdx-input image-tool__caption"></div>
              <div class="cdx-button">
                <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.15 13.628A7.749 7.749 0 0 0 10 17.75a7.74 7.74 0 0 0 6.305-3.242l-2.387-2.127-2.765 2.244-4.389-4.496-3.614 3.5zm-.787-2.303l4.446-4.371 4.52 4.63 2.534-2.057 3.533 2.797c.23-.734.354-1.514.354-2.324a7.75 7.75 0 1 0-15.387 1.325zM10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10z"></path>
                </svg>
                Select an Image
              </div>
            </div>
          </div>
        </div>\n`
        break
      case 'h1':
      case 'h2':
      case 'h3':
        articleHTML += `<div class="ce-block">
          <div class="ce-block__content">
            <h${obj.data.level} class="ce-header">${obj.data.text}</h${obj.data.level}>
          </div>
        </div>\n`
        break
      case 'raw':
        articleHTML += `<div class="ce-block">
          <div class="ce-block__content">
            <textarea class="ce-code__textarea cdx-input" readonly>${obj.data.html}</textarea>
          </div>
        </div>\n`
        break
      case 'code':
        articleHTML += `<div class="ce-block">
          <div class="ce-block__content">
            <div class="cdx-block ce-rawtool">
              <textarea class="ce-rawtool__textarea cdx-input" readonly>${obj.data.code}</textarea>
            </div>
          </div>
        </div>\n`
        break
      case 'list':
        if (obj.data.style === 'unordered') {
          const list = obj.data.items.map(item => {
            return `<li class="cdx-list__item">${item}</li>`
          })
          articleHTML += `<div class="ce-block">
            <div class="ce-block__content">
              <ul class="cdx-block cdx-list cdx-list--unordered">
                ${list.join('')}
              </ul>
              </div>
            </div>\n`
        } else {
          const list = obj.data.items.map(item => {
            return `<li class="cdx-list__item">${item}</li>`
          })
          articleHTML += `<div class="ce-block">
            <div class="ce-block__content">
              <ul class="cdx-block cdx-list cdx-list--ordered">
                ${list.join('')}
              </ul>
              </div>
            </div>\n`
        }
        break
      case 'delimiter':
        articleHTML += `<div class="ce-block">
          <div class="ce-block__content">
            <div class="ce-delimiter cdx-block"></div>
          </div>
        </div>\n`
        break
      case 'linkTool':
        articleHTML += `<div class="ce-block">
          <div class="ce-block__content">
            <div class="cdx-block">
              <div class="link-tool">
                <div class="link-tool__input-holder link-tool__input-holder--error">
                  <div class="cdx-input link-tool__input">${obj.data.link}</div>
                </div>
              </div>
            </div>
          </div>
        </div>\n`
        break
      case 'quote':
        articleHTML += `<div class="ce-block">
          <div class="ce-block__content">
            <blockquote class="cdx-block cdx-quote">
              <div class="cdx-input cdx-quote__text">${obj.data.text}</div>
              <div class="cdx-input cdx-quote__caption">${obj.data.caption}</div>
            </blockquote>
          </div>
        </div>\n`
        break
      case 'warning':
        articleHTML += `<div class="ce-block">
          <div class="ce-block__content">
            <div class="cdx-block cdx-warning">
              <div class="cdx-input cdx-warning__title">${obj.data.title}</div>
              <div class="cdx-input cdx-warning__message">${obj.data.message}</div>
            </div>
          </div>
        </div>\n`
        break
      case 'checklist':
        checkList = obj.data.items.map(item => {
          const checkedClass = (item.checked ? 'cdx-checklist__item--checked' : '')
          return `<div class="cdx-checklist__item ${checkedClass}">
            <span class="cdx-checklist__item-checkbox"></span>
            <div class="cdx-checklist__item-text">${item.text}</div>
          </div>`
        })
        articleHTML += `<div class="ce-block">
          <div class="ce-block__content">
            <div class="cdx-block cdx-checklist">
              ${checkList.join('')}
            </div>
          </div>
        </div>\n`
        break
      case 'table':
        console.log('table')
        for (let row = 0; row < obj.data.content.length; row++) {
          tableRow += '<tr>'
          for (let col = 0; col < obj.data.content[row].length; col++) {
            tableRow += `<td class="tc-table__cell">
              <div class="tc-table__area">
                <div class="tc-table__inp">${obj.data.content[row][col]}</div>
              </div>
            </td>`
          }
          tableRow += '</tr>'
        }
        articleHTML += `<div class="ce-block">
          <div class="ce-block__content">
            <div class="tc-editor cdx-block">
              <div class="tc-table__wrap">
                <table class="tc-table">
                  <tbody>
                    ${tableRow}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>\n`
        break
      default:
        return ''
    }
  })

  return articleHTML
}
