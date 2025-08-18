import React from 'react'
import { Radio } from '@formily/antd-v5'
import { createBehavior, createResource } from '@pind/designable-core'
import { DnFC } from '@pind/designable-react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

const defaultOptions = [
  { label: '中共党员', value: 'party' },
  { label: '共青团员', value: 'league' },
  { label: '群众', value: 'masses' },
  { label: '民主党派', value: 'democratic' },
]

const PoliticalStatusComponent: React.FC<any> = (props) => {
  const options = props.options && Array.isArray(props.options) && props.options.length > 0 ? props.options : defaultOptions
  return <Radio.Group {...props} options={options} />
}

export const PoliticalStatus: DnFC<React.ComponentProps<typeof Radio.Group>> = PoliticalStatusComponent

PoliticalStatus.Behavior = createBehavior({
  name: 'PoliticalStatus',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'PoliticalStatus',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Radio),
  },
  designerLocales: AllLocales.PoliticalStatus,
})

PoliticalStatus.Resource = createResource('Business', {
  icon: 'InputSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        name: 'politicalStatus',
        type: 'string',
        title: '政治面貌',
        'x-decorator': 'FormItem',
        'x-component': 'PoliticalStatus',
      },
    },
  ],
})
