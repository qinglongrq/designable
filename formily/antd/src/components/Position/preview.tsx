import React from 'react'
import { Input } from '@formily/antd-v5'
import { createBehavior, createResource } from '@pind/designable-core'
import { DnFC } from '@pind/designable-react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

// 创建独立的Position组件
const PositionComponent: React.FC<any> = (props) => {
  return (
    <Input
      {...props}
      placeholder="请输入职位名称"
      maxLength={50}
      showCount
      style={{ 
        ...props.style 
      }}
    />
  )
}

export const Position: DnFC<React.ComponentProps<typeof Input>> = PositionComponent

Position.Behavior = createBehavior({
  name: 'Position',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Position',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Input),
  },
  designerLocales: AllLocales.Position,
})

Position.Resource = createResource('Business', {
  icon: 'InputSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        name: 'position',
        type: 'string',
        title: '职位',
        'x-decorator': 'FormItem',
        'x-component': 'Position',
      },
    },
  ],
})
