import React from 'react'
import { Input } from '@formily/antd-v5'
import { createBehavior, createResource } from '@pind/designable-core'
import { DnFC } from '@pind/designable-react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

// 创建独立的Name组件，而不是Input的别名
const PhoneComponent: React.FC<any> = (props) => {
  return (
    <Input
      {...props}
      placeholder="请输入手机号码"
      showCount
      style={{ 
        ...props.style 
      }}
    />
  )
}

export const Phone: DnFC<React.ComponentProps<typeof Input>> = ({ ...props }) => {
  return <PhoneComponent {...props} />
}

Phone.Behavior = createBehavior({
  name: 'Phone',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Phone',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Input),
  },
  designerLocales: AllLocales.Phone,
})

Phone.Resource = createResource('Business', {
  icon: 'InputSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        name: 'phone',
        type: 'string',
        title: '手机号码',
        'x-decorator': 'FormItem',
        'x-component': 'Phone', // 使用唯一的组件名称
        'x-validator': 'phone',
      },
    },
  ],
})
