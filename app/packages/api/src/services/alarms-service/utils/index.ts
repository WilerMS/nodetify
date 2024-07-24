import { type Condition } from '@/models'
import { type Column } from '@/services/db-service/interfaces'

export const validateAlarmConditionOperator = (condition: Condition, column: Column) => {
  if (column.type === 'boolean' && ['=', '!='].includes(condition.operator)) return true
  if (column.type === 'number' && ['=', '!=', '>', '<', '>=', '<='].includes(condition.operator)) return true
  if (column.type === 'string' && ['=', '!='].includes(condition.operator)) return true
  return false
}

export const validateAlarmConditionValue = (condition: Condition, column: Column) => {
  if (column.type === 'boolean' && typeof condition.value === 'boolean') return true
  if (column.type === 'number' && typeof condition.value === 'number') return true
  if (column.type === 'string' && typeof condition.value === 'string') return true
  return false
}
