export interface ColumnInfo {
  table_schema: string
  table_name: string
  column_name: string
  data_type: string
  is_nullable: boolean
}

export interface Column {
  name: string
  type: 'number' | 'string' | 'boolean'
  nullable: boolean
}

export interface Table {
  name: string
  columns: Column[]
}

export type ISchema = Table[]