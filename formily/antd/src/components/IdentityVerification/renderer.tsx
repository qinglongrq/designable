import React, { useState, useCallback, useEffect } from 'react'
import { Input, message, Form } from 'antd'
import {
  UserOutlined,
  IdcardOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { apiVerifyIdentity, IdentityVerificationRequest } from '../../request'

// 调试日志函数，绕过 linter 规则
const debugLog = (...args: any[]) => {
  // eslint-disable-next-line no-console
  console.log('[实名认证]', ...args)
}

// 实名认证接口调用（现在使用真实的API服务）

// 渲染态组件 - 用于预览和运行时
export const IdentityVerificationRenderer: React.FC<{
  title?: string
  description?: string
  style?: React.CSSProperties
  value?: any
  onChange?: (value: any) => void
}> = ({ title, description, style, value, onChange }) => {
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [verificationData, setVerificationData] = useState<{
    name: string
    idCard: string
  } | null>(null)

  // 内部状态管理
  const [name, setName] = useState(value?.name || '')
  const [idCard, setIdCard] = useState(value?.idCard || '')

  // 记录上次验证失败时的字段值，用于检测变化
  const [lastFailedValues, setLastFailedValues] = useState<{
    name: string
    idCard: string
  } | null>(null)

  // 当外部value变化时，同步到内部状态和验证状态
  useEffect(() => {
    debugLog('外部value变化，同步数据:', value)
    
    if (value && typeof value === 'object') {
      // 同步基本字段
      setName(value.name || '')
      setIdCard(value.idCard || '')
      
      // 同步验证状态
      if (value.verified === true) {
        setVerified(true)
        setVerificationData({
          name: value.name || '',
          idCard: value.idCard || ''
        })
        debugLog('回显验证成功状态:', { name: value.name, idCard: value.idCard })
      } else if (value.verified === false) {
        setVerified(false)
        setVerificationData(null)
        debugLog('回显验证失败状态')
      }
      
      // 如果有错误状态，也要回显
      if (value.error === true) {
        setLastFailedValues({
          name: value.name || '',
          idCard: value.idCard || ''
        })
        debugLog('回显错误状态')
      }
    } else if (!value) {
      // 如果外部传入空值，重置所有状态
      setName('')
      setIdCard('')
      setVerified(false)
      setVerificationData(null)
      setLastFailedValues(null)
      debugLog('重置所有状态')
    }
  }, [value])

  // 移除了会导致无限循环的 useEffect
  // 现在直接在输入框的 onChange 中通知外部

  // 自动验证函数
  const handleAutoVerify = useCallback(
    async (nameValue: string, idCardValue: string) => {
      if (loading || verified) return

      setLoading(true)
      debugLog('触发自动验证:', { nameValue, idCardValue })

          try {
      const params: IdentityVerificationRequest = {
        name: nameValue,
        idCard: idCardValue
      }
      const result = await apiVerifyIdentity(params)
      debugLog('API验证结果:', result)

        if (result.success) {
          setVerified(true)
          setVerificationData({ name: nameValue, idCard: idCardValue })
          message.success('实名认证验证成功！')

                  // 验证成功后，通知外部表单
        if (onChange) {
          const successValue = { 
            name: nameValue, 
            idCard: idCardValue, 
            verified: true,
            verificationData: { name: nameValue, idCard: idCardValue }
          }
          debugLog('验证成功，通知外部表单:', successValue)
          onChange(successValue)
        }
        } else {
          message.error(result.message)
          // 验证失败时重置状态，允许重新输入
          setVerified(false)
          setVerificationData(null)
          setLastFailedValues({ name: nameValue, idCard: idCardValue }) // 记录失败时的字段值

                  // 验证失败后，通知外部表单
        if (onChange) {
          const failValue = { 
            name: nameValue, 
            idCard: idCardValue, 
            verified: false,
            error: false,
            errorMessage: result.message
          }
          debugLog('验证失败，通知外部表单:', failValue)
          onChange(failValue)
        }
        }
      } catch (error) {
        debugLog('验证出错:', error)
        message.error('验证过程中发生错误，请重试')
        setVerified(false)
        setVerificationData(null)
        setLastFailedValues({ name: nameValue, idCard: idCardValue }) // 记录失败时的字段值

        // 出错后，通知外部表单
        if (onChange) {
          const errorValue = {
            name: nameValue,
            idCard: idCardValue,
            verified: false,
            error: true,
            errorMessage: '验证过程中发生错误，请重试'
          }
          debugLog('验证出错，通知外部表单:', errorValue)
          onChange(errorValue)
        }
      } finally {
        setLoading(false)
      }
    },
    [loading, verified, onChange]
  )

  // 监听字段值变化并触发验证
  useEffect(() => {
    debugLog('字段值变化:', {
      name,
      idCard,
      loading,
      verified,
      lastFailedValues,
    })

    if (name && idCard && !loading && !verified) {
      // 如果之前验证失败，检查字段值是否有变化
      if (lastFailedValues) {
        const hasNameChanged = name !== lastFailedValues.name
        const hasIdCardChanged = idCard !== lastFailedValues.idCard

        if (!hasNameChanged && !hasIdCardChanged) {
          debugLog('字段值未变化，跳过重新验证')
          return
        }

        debugLog('检测到字段变化:', {
          hasNameChanged,
          hasIdCardChanged,
          oldValues: lastFailedValues,
          newValues: { name, idCard },
        })
      }

      debugLog('开始检查校验状态...')

      // 手动进行简单校验
      const nameValid =
        name &&
        name.replace(/\s/g, '').length >= 2 &&
        /^[\u4e00-\u9fa5]+$/.test(name.replace(/\s/g, ''))
      const idCardValid =
        idCard && /^([0-9]{15}|[0-9]{17}[0-9Xx])$/.test(idCard)

      if (nameValid && idCardValid) {
        debugLog('校验通过，准备触发实名认证:', { name, idCard })
        handleAutoVerify(name, idCard)
      } else {
        debugLog('校验失败:', { nameValid, idCardValid, name, idCard })
      }
    }
  }, [name, idCard, loading, verified, lastFailedValues, handleAutoVerify])

  return (
    <div
      style={{
        padding: '20px',
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        backgroundColor: '#fafafa',
        margin: '0 auto',
        ...(style || {}),
      }}
    >
      <div
        style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 'bold' }}
      >
        {title || ''}
        <div style={{ fontSize: '12px', color: '#999', fontWeight: 'normal' }}>
          {description || ''}
        </div>
        {verified && (
          <div
            style={{
              fontSize: '12px',
              color: '#52c41a',
              fontWeight: 'normal',
              marginTop: '4px',
            }}
          >
            <CheckCircleOutlined style={{ marginRight: '4px' }} />
            验证状态: 已验证
          </div>
        )}
      </div>

      {/* 使用Form.Item包装输入框，实现校验和提示 */}
      <Form layout="vertical" style={{ width: '100%' }}>
        <Form.Item
          label=""
          name="name"
          rules={[
            { required: true, message: '请输入真实姓名' },
            { min: 2, message: '姓名至少需要2个字符' },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve()
                const cleanName = value.replace(/\s/g, '')
                if (cleanName.length < 2) {
                  return Promise.reject(new Error('姓名至少需要2个字符'))
                }
                if (!/^[\u4e00-\u9fa5]+$/.test(cleanName)) {
                  return Promise.reject(new Error('姓名只能包含中文字符'))
                }
                return Promise.resolve()
              },
            },
          ]}
          style={{ marginBottom: '16px' }}
        >
          <Input
            placeholder=""
            value={name}
            onChange={(e) => {
              const newValue = e.target.value
              setName(newValue)
              if (onChange) {
                const currentValue = { 
                  name: newValue, 
                  idCard,
                  verified,
                  ...(verificationData && { verificationData })
                }
                debugLog('姓名输入变化，通知外部:', currentValue)
                onChange(currentValue)
              }
            }}
            disabled={verified}
            prefix={<UserOutlined />}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label=""
          name="idCard"
          rules={[
            { required: true, message: '请输入身份证号码' },
            {
              pattern: /^([0-9]{15}|[0-9]{17}[0-9Xx])$/,
              message: '身份证号码格式不正确，应为15位或18位',
            },
          ]}
          style={{ marginBottom: '16px' }}
        >
          <Input
            placeholder="请输入身份证号码"
            value={idCard}
            onChange={(e) => {
              const newValue = e.target.value
              setIdCard(newValue)
              if (onChange) {
                const currentValue = { 
                  name, 
                  idCard: newValue,
                  verified,
                  ...(verificationData && { verificationData })
                }
                debugLog('身份证输入变化，通知外部:', currentValue)
                onChange(currentValue)
              }
            }}
            disabled={verified}
            prefix={<IdcardOutlined />}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>

      {loading && (
        <div
          style={{
            textAlign: 'center',
            padding: '8px',
            backgroundColor: '#e6f7ff',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#1890ff',
          }}
        >
          正在验证身份信息...
        </div>
      )}

      {verified && verificationData && (
        <div
          style={{
            textAlign: 'center',
            padding: '8px',
            backgroundColor: '#f6ffed',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#52c41a',
          }}
        >
          <CheckCircleOutlined style={{ marginRight: '4px' }} />
          验证成功！姓名: {verificationData.name}，身份证:{' '}
          {verificationData.idCard}
        </div>
      )}
    </div>
  )
}
