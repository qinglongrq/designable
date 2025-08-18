import React from 'react'
import { Select } from '@formily/antd-v5'
import { createBehavior, createResource } from '@pind/designable-core'
import { DnFC } from '@pind/designable-react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import { defaultOptions } from '../../data/ethnicityOptions'

const NationComponent: React.FC<any> = (props) => {
  // const options = props.options && Array.isArray(props.options) && props.options.length > 0 ? props.options : defaultOptions
  return <Select {...props} />
}

export const Nation: DnFC<React.ComponentProps<typeof Select>> = NationComponent

Nation.Behavior = createBehavior({
  name: 'Nation',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Nation',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Select),
  },
  designerLocales: AllLocales.Nation,
})

Nation.Resource = createResource('Business', {
  icon: 'InputSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        name: 'nation',
        type: 'string',
        title: '民族',
        'x-decorator': 'FormItem',
        'x-component': 'Nation',
        enum: defaultOptions,
      },
    },
  ],
})
