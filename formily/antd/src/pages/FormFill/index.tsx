import React, { useState, useCallback } from 'react'
import { 
  Button, 
  Upload, 
  message, 
  Typography, 
  Space, 
  Divider, 
  Spin,
  Result
} from 'antd'
import { 
  UploadOutlined, 
  FormOutlined, 
  SendOutlined,
  ReloadOutlined 
} from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { createForm } from '@formily/core'
import { FormProvider, FormConsumer, createSchemaField } from '@formily/react'
import * as ANTD from '@formily/antd-v5'
import { Card, Slider, Rate } from 'antd'
import { IdentityVerification } from '../../components/IdentityVerification'
import { addForm } from '../../model/form'
import './styles.less'

const { Title, Paragraph } = Typography

// Text组件
const Text: React.FC<{
  value?: string
  content?: string
  mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p'
}> = ({ value, mode, content, ...props }) => {
  const tagName = mode === 'normal' || !mode ? 'div' : mode
  return React.createElement(tagName, props, value || content)
}

// 创建 SchemaField 组件，只使用基本组件
const SchemaField = createSchemaField({
  components: {
    // 表单组件
    Form: ANTD.Form,
    FormItem: ANTD.FormItem,
    FormLayout: ANTD.FormLayout,
    FormGrid: ANTD.FormGrid,
    FormTab: ANTD.FormTab,
    FormCollapse: ANTD.FormCollapse,
    
    // 输入组件
    Input: ANTD.Input,
    Password: ANTD.Password,
    NumberPicker: ANTD.NumberPicker,
    Select: ANTD.Select,
    TreeSelect: ANTD.TreeSelect,
    Cascader: ANTD.Cascader,
    DatePicker: ANTD.DatePicker,
    TimePicker: ANTD.TimePicker,
    Upload: ANTD.Upload,
    Switch: ANTD.Switch,
    Radio: ANTD.Radio,
    Checkbox: ANTD.Checkbox,
    Transfer: ANTD.Transfer,
    
    // 数组组件
    ArrayTable: ANTD.ArrayTable,
    ArrayCards: ANTD.ArrayCards,
    
    // 其他组件
    Card,
    Slider,
    Rate,
    Text,
    IdentityVerification,
  },
})

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FormFillPageProps {}

const FormFillPage: React.FC<FormFillPageProps> = () => {
  const [jsonConfig, setJsonConfig] = useState<any>(null)
  const [transformedData, setTransformedData] = useState<any>(null)
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<any>(null)

  // 处理JSON配置文件上传
  const handleConfigUpload: UploadProps['customRequest'] = async (options) => {
    const { file } = options
    setLoading(true)
    
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string)
          console.log('读取的JSON配置:', config)
          setJsonConfig(config)
          
          // 如果配置中直接包含schema，则使用它
          // 否则假设整个配置就是schema
          const schemaData = config.schema || config
          console.log('Schema数据:', schemaData)
          
          // 设置转换后的数据
          setTransformedData({
            form: config.form || {},
            schema: schemaData
          })
          
          // 创建表单实例
          const newForm = createForm()
          setForm(newForm)
          
          message.success('表单配置加载成功！')
          setSubmitResult(null) // 重置提交结果
        } catch (error) {
          console.error('JSON解析失败:', error)
          message.error('JSON配置文件格式错误，请检查文件内容')
        } finally {
          setLoading(false)
        }
      }
      
      reader.onerror = () => {
        message.error('文件读取失败')
        setLoading(false)
      }
      
      reader.readAsText(file as File)
    } catch (error) {
      console.error('文件上传失败:', error)
      message.error('文件上传失败')
      setLoading(false)
    }
  }

  // 处理表单提交
  const handleSubmit = useCallback(async () => {
    if (!form) {
      message.error('请先加载表单配置')
      return
    }

    setSubmitting(true)
    try {
      // 验证表单
      await form.validate()
      const formData = form.values
      console.log('表单数据:', formData)
      
      // 提交到后端
      const result = await addForm({
        schema: jsonConfig,
        data: formData,
        submitTime: new Date().toISOString()
      })
      
      console.log('提交结果:', result)
      setSubmitResult({
        success: true,
        data: result,
        message: '表单提交成功！'
      })
      
      message.success('表单提交成功！')
    } catch (error) {
      console.error('表单提交失败:', error)
      const errorMessage = error instanceof Error ? error.message : '表单提交失败'
      setSubmitResult({
        success: false,
        error: error,
        message: errorMessage
      })
      message.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }, [form, jsonConfig])

  // 重置表单
  const handleReset = useCallback(() => {
    if (form) {
      form.reset()
      setSubmitResult(null)
      message.info('表单已重置')
    }
  }, [form])

  // 清空配置
  const handleClear = useCallback(() => {
    setJsonConfig(null)
    setTransformedData(null)
    setForm(null)
    setSubmitResult(null)
    message.info('已清空表单配置')
  }, [])

  return (
    <div className="form-fill-page">
      <div className="form-fill-header">
        <Title level={2}>
          <FormOutlined /> 表单填写页面
        </Title>
        <Paragraph>
          上传JSON表单配置文件，系统将自动生成对应的表单供您填写和提交。
        </Paragraph>
      </div>

      <Card className="config-upload-card">
        <Title level={4}>1. 加载表单配置</Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Upload
            accept=".json"
            customRequest={handleConfigUpload}
            showUploadList={false}
            disabled={loading}
          >
            <Button 
              icon={<UploadOutlined />} 
              loading={loading}
              size="large"
            >
              {loading ? '正在加载...' : '选择JSON配置文件'}
            </Button>
          </Upload>
          
          {jsonConfig && (
            <div className="config-info">
              <Typography.Text type="success">
                ✓ 配置文件已加载 ({Object.keys(jsonConfig).length} 个配置项)
              </Typography.Text>
              <Button 
                type="link" 
                size="small" 
                onClick={handleClear}
              >
                清空配置
              </Button>
            </div>
          )}
        </Space>
      </Card>

      {transformedData && form && (
        <>
          <Divider />
          
          <Card className="form-content-card">
            <Title level={4}>2. 填写表单</Title>
            
            <Spin spinning={loading}>
              <FormProvider form={form}>
                <ANTD.Form {...transformedData.form} form={form}>
                  <SchemaField schema={transformedData.schema} />
                </ANTD.Form>
                
                <Divider />
                
                <div className="form-actions">
                  <Space>
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      onClick={handleSubmit}
                      loading={submitting}
                      size="large"
                    >
                      提交表单
                    </Button>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={handleReset}
                      disabled={submitting}
                    >
                      重置表单
                    </Button>
                  </Space>
                </div>

                {/* 表单值预览 */}
                <FormConsumer>
                  {() => (
                    <div className="form-debug">
                      <Typography.Title level={5}>表单数据预览：</Typography.Title>
                      <pre>{JSON.stringify(form.values, null, 2)}</pre>
                    </div>
                  )}
                </FormConsumer>
              </FormProvider>
            </Spin>
          </Card>
        </>
      )}

      {/* 提交结果显示 */}
      {submitResult && (
        <>
          <Divider />
          <Card className="result-card">
            <Result
              status={submitResult.success ? "success" : "error"}
              title={submitResult.message}
              subTitle={
                submitResult.success 
                  ? "您的表单数据已成功保存到服务器"
                  : "请检查表单数据或网络连接后重试"
              }
              extra={
                <Space>
                  <Button 
                    type="primary" 
                    onClick={handleClear}
                  >
                    填写新表单
                  </Button>
                  {!submitResult.success && (
                    <Button onClick={handleSubmit}>
                      重新提交
                    </Button>
                  )}
                </Space>
              }
            />
            
            {/* 详细结果信息 */}
            <div className="result-detail">
              <Typography.Title level={5}>
                {submitResult.success ? '提交详情：' : '错误详情：'}
              </Typography.Title>
              <pre>
                {JSON.stringify(
                  submitResult.success ? submitResult.data : submitResult.error, 
                  null, 
                  2
                )}
              </pre>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

export default FormFillPage
