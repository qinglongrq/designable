import React from 'react'
import { Radio } from '@formily/antd-v5'
import { createBehavior, createResource } from '@pind/designable-core'
import { DnFC } from '@pind/designable-react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

const defaultOptions = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' },
  { label: '保密', value: 'secret' },
]

const GenderComponent: React.FC<any> = (props) => {
  const options = props.options && Array.isArray(props.options) && props.options.length > 0 ? props.options : defaultOptions
  return <Radio.Group {...props} options={options} />
}

export const Gender: DnFC<React.ComponentProps<typeof Radio.Group>> = GenderComponent

Gender.Behavior = createBehavior({
  name: 'Gender',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Gender',
  designerProps: {
    // 复用 Radio 的属性面板配置
    propsSchema: createFieldSchema(AllSchemas.Radio),
  },
  designerLocales: AllLocales.Gender,
})

Gender.Resource = createResource('Business', {
  icon: 'InputSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        name: 'gender',
        type: 'string',
        title: '性别',
        'x-decorator': 'FormItem',
        'x-component': 'Gender',
      },
    },
  ],
})
