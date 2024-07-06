export interface ColumnInfo {
  table_schema: string
  table_name: string
  column_name: string
  data_type: string
  is_nullable: boolean
}

export interface Column {
  name: string
  type: string
  nullable: boolean
}

export interface Table {
  name: string
  columns: Column[]
}

export interface Schema {
  name: string
  tables: Table[]
}
