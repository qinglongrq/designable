import { IdentityVerification } from '../../components/IdentityVerification' // 直接导入IdentityVerification组件
import { Name } from '../../components/Name' // 直接导入Name组件
import { IdCard } from '../../components/IdCard' // 直接导入IdCard组件
import { Phone } from '../../components/Phone' // 直接导入Phone组件
import { WeChat } from '../../components/WeChat' // 直接导入WeChat组件
import { Email } from '../../components/Email' // 直接导入Email组件
import { Age } from '../../components/Age' // 直接导入Age组件
import { Company } from '../../components/Company' // 直接导入Company组件
import { Position } from '../../components/Position' // 直接导入Position组件
import { Address } from '../../components/Address' // 直接导入Address组件
import { Nation } from '../../components/Nation' // 直接导入Nation组件
import { PoliticalStatus } from '../../components/PoliticalStatus' // 直接导入PoliticalStatus组件
import { Education } from '../../components/Education' // 直接导入Education组件
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
import { SubmitFormList } from '../../model/form'
import { getPresetData, isPresetType, extractPresetType, PRESET_DATA_REGISTRY } from '../../data/presets'
import './styles.less'
import { cascaderOptions } from '../../data/AddressOptions'
const { Title, Paragraph } = Typography

// 处理Schema中的特殊字段配置
const processSchemaFields = (schema: any): void => {
  // 处理address字段的特殊配置
  if (schema.properties && schema.properties.address) {
    schema.properties.address.enum = cascaderOptions
    console.log('已为address字段添加enum配置:', schema.properties.address.enum)
  }
  
  // 后续可以在这里添加更多字段的处理逻辑
  // 例如：
  // if (schema.properties && schema.properties.city) {
  //   schema.properties.city.enum = cityOptions
  // }
  
  // if (schema.properties && schema.properties.department) {
  //   schema.properties.department.enum = departmentOptions
  // }
}

// 简化的Schema处理（预设数据现在在组件渲染时处理）
const processSchema = (schema: any): any => {
  // 处理特殊字段配置
  processSchemaFields(schema)
  
  // 直接返回原始schema，预设数据在组件层面处理
  return schema
}

// Text组件
const Text: React.FC<{
  value?: string
  content?: string
  mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p'
}> = ({ value, mode, content, ...props }) => {
  const tagName = mode === 'normal' || !mode ? 'div' : mode
  return React.createElement(tagName, props, value || content)
}

// 定义选择框类型组件
const SELECTION_COMPONENTS = {
  'Select': 'options',
  'TreeSelect': 'options', 
  'Cascader': 'options',
  'Checkbox.Group': 'options',
  'Radio.Group': 'options'
}

// 创建支持预设数据的组件包装器
const createPresetComponent = (OriginalComponent: any, componentName: string) => {
  return React.forwardRef((props: any, ref: any) => {
    const { schema } = props
    let finalProps = { ...props }
    
    // 只处理选择框类型组件
    if (SELECTION_COMPONENTS[componentName] && schema) {
      // 检查是否存在 x-preset-data 字段
      if (schema['x-preset-data'] && isPresetType(schema['x-preset-data'])) {
        const presetType = extractPresetType(schema['x-preset-data'])
        const presetData = getPresetData(presetType)
        
        if (presetData && presetData.length > 0) {
          const optionsProp = SELECTION_COMPONENTS[componentName]
          finalProps[optionsProp] = presetData
          console.log(`${componentName}组件从x-preset-data加载预设数据 "${presetType}":`, presetData)
        } else {
          console.warn(`${componentName}组件未能获取预设数据 "${presetType}"`)
        }
      }
      // 兼容处理：如果enum字段也是预设类型
      else if (schema.enum && isPresetType(schema.enum)) {
        const presetType = extractPresetType(schema.enum)
        const presetData = getPresetData(presetType)
        
        if (presetData && presetData.length > 0) {
          const optionsProp = SELECTION_COMPONENTS[componentName]
          finalProps[optionsProp] = presetData
          console.log(`${componentName}组件从enum加载预设数据 "${presetType}":`, presetData)
        }
      }
      // 如果已经有options/enum数据，保持不变
      else if (schema.enum && Array.isArray(schema.enum)) {
        const optionsProp = SELECTION_COMPONENTS[componentName]
        finalProps[optionsProp] = schema.enum
        console.log(`${componentName}组件使用Schema中的enum数据:`, schema.enum)
      }
    }
    
    return <OriginalComponent ref={ref} {...finalProps} />
  })
}

// 创建组件注册表，自动为选择框类型组件添加预设数据支持
const createComponentsRegistry = () => {
  const components: any = {
    // 表单组件
    Form: ANTD.Form,
    FormItem: ANTD.FormItem,
    FormLayout: ANTD.FormLayout,
    FormGrid: ANTD.FormGrid,
    FormTab: ANTD.FormTab,
    FormCollapse: ANTD.FormCollapse,
    
    // 基础输入组件（不需要预设数据支持）
    Input: ANTD.Input,
    'Input.TextArea': ANTD.Input.TextArea,
    Password: ANTD.Password,
    NumberPicker: ANTD.NumberPicker,
    DatePicker: ANTD.DatePicker,
    TimePicker: ANTD.TimePicker,
    Upload: ANTD.Upload,
    Switch: ANTD.Switch,
    Transfer: ANTD.Transfer,
    Checkbox: ANTD.Checkbox,
    Radio: ANTD.Radio,
    
    // 自定义组件 - 直接注册
    Name, // 姓名组件
    IdCard, // 身份证组件
    Phone, // 手机号码组件
    WeChat, // 微信号组件
    Email, // 邮箱组件
    Age, // 年龄组件
    Company, // 公司名称组件
    Position, // 职位名称组件
    Address, // 地址组件
    Nation, // 民族组件
    PoliticalStatus, // 政治面貌组件
    Education, // 学历组件
    IdentityVerification, // 身份验证组件
    
    // 数组组件
    ArrayTable: ANTD.ArrayTable,
    ArrayCards: ANTD.ArrayCards,
    
    // 其他组件
    Card,
    Slider,
    Rate,
    Text,
  }
  
  // 为选择框类型组件添加预设数据支持
  Object.keys(SELECTION_COMPONENTS).forEach(componentName => {
    const originalComponent = componentName === 'Checkbox.Group' 
      ? ANTD.Checkbox.Group 
      : componentName === 'Radio.Group' 
        ? ANTD[componentName]
        : ANTD[componentName]
        
    if (originalComponent) {
      components[componentName] = createPresetComponent(originalComponent, componentName)
      console.log(`已为 ${componentName} 组件添加预设数据支持`)
    }
  })
  
  return components
}

// 创建 SchemaField 组件
const SchemaField = createSchemaField({
  components: createComponentsRegistry(),
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

  // 测试预设数据是否正常加载
  React.useEffect(() => {
    console.log('预设数据注册表:', PRESET_DATA_REGISTRY)
    console.log('测试获取性别数据:', getPresetData('gender'))
    console.log('测试isPresetType:', isPresetType('preset:gender'))
    console.log('测试extractPresetType:', extractPresetType('preset:gender'))
  }, [])

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
          const rawSchemaData = config.schema || config
          console.log('原始Schema数据:', rawSchemaData)
          
          // 处理Schema（预设数据在组件渲染时处理）
          const processedSchema = processSchema(rawSchemaData)
          console.log('Schema数据:', processedSchema)
          
          // 设置转换后的数据
          setTransformedData({
            form: config.form || {},
            schema: processedSchema
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
      // const result = await SubmitFormList(formData)
      const result = {
        success: true,
        data: formData,
        message: '表单提交成功！'
      }
      
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
