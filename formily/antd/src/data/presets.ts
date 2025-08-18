// 预设数据类型定义
export interface PresetOption {
  label: string
  value: string
  children?: PresetOption[]
}

export interface PresetDataType {
  id: string
  name: string
  description: string
  data: PresetOption[]
}

// 中国省市县数据（示例数据，实际应该从接口获取完整数据）
const chinaRegions: PresetOption[] = [
  {
    label: '北京市',
    value: 'beijing',
    children: [
      {
        label: '北京市',
        value: 'beijing-city',
        children: [
          { label: '东城区', value: 'dongcheng' },
          { label: '西城区', value: 'xicheng' },
          { label: '朝阳区', value: 'chaoyang' },
          { label: '丰台区', value: 'fengtai' },
          { label: '石景山区', value: 'shijingshan' },
          { label: '海淀区', value: 'haidian' },
        ]
      }
    ]
  },
  {
    label: '上海市',
    value: 'shanghai',
    children: [
      {
        label: '上海市',
        value: 'shanghai-city',
        children: [
          { label: '黄浦区', value: 'huangpu' },
          { label: '徐汇区', value: 'xuhui' },
          { label: '长宁区', value: 'changning' },
          { label: '静安区', value: 'jingan' },
          { label: '普陀区', value: 'putuo' },
          { label: '虹口区', value: 'hongkou' },
        ]
      }
    ]
  },
  {
    label: '广东省',
    value: 'guangdong',
    children: [
      {
        label: '广州市',
        value: 'guangzhou',
        children: [
          { label: '越秀区', value: 'yuexiu' },
          { label: '海珠区', value: 'haizhu' },
          { label: '荔湾区', value: 'liwan' },
          { label: '天河区', value: 'tianhe' },
          { label: '白云区', value: 'baiyun' },
          { label: '黄埔区', value: 'huangpu-gz' },
        ]
      },
      {
        label: '深圳市',
        value: 'shenzhen',
        children: [
          { label: '福田区', value: 'futian' },
          { label: '罗湖区', value: 'luohu' },
          { label: '南山区', value: 'nanshan' },
          { label: '宝安区', value: 'baoan' },
          { label: '龙岗区', value: 'longgang' },
          { label: '盐田区', value: 'yantian' },
        ]
      }
    ]
  }
]

// 性别选项
const genderOptions: PresetOption[] = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' },
  { label: '其他', value: 'other' }
]

// 教育程度
const educationOptions: PresetOption[] = [
  { label: '小学', value: 'primary' },
  { label: '初中', value: 'junior' },
  { label: '高中', value: 'senior' },
  { label: '大专', value: 'college' },
  { label: '本科', value: 'bachelor' },
  { label: '硕士', value: 'master' },
  { label: '博士', value: 'doctor' }
]

// 职业分类
const occupationOptions: PresetOption[] = [
  {
    label: 'IT互联网',
    value: 'it',
    children: [
      { label: '软件开发', value: 'software-dev' },
      { label: '产品经理', value: 'product-manager' },
      { label: 'UI设计师', value: 'ui-designer' },
      { label: '数据分析师', value: 'data-analyst' },
    ]
  },
  {
    label: '金融',
    value: 'finance',
    children: [
      { label: '银行', value: 'bank' },
      { label: '证券', value: 'securities' },
      { label: '保险', value: 'insurance' },
      { label: '投资', value: 'investment' },
    ]
  },
  {
    label: '教育',
    value: 'education',
    children: [
      { label: '幼儿教育', value: 'kindergarten' },
      { label: '中小学教育', value: 'k12' },
      { label: '高等教育', value: 'higher-edu' },
      { label: '职业培训', value: 'vocational' },
    ]
  }
]

// 兴趣爱好
const interestOptions: PresetOption[] = [
  { label: '阅读', value: 'reading' },
  { label: '运动', value: 'sports' },
  { label: '音乐', value: 'music' },
  { label: '旅行', value: 'travel' },
  { label: '摄影', value: 'photography' },
  { label: '绘画', value: 'painting' },
  { label: '编程', value: 'programming' },
  { label: '游戏', value: 'gaming' },
  { label: '美食', value: 'food' },
  { label: '电影', value: 'movies' }
]

// 预设数据注册表
export const PRESET_DATA_REGISTRY: Record<string, PresetDataType> = {
  'china-regions': {
    id: 'china-regions',
    name: '中国省市县',
    description: '中国省市县三级联动数据',
    data: chinaRegions
  },
  'gender': {
    id: 'gender',
    name: '性别',
    description: '性别选项',
    data: genderOptions
  },
  'education': {
    id: 'education',
    name: '教育程度',
    description: '教育程度选项',
    data: educationOptions
  },
  'occupation': {
    id: 'occupation',
    name: '职业分类',
    description: '职业分类二级选项',
    data: occupationOptions
  },
  'interests': {
    id: 'interests',
    name: '兴趣爱好',
    description: '兴趣爱好选项',
    data: interestOptions
  }
}

// 获取预设数据的函数
export const getPresetData = (presetType: string): PresetOption[] => {
  const preset = PRESET_DATA_REGISTRY[presetType]
  if (!preset) {
    console.warn(`预设数据类型 "${presetType}" 不存在`)
    return []
  }
  return preset.data
}

// 获取所有可用的预设数据类型
export const getAvailablePresets = (): PresetDataType[] => {
  return Object.values(PRESET_DATA_REGISTRY)
}

// 检查是否为预设数据类型
export const isPresetType = (value: any): boolean => {
  return typeof value === 'string' && value.startsWith('preset:')
}

// 从预设类型字符串中提取类型ID
export const extractPresetType = (presetString: string): string => {
  return presetString.replace('preset:', '')
}

// 创建预设类型字符串
export const createPresetType = (typeId: string): string => {
  return `preset:${typeId}`
}
