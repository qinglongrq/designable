import {
    IConditionalDisplayValue,
    ICondition,
    IConditionGroup,
  } from './index'
  
  const operatorMap = {
    equals: '==',
    notEquals: '!=',
    greaterThan: '>',
    lessThan: '<',
    greaterThanOrEqual: '>=',
    lessThanOrEqual: '<=',
    contains: '.includes',
    notContains: '!.includes',
  }
  
  const formatValue = (value: string): string => {
    // 统一将所有值作为字符串处理，用单引号包装
    return `'${value}'`
  }
  
  const buildConditionExpression = (condition: ICondition): string => {
    const { field, operator, value } = condition
  
    if (!field) return 'true'
  
    const fieldRef = `$deps.${field}`
  
    if (operator === 'contains') {
      return `${fieldRef} && ${fieldRef}.includes(${formatValue(value)})`
    }
  
    if (operator === 'notContains') {
      return `!${fieldRef} || !${fieldRef}.includes(${formatValue(value)})`
    }
  
    const jsOperator = operatorMap[operator]
    return `${fieldRef} ${jsOperator} ${formatValue(value)}`
  }
  
  const buildConditionGroupExpression = (group: IConditionGroup): string => {
    if (group.conditions.length === 0) return 'true'
  
    const conditionExpressions = group.conditions
      .filter((condition) => condition.field)
      .map(buildConditionExpression)
  
    if (conditionExpressions.length === 0) return 'true'
    if (conditionExpressions.length === 1) return conditionExpressions[0]
  
    const logicOperator = group.logic === 'AND' ? ' && ' : ' || '
    return `(${conditionExpressions.join(logicOperator)})`
  }
  
  export const buildConditionalDisplayExpression = (
    config: IConditionalDisplayValue
  ): string => {
    if (!config || config.groups.length === 0) return 'true'
  
    const groupExpressions = config.groups
      .filter((group) => group.conditions.some((condition) => condition.field))
      .map(buildConditionGroupExpression)
  
    if (groupExpressions.length === 0) return 'true'
    if (groupExpressions.length === 1) return groupExpressions[0]
  
    const mainLogicOperator = config.logic === 'AND' ? ' && ' : ' || '
    return groupExpressions.join(mainLogicOperator)
  }
  
  // 解析现有的reaction配置，提取条件显示配置
  export const parseConditionalDisplayReaction = (
    reaction: any
  ): IConditionalDisplayValue | null => {
    if (!reaction?.fulfill?.state?.visible) return null
  
    const visibleExpression = reaction.fulfill.state.visible
  
    // 移除外层的 {{}} 包装
    let expression = visibleExpression.replace(/^\{\{(.*)\}\}$/, '$1').trim()
  
    // 移除最外层的括号（如果有的话）
    if (expression.startsWith('(') && expression.endsWith(')')) {
      expression = expression.slice(1, -1).trim()
    }
  
    // 尝试解析复杂表达式，支持AND/OR逻辑
    const conditions: ICondition[] = []
  
    // 使用更精确的正则表达式来匹配条件
    const conditionRegex = /\$deps\.([^=!<>\s&|()]+)\s*([!=<>]+)\s*'([^']*)'/g
    let match
  
    while ((match = conditionRegex.exec(expression)) !== null) {
      const [, field, operator, value] = match
  
      let conditionOperator: ICondition['operator'] = 'equals'
      switch (operator.trim()) {
        case '===':
        case '==':
          conditionOperator = 'equals'
          break
        case '!==':
        case '!=':
          conditionOperator = 'notEquals'
          break
        case '>':
          conditionOperator = 'greaterThan'
          break
        case '<':
          conditionOperator = 'lessThan'
          break
        case '>=':
          conditionOperator = 'greaterThanOrEqual'
          break
        case '<=':
          conditionOperator = 'lessThanOrEqual'
          break
      }
  
      conditions.push({
        field,
        operator: conditionOperator,
        value,
      })
    }
  
    if (conditions.length > 0) {
      // 检测逻辑关系，如果表达式中包含&&则是AND，包含||则是OR
      const logic = expression.includes('&&') ? 'AND' : 'OR'
  
      return {
        logic: 'AND', // 组间逻辑，这里默认AND
        groups: [
          {
            logic,
            conditions,
          },
        ],
      }
    }
  
    // 如果无法解析，返回默认配置
    return {
      logic: 'AND',
      groups: [
        {
          logic: 'AND',
          conditions: [{ field: '', operator: 'equals', value: '' }],
        },
      ],
    }
  }
  
  // 收集所有用到的字段，生成dependencies配置
  const collectDependencies = (
    config: IConditionalDisplayValue
  ): Array<{ property: string; type: string; source: string; name: string }> => {
    const fieldSet = new Set<string>()
  
    config.groups.forEach((group) => {
      group.conditions.forEach((condition) => {
        if (condition.field) {
          fieldSet.add(condition.field)
        }
      })
    })
  
    return Array.from(fieldSet).map((field) => ({
      property: 'value',
      type: 'any',
      source: field,
      name: field,
    }))
  }
  
  export const createConditionalDisplayReaction = (
    config: IConditionalDisplayValue,
    hideWhenMatch = false
  ) => {
    const expression = buildConditionalDisplayExpression(config)
    const dependencies = collectDependencies(config)
  
    return {
      dependencies,
      fulfill: {
        state: {
          visible: hideWhenMatch ? `{{!(${expression})}}` : `{{${expression}}}`,
        },
      },
    }
  }