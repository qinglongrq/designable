import React from 'react'
import { createBehavior, createResource } from '@pind/designable-core'
import { DnFC } from '@pind/designable-react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import { IdentityVerificationRenderer } from './renderer'

// 编辑态组件 - 直接使用渲染态组件，这样设计时和预览时保持一致
export const IdentityVerification: DnFC<
  React.ComponentProps<typeof IdentityVerificationRenderer>
> = ({ ...props }) => {
  return (
    <div>
      <IdentityVerificationRenderer {...props} />
    </div>
  )
}

// 定义组件行为
IdentityVerification.Behavior = createBehavior({
  name: 'IdentityVerification',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'IdentityVerification',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.IdentityVerification),
  },
  designerLocales: AllLocales.IdentityVerification,
})

// 定义组件资源 - 修复schema结构，确保name和idCard字段能正确暴露
IdentityVerification.Resource = createResource('Business',{
  icon: 'IdcardOutlined',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: '实名认证',
        'x-decorator': 'FormItem',
        'x-component': 'IdentityVerification',
        'x-component-props': {
          // title: '实名认证',
          // description: '用于验证用户真实身份信息',
        },
        // 关键：定义子字段，让Formily能够收集这些字段的值
        properties: {
          name: {
            type: 'string',
            title: '姓名',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入真实姓名',
            },
            required: false,
          },
          idCard: {
            type: 'string',
            title: '身份证号',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入身份证号码',
            },
            required: false,
            'x-validator': 'idcard',
          },
        },
      },
    },
  ],
})
