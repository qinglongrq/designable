import React from 'react'
import { NumberPicker } from '@formily/antd-v5'
import { createBehavior, createResource } from '@pind/designable-core'
import { DnFC } from '@pind/designable-react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

// 创建独立的Age组件
const AgeComponent: React.FC<any> = (props) => {
  return (
    <NumberPicker
      {...props}
      placeholder="请输入年龄"
      min={1}
      max={120}
      style={{ 
        ...props.style 
      }}
    />
  )
}

export const Age: DnFC<React.ComponentProps<typeof NumberPicker>> = AgeComponent

Age.Behavior = createBehavior({
  name: 'Age',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Age',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Input),
  },
  designerLocales: AllLocales.Age,
})

Age.Resource = createResource('Business', {
  icon: 'NumberPickerSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        name: 'age',
        type: 'number',
        title: '年龄',
        'x-decorator': 'FormItem',
        'x-component': 'Age',
        'x-validator': 'number',
      },
    },
  ],
})
