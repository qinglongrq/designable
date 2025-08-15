import axios from 'axios'
// API基础配置 - 开发环境使用代理，生产环境使用实际域名
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://10.9.10.70:7033' 
  : '' // 开发环境使用vite代理，不设置baseURL

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: process.env.NODE_ENV === 'development' ? 15000 : 10000, // 开发环境超时时间更长
  headers: {
    'Content-Type': 'application/json',
  },
  // 开发环境允许跨域
  withCredentials: false,
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    // 可以在这里添加认证token等
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 开发环境显示详细请求日志
    if (process.env.NODE_ENV === 'development') {
      console.log('[API请求]', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        data: config.data,
        params: config.params
      })
    }
    
    return config
  },
  (error) => {
    console.error('[API请求错误]', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 开发环境显示详细响应日志
    if (process.env.NODE_ENV === 'development') {
      console.log('[API响应]', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: response.data
      })
    }
    return response
  },
  (error) => {
    // 开发环境显示详细错误日志
    if (process.env.NODE_ENV === 'development') {
      console.error('[API响应错误]', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        message: error.message
      })
    }
    
    // 处理常见错误状态码
    if (error.response?.status === 401) {
      // 未授权，可能需要重新登录
      localStorage.removeItem('auth_token')
      console.warn('用户未授权，请重新登录')
    } else if (error.response?.status === 403) {
      // 禁止访问
      console.error('访问被禁止')
    } else if (error.response?.status >= 500) {
      // 服务器错误
      console.error('服务器内部错误')
    } else if (error.code === 'ECONNABORTED') {
      console.error('请求超时')
    } else if (error.code === 'ERR_NETWORK') {
      console.error('网络连接失败')
    }
    
    return Promise.reject(error)
  }
)

// 实名认证接口类型定义
export interface IdentityVerificationRequest {
  name: string
  idCard: string
}

export interface IdentityVerificationResponse {
  success: boolean
  message: string
  data?: {
    name: string
    idCard: string
    verified: boolean
    verificationTime?: string
    [key: string]: any
  }
}

// 实名认证API调用
export const verifyIdentity = async (
  params: IdentityVerificationRequest
): Promise<IdentityVerificationResponse> => {
  try {
    const response = await apiClient.post<IdentityVerificationResponse>(
      '/identity/verify',
      params
    )
    return response.data
  } catch (error: any) {
    // 处理网络错误或API错误
    if (error.response?.data) {
      // 服务器返回的错误信息
      return {
        success: false,
        message: error.response.data.message || '身份验证失败',
      }
    } else if (error.code === 'ECONNABORTED') {
      // 请求超时
      return {
        success: false,
        message: '请求超时，请检查网络连接',
      }
    } else if (error.code === 'ERR_NETWORK') {
      // 网络错误
      return {
        success: false,
        message: '网络连接失败，请检查网络设置',
      }
    } else {
      // 其他未知错误
      return {
        success: false,
        message: '验证过程中发生未知错误，请重试',
      }
    }
  }
}

// 模拟API调用（用于开发环境）
export const mockVerifyIdentity = async (
  params: IdentityVerificationRequest
): Promise<IdentityVerificationResponse> => {
  console.log('[模拟API] 开始验证实名认证:', params)
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // 模拟验证逻辑
  if (params.name === '张三' && params.idCard === '110101199001011234') {
    return {
      success: true,
      message: '验证成功',
      data: {
        name: params.name,
        idCard: params.idCard,
        verified: true,
        verificationTime: new Date().toISOString(),
      }
    }
  } else if (params.name === '李四' && params.idCard === '110101199001011235') {
    return {
      success: true,
      message: '验证成功',
      data: {
        name: params.name,
        idCard: params.idCard,
        verified: true,
        verificationTime: new Date().toISOString(),
      }
    }
  } else if (!params.name || !params.idCard) {
    return {
      success: false,
      message: '姓名和身份证号码不能为空',
    }
  } else if (params.name.length < 2) {
    return {
      success: false,
      message: '姓名长度不能少于2个字符',
    }
  } else if (!/^([0-9]{15}|[0-9]{17}[0-9Xx])$/.test(params.idCard)) {
    return {
      success: false,
      message: '身份证号码格式不正确',
    }
  } else {
    return {
      success: false,
      message: '身份信息验证失败，请检查输入信息是否正确',
    }
  }
}

// 根据环境选择使用真实API还是模拟API
// 开发环境也使用真实API（通过代理），生产环境使用真实API
export const apiVerifyIdentity = verifyIdentity

// 如果需要使用模拟API进行测试，可以取消注释下面这行
// export const apiVerifyIdentity = mockVerifyIdentity

export default apiClient
