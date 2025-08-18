import React from 'react'
import { Input } from '@formily/antd-v5'
import { createBehavior, createResource } from '@pind/designable-core'
import { DnFC } from '@pind/designable-react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

// 创建独立的WeChat组件
const WeChatComponent: React.FC<any> = (props) => {
  return (
    <Input
      {...props}
      placeholder="请输入微信号"
      maxLength={20}
      showCount
      style={{ 
        ...props.style 
      }}
    />
  )
}

export const WeChat: DnFC<React.ComponentProps<typeof Input>> = WeChatComponent

WeChat.Behavior = createBehavior({
  name: 'WeChat',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'WeChat',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Input),
  },
  designerLocales: AllLocales.WeChat,
})

WeChat.Resource = createResource('Business', {
  icon: 'InputSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        name: 'wechat',
        type: 'string',
        title: '微信号',
        'x-decorator': 'FormItem',
        'x-component': 'WeChat',
        'x-validator':  [
          {
            "pattern": "^[a-zA-Z][a-zA-Z0-9_-]{5,19}$",
            "message": "请输入正确的微信号格式"
          }
        ],
      },
    },
  ],
})
