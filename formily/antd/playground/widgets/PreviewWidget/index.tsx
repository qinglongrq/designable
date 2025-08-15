import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/react'
import { TreeNode } from '@pind/designable-core'
import { transformToSchema } from '@pind/designable-formily-transformer'
import React, { useMemo } from 'react'
import * as components from './components'
import { Form } from './components'
import { IdentityVerification } from '../../../src/components/IdentityVerification'
import { Alert } from 'antd'

const { ErrorBoundary } = Alert

const SchemaField = createSchemaField({
  components: {
    ...components,
    IdentityVerification,
  },
})

export interface IPreviewWidgetProps {
  tree: TreeNode
}

export const PreviewWidget: React.FC<IPreviewWidgetProps> = (props) => {
  const form = useMemo(() => createForm(), [])
  const { form: formProps, schema } = transformToSchema(props.tree)
  return (
    <ErrorBoundary>
      <Form {...formProps} form={form}>
        <SchemaField schema={schema} />
      </Form>
    </ErrorBoundary>
  )
}
