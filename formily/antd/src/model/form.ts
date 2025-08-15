import apiClient from '../request'
export const addForm = async (data: any) => {
  const res = await apiClient.post('/api/inner/form/add', data)
  return res.data
}
