import { Engine } from '@pind/designable-core'
import {
  transformToSchema,
  transformToTreeNode,
} from '@pind/designable-formily-transformer'
import { message } from 'antd'
import { addForm } from '../../src/model/form'
export const saveSchema = async (designer: Engine) => {
  localStorage.setItem(
    'formily-schema',
    JSON.stringify(transformToSchema(designer.getCurrentTree()))
  )
  const fields = JSON.stringify(transformToSchema(designer.getCurrentTree()))
  console.log(fields, 'gdahdgadhas')
  await addForm({formName:"测试创建表单",description:"第一个表单",fields})
  message.success('Save Success')
}

export const loadInitialSchema = (designer: Engine) => {
  try {
    designer.setCurrentTree(
      transformToTreeNode(JSON.parse(localStorage.getItem('formily-schema')))
    )
  } catch {}
}
