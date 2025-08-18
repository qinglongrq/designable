import React from 'react'
import { Select } from '@formily/antd-v5'
import { createBehavior, createResource } from '@pind/designable-core'
import { DnFC } from '@pind/designable-react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

const defaultOptions = [
  { label: '小学', value: 'primary' },
  { label: '初中', value: 'junior' },
  { label: '高中/中专', value: 'high' },
  { label: '大专', value: 'college' },
  { label: '本科', value: 'bachelor' },
  { label: '硕士', value: 'master' },
  { label: '博士', value: 'doctor' },
]

const EducationComponent: React.FC<any> = (props) => {
  const options = props.options && Array.isArray(props.options) && props.options.length > 0 ? props.options : defaultOptions
  return <Select {...props} options={options} />
}

export const Education: DnFC<React.ComponentProps<typeof Select>> = EducationComponent

Education.Behavior = createBehavior({
  name: 'Education',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Education',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Select),
  },
  designerLocales: AllLocales.Education,
})

Education.Resource = createResource('Business', {
  icon: 'InputSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        name: 'education',
        type: 'string',
        title: '学历',
        'x-decorator': 'FormItem',
        'x-component': 'Education',
        enum: defaultOptions,
      },
    },
  ],
})
