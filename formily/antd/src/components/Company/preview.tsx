import React from 'react'
import { Input } from '@formily/antd-v5'
import { createBehavior, createResource } from '@pind/designable-core'
import { DnFC } from '@pind/designable-react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

// 创建独立的Company组件
const CompanyComponent: React.FC<any> = (props) => {
  return (
    <Input
      {...props}
      placeholder="请输入您所在的公司名称"
      maxLength={100}
      showCount
      style={{ 
        ...props.style 
      }}
    />
  )
}

export const Company: DnFC<React.ComponentProps<typeof Input>> = CompanyComponent

Company.Behavior = createBehavior({
  name: 'Company',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Company',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Input.TextArea),
  },
  designerLocales: AllLocales.Company,
})

Company.Resource = createResource('Business', {
  icon: 'InputSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        name: 'company',
        type: 'string',
        title: '公司',
        'x-decorator': 'FormItem',
        'x-component': 'Company',
      },
    },
  ],
})
