import { AsyncComponent } from 'vue'
import DefaultIcon from './DefaultIcon.vue'

type IconCategory = 'mono' | 'color'
type Manifest = Record<IconCategory, Record<string, AsyncComponent>>

const manifest: Manifest = {
  mono: {},
  color: {}
}

const requireComponent = require.context('./', true, /[A-Z]\w+\.(vue)$/, 'lazy')

requireComponent.keys().forEach((filePath: string) => {
  const [, type, filename] = filePath.split('/')

  if (!filename) return

  const name = filename.replace(/\.\w+$/, '')

  manifest[type as IconCategory][name] = () => ({
    component: requireComponent(filePath),
    loading: DefaultIcon,
    error: DefaultIcon
  })
})

export default manifest
