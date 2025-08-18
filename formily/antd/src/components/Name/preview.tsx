import React from 'react'
import { Input } from '@formily/antd-v5'
import { createBehavior, createResource } from '@pind/designable-core'
import { DnFC } from '@pind/designable-react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

// 创建独立的Name组件，而不是Input的别名
const NameComponent: React.FC<any> = (props) => {
  return (
    <Input
      {...props}
      placeholder="请输入姓名"
      showCount
      style={{ 
        ...props.style 
      }}
    />
  )
}

export const Name: DnFC<React.ComponentProps<typeof Input>> = ({ ...props }) => {
  return <NameComponent {...props} />
}

Name.Behavior = createBehavior({
  name: 'Name',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Name',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Name),
  },
  designerLocales: AllLocales.Name,
})

Name.Resource = createResource('Business', {
  icon: 'InputSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        name: 'name',
        type: 'string',
        title: '姓名',
        'x-decorator': 'FormItem',
        'x-component': 'Name', // 使用唯一的组件名称
      },
    },
  ],
})
