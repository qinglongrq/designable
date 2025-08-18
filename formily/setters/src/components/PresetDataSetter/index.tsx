import React, { useState, useCallback } from 'react'
import { Button, Modal, Select, Card, Typography, Space, Descriptions, Tag } from 'antd'
import { SettingOutlined, DatabaseOutlined, EyeOutlined } from '@ant-design/icons'
import { observer } from '@formily/reactive-react'
import { TextWidget } from '@pind/designable-react'

const { Title, Text } = Typography
const { Option } = Select

export interface IPresetDataSetterProps {
  value?: string
  onChange?: (value: string) => void
}

// 预设数据类型定义
const PRESET_TYPES = [
  {
    id: 'china-regions',
    name: '中国省市县',
    description: '中国省市县三级联动数据',
    component: 'Cascader',
    dataCount: '34省/直辖市',
    example: '北京市 > 北京市 > 东城区'
  },
  {
    id: 'gender',
    name: '性别选项',
    description: '标准性别选项',
    component: 'Select',
    dataCount: '3项',
    example: '男、女、其他'
  },
  {
    id: 'education',
    name: '教育程度',
    description: '教育程度选项',
    component: 'Select',
    dataCount: '7项',
    example: '小学、初中、高中、大专、本科、硕士、博士'
  },
  {
    id: 'occupation',
    name: '职业分类',
    description: '职业分类二级选项',
    component: 'Cascader',
    dataCount: '3大类',
    example: 'IT互联网 > 软件开发'
  },
  {
    id: 'interests',
    name: '兴趣爱好',
    description: '兴趣爱好选项',
    component: 'Checkbox.Group',
    dataCount: '10项',
    example: '阅读、运动、音乐、旅行等'
  }
]

export const PresetDataSetter: React.FC<IPresetDataSetterProps> = observer((props) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedPresetId, setSelectedPresetId] = useState<string>('')

  const currentPreset = props.value ? props.value.replace('preset:', '') : ''
  const currentPresetInfo = PRESET_TYPES.find(p => p.id === currentPreset)

  const handleOpenModal = useCallback(() => {
    setSelectedPresetId(currentPreset)
    setModalVisible(true)
  }, [currentPreset])

  const handleConfirm = useCallback(() => {
    if (selectedPresetId) {
      props.onChange?.(`preset:${selectedPresetId}`)
    } else {
      props.onChange?.('')
    }
    setModalVisible(false)
  }, [selectedPresetId, props])

  const handleCancel = useCallback(() => {
    setModalVisible(false)
    setSelectedPresetId(currentPreset)
  }, [currentPreset])

  const handleClear = useCallback(() => {
    props.onChange?.('')
    setModalVisible(false)
  }, [props])

  return (
    <div className="preset-data-setter">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          type="dashed"
          icon={<DatabaseOutlined />}
          onClick={handleOpenModal}
          style={{ width: '100%' }}
        >
          {currentPresetInfo ? `已选择: ${currentPresetInfo.name}` : '选择预设数据类型'}
        </Button>
        
        {currentPresetInfo && (
          <Card size="small" style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <Space direction="vertical" size={4}>
              <Text strong style={{ color: '#389e0d' }}>
                {currentPresetInfo.name}
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {currentPresetInfo.description}
              </Text>
              <Space>
                <Tag color="blue" style={{ fontSize: '11px' }}>
                  {currentPresetInfo.component}
                </Tag>
                <Tag color="green" style={{ fontSize: '11px' }}>
                  {currentPresetInfo.dataCount}
                </Tag>
              </Space>
            </Space>
          </Card>
        )}
      </Space>

      <Modal
        title={
          <Space>
            <SettingOutlined />
            <TextWidget>选择预设数据类型</TextWidget>
          </Space>
        }
        open={modalVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        width={700}
        okText="确定"
        cancelText="取消"
        footer={[
          <Button key="clear" onClick={handleClear}>
            清除选择
          </Button>,
          <Button key="cancel" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="ok" type="primary" onClick={handleConfirm}>
            确定
          </Button>
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            选择预设数据类型可以避免在配置中存储大量枚举数据，提高配置文件的可读性和维护性。
          </Text>
        </div>

        <Select
          value={selectedPresetId}
          onChange={setSelectedPresetId}
          placeholder="请选择预设数据类型"
          style={{ width: '100%', marginBottom: 16 }}
          allowClear
        >
          {PRESET_TYPES.map(preset => (
            <Option key={preset.id} value={preset.id}>
              <Space>
                <span>{preset.name}</span>
                <Tag color="blue" style={{ fontSize: '11px' }}>
                  {preset.component}
                </Tag>
                <Tag color="green" style={{ fontSize: '11px' }}>
                  {preset.dataCount}
                </Tag>
              </Space>
            </Option>
          ))}
        </Select>

        {selectedPresetId && (
          <Card 
            title={
              <Space>
                <EyeOutlined />
                <span>预设数据详情</span>
              </Space>
            } 
            size="small"
          >
            {(() => {
              const preset = PRESET_TYPES.find(p => p.id === selectedPresetId)
              if (!preset) return null
              
              return (
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label="预设类型ID">
                    <Text code>preset:{preset.id}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="名称">
                    {preset.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="描述">
                    {preset.description}
                  </Descriptions.Item>
                  <Descriptions.Item label="推荐组件">
                    <Tag color="blue">{preset.component}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="数据规模">
                    <Tag color="green">{preset.dataCount}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="示例数据">
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {preset.example}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              )
            })()}
          </Card>
        )}
      </Modal>
    </div>
  )
})
