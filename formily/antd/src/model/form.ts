import apiClient from '../request'
export const addForm = async (data: any) => {
  const res = await apiClient.post('/api/inner/form/add', data)
  return res.data
}
export const SubmitFormList = async (data: any) => {
  const res = await apiClient.post('/api/form/submit',{
    id:'711311094628155392',
    originalAnswer:data
  })
  return res.data
}
