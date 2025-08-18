import React from 'react'
import { Input } from '@formily/antd-v5'
import { createBehavior, createResource } from '@pind/designable-core'
import { DnFC } from '@pind/designable-react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

// 创建独立的Email组件
const EmailComponent: React.FC<any> = (props) => {
  return (
    <Input
      {...props}
      placeholder="请输入邮箱地址"
      maxLength={50}
      showCount
      style={{ 
        ...props.style 
      }}
    />
  )
}

export const Email: DnFC<React.ComponentProps<typeof Input>> = EmailComponent

Email.Behavior = createBehavior({
  name: 'Email',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Email',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Input),
  },
  designerLocales: AllLocales.Email,
})

Email.Resource = createResource('Business', {
  icon: 'InputSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        name: 'email',
        type: 'string',
        title: '邮箱',
        'x-decorator': 'FormItem',
        'x-component': 'Email',
        'x-validator': 'email',
      },
    },
  ],
})
