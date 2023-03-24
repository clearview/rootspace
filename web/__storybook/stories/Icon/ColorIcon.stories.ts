import { Story } from '@storybook/vue'
import IconLibraries from './IconLibraries.vue'

export default {
  title: 'Components/Icon/ColorIcon',
  component: IconLibraries,
  argTypes: {
    type: { table: { disable: true } }
  },
  parameters: {
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true
      }
    },
    viewMode: 'canvas'
  }
}

const Template: Story<{ search: string }> = (_args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IconLibraries },
  template: '<icon-libraries v-bind="$props" type="color" />'
})

export const Libraries = Template.bind({})
Libraries.args = {
  search: undefined
}
