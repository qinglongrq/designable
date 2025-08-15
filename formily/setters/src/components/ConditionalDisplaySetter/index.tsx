import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Button, Modal, Form, Select, Input, Space, Divider } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { observer } from '@formily/reactive-react'
import { TextWidget } from '@pind/designable-react'
import { GlobalRegistry, TreeNode } from '@pind/designable-core'
import { useSelectedNode } from '@pind/designable-react'
import {
  createConditionalDisplayReaction,
  parseConditionalDisplayReaction,
} from './utils'

export interface ICondition {
  field: string
  operator:
    | 'equals'
    | 'notEquals'
    | 'greaterThan'
    | 'lessThan'
    | 'greaterThanOrEqual'
    | 'lessThanOrEqual'
    | 'contains'
    | 'notContains'
  value: string
}

export interface IConditionGroup {
  logic: 'AND' | 'OR'
  conditions: ICondition[]
}

export interface IConditionalDisplayValue {
  logic: 'AND' | 'OR'
  groups: IConditionGroup[]
}

export interface IConditionalDisplaySetterProps {
  value?: any
  onChange?: (value: any) => void
  node?: TreeNode // 添加node参数以便直接操作节点属性
}

const operatorOptions = [
  { label: '等于', value: 'equals' },
  { label: '不等于', value: 'notEquals' },
  { label: '大于', value: 'greaterThan' },
  { label: '小于', value: 'lessThan' },
  { label: '大于等于', value: 'greaterThanOrEqual' },
  { label: '小于等于', value: 'lessThanOrEqual' },
  { label: '包含', value: 'contains' },
  { label: '不包含', value: 'notContains' },
]

const logicOptions = [
  { label: 'AND', value: 'AND' },
  { label: 'OR', value: 'OR' },
]

// 参考PathSelector的实现来获取字段数据源
const transformFieldDataSource = (node: TreeNode) => {
  const currentNode = node
  const hasNoVoidChildren = (node: TreeNode) => {
    return node.children?.some((node) => {
      if (node.props.type !== 'void' && node !== currentNode) return true
      return hasNoVoidChildren(node)
    })
  }
  const findRoot = (node: TreeNode): TreeNode => {
    if (!node?.parent) return node
    if (node?.parent?.componentName !== node.componentName) return node.parent
    return findRoot(node.parent)
  }
  const transformChildren = (
    children: TreeNode[],
    path = []
  ): Array<{ label: string; value: string }> => {
    return children.reduce((buf, node) => {
      if (node === currentNode) return buf
      if (node.props.type === 'array' && !node.contains(currentNode)) return buf
      if (node.props.type === 'void' && !hasNoVoidChildren(node)) return buf

      const currentPath = path.concat(node.props.name || node.id)
      const label =
        node.props.title ||
        node.props['x-component-props']?.title ||
        node.props.name ||
        node.designerProps?.title ||
        node.id
      const value = currentPath.join('.')

      const result = buf.concat({
        label: `${label} (${value})`,
        value,
      })

      // 递归处理子节点
      if (node.children?.length) {
        result.push(...transformChildren(node.children, currentPath))
      }

      return result
    }, [])
  }

  const root = findRoot(node)
  if (root) {
    return transformChildren(root.children)
  }
  return []
}

export const ConditionalDisplaySetter: React.FC<IConditionalDisplaySetterProps> =
  observer((props) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [form] = Form.useForm()
    const currentNode = useSelectedNode()

    // 获取可用字段列表
    const availableFields = useMemo(() => {
      if (!currentNode) return []
      return transformFieldDataSource(currentNode)
    }, [currentNode])

    // 从当前节点的x-reactions中读取条件显示配置
    const getConditionalReactionFromNode = useCallback(() => {
      if (!currentNode?.props?.['x-reactions']) return null

      const reactions = currentNode.props['x-reactions']
      if (reactions?.fulfill?.state?.visible) {
        return parseConditionalDisplayReaction(reactions)
      }
      return null
    }, [currentNode])

    // 初始化配置，支持从props.value或节点的x-reactions回显
    const [config, setConfig] = useState<IConditionalDisplayValue>(() => {
      // 优先从props.value读取
      if (props.value?.fulfill?.state?.visible) {
        const parsedConfig = parseConditionalDisplayReaction(props.value)
        return (
          parsedConfig || {
            logic: 'AND',
            groups: [
              {
                logic: 'AND',
                conditions: [{ field: '', operator: 'equals', value: '' }],
              },
            ],
          }
        )
      }

      // 从节点的x-reactions读取
      const nodeConfig = getConditionalReactionFromNode()
      if (nodeConfig) {
        return nodeConfig
      }

      // 如果是完整的配置对象
      if (props.value?.logic && props.value?.groups) {
        return props.value
      }

      // 默认配置 - 删除密码默认值
      return {
        logic: 'AND',
        groups: [
          {
            logic: 'AND',
            conditions: [{ field: '', operator: 'equals', value: '' }],
          },
        ],
      }
    })

    // 当props.value或节点变化时更新本地状态
    useEffect(() => {
      if (props.value?.fulfill?.state?.visible) {
        const parsedConfig = parseConditionalDisplayReaction(props.value)
        if (parsedConfig) {
          setConfig(parsedConfig)
        }
      } else if (props.value?.logic && props.value?.groups) {
        setConfig(props.value)
      } else {
        const nodeConfig = getConditionalReactionFromNode()
        if (nodeConfig) {
          setConfig(nodeConfig)
        }
      }
    }, [props.value, currentNode, getConditionalReactionFromNode])

    const openModal = useCallback(() => {
      setModalVisible(true)
      form.setFieldsValue(config)
    }, [config, form])

    const closeModal = useCallback(() => {
      setModalVisible(false)
    }, [])

    const handleOk = useCallback(() => {
      const values = form.getFieldsValue()
      // 生成显示的reaction（条件满足时显示，参考响应器的实现）
      const reaction = createConditionalDisplayReaction(values, false)

      // 直接更新节点的x-reactions属性
      if (currentNode) {
        currentNode.setProps({
          'x-reactions': reaction,
        })
      }

      // 同时通知props.onChange（如果需要）
      props.onChange?.(reaction)
      setConfig(values)
      closeModal()
    }, [form, props, closeModal, currentNode])

    const addConditionGroup = useCallback(() => {
      const newConfig = { ...config }
      newConfig.groups.push({
        logic: 'AND',
        conditions: [{ field: '', operator: 'equals', value: '' }],
      })
      setConfig(newConfig)
      form.setFieldsValue(newConfig)
    }, [config, form])

    const removeConditionGroup = useCallback(
      (groupIndex: number) => {
        const newConfig = { ...config }
        newConfig.groups.splice(groupIndex, 1)
        setConfig(newConfig)
        form.setFieldsValue(newConfig)
      },
      [config, form]
    )

    const addCondition = useCallback(
      (groupIndex: number) => {
        const newConfig = { ...config }
        newConfig.groups[groupIndex].conditions.push({
          field: '',
          operator: 'equals',
          value: '',
        })
        setConfig(newConfig)
        form.setFieldsValue(newConfig)
      },
      [config, form]
    )

    const removeCondition = useCallback(
      (groupIndex: number, conditionIndex: number) => {
        const newConfig = { ...config }
        newConfig.groups[groupIndex].conditions.splice(conditionIndex, 1)
        setConfig(newConfig)
        form.setFieldsValue(newConfig)
      },
      [config, form]
    )

    return (
      <div>
        <Button block onClick={openModal}>
          配置条件显示
        </Button>
        <Modal
          title="配置条件显示规则"
          width="80%"
          centered
          visible={modalVisible}
          onCancel={closeModal}
          onOk={handleOk}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={config}
            onValuesChange={(_, values) => setConfig(values)}
          >
            <Form.Item label="组间逻辑关系" name="logic">
              <Select options={logicOptions} />
            </Form.Item>

            <Divider>条件组</Divider>

            {config.groups.map((group, groupIndex) => (
              <div
                key={groupIndex}
                style={{
                  border: '1px solid #d9d9d9',
                  padding: 16,
                  marginBottom: 16,
                  borderRadius: 6,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                  }}
                >
                  <h4>条件组 {groupIndex + 1}</h4>
                  <Space>
                    <span>组内逻辑:</span>
                    <Form.Item
                      name={['groups', groupIndex, 'logic']}
                      style={{ margin: 0 }}
                    >
                      <Select options={logicOptions} style={{ width: 80 }} />
                    </Form.Item>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeConditionGroup(groupIndex)}
                      disabled={config.groups.length <= 1}
                    />
                  </Space>
                </div>

                {group.conditions.map((condition, conditionIndex) => (
                  <div key={conditionIndex} style={{ marginBottom: 12 }}>
                    <Space style={{ width: '100%' }} align="center">
                      <Form.Item
                        name={[
                          'groups',
                          groupIndex,
                          'conditions',
                          conditionIndex,
                          'field',
                        ]}
                        style={{ margin: 0, flex: 1 }}
                      >
                        <Select
                          placeholder="选择字段"
                          options={availableFields}
                          showSearch
                          filterOption={(input, option) =>
                            option?.label
                              ?.toLowerCase()
                              .includes(input.toLowerCase()) || false
                          }
                        />
                      </Form.Item>

                      <Form.Item
                        name={[
                          'groups',
                          groupIndex,
                          'conditions',
                          conditionIndex,
                          'operator',
                        ]}
                        style={{ margin: 0 }}
                      >
                        <Select
                          options={operatorOptions}
                          style={{ width: 120 }}
                        />
                      </Form.Item>

                      <Form.Item
                        name={[
                          'groups',
                          groupIndex,
                          'conditions',
                          conditionIndex,
                          'value',
                        ]}
                        style={{ margin: 0, flex: 1 }}
                      >
                        <Input placeholder="值" />
                      </Form.Item>

                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() =>
                          removeCondition(groupIndex, conditionIndex)
                        }
                        disabled={group.conditions.length <= 1}
                      />
                    </Space>

                    {conditionIndex < group.conditions.length - 1 && (
                      <div
                        style={{
                          textAlign: 'center',
                          margin: '8px 0',
                          color: '#666',
                        }}
                      >
                        {group.logic}
                      </div>
                    )}
                  </div>
                ))}

                <Button
                  type="dashed"
                  onClick={() => addCondition(groupIndex)}
                  icon={<PlusOutlined />}
                  style={{ width: '100%' }}
                >
                  添加条件
                </Button>
              </div>
            ))}

            {config.groups.length > 1 && (
              <div
                style={{
                  textAlign: 'center',
                  margin: '16px 0',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#666',
                }}
              >
                组间关系: {config.logic}
              </div>
            )}

            <Button
              type="dashed"
              onClick={addConditionGroup}
              icon={<PlusOutlined />}
              style={{ width: '100%' }}
            >
              添加条件组
            </Button>
          </Form>
        </Modal>
      </div>
    )
  })
