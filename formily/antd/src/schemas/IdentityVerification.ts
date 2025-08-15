import { ISchema } from '@formily/react'

export const IdentityVerification: ISchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    description: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入描述',
      },
    },
    style: {
      type: 'object',
      'x-decorator': 'FormItem',
      'x-component': 'CSSStyle',
    },
  },
}
