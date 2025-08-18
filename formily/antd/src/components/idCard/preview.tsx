import React from 'react'
import { Input } from '@formily/antd-v5'
import { createBehavior, createResource } from '@pind/designable-core'
import { DnFC } from '@pind/designable-react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

// 创建独立的IdCard组件
const IdCardComponent: React.FC<any> = (props) => {
  return (
    <Input
      {...props}
      placeholder="请输入身份证号码"
      maxLength={18}
      showCount
      style={{ 
        ...props.style 
      }}
    />
  )
}

export const IdCard: DnFC<React.ComponentProps<typeof Input>> = ({ ...props }) => {
  return <IdCardComponent {...props} />
}

IdCard.Behavior = createBehavior({
  name: 'IdCard',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'IdCard',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.IdCard),
  },
  designerLocales: AllLocales.IdCard,
})

IdCard.Resource = createResource('Business', {
  icon: 'InputSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        name: 'idCard',
        type: 'string',
        title: '身份证号码',
        'x-decorator': 'FormItem',
        'x-component': 'IdCard', // 使用唯一的组件名称
        'x-validator': 'idcard',
      },
    },
  ],
})
