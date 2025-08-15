import React from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import FormFillPage from './src/pages/FormFill'
import './playground/style.less'

const App = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <FormFillPage />
    </ConfigProvider>
  )
}

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(<App />)
} else {
  console.error('dom root is non-existent')
}
