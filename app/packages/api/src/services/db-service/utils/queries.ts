import { sql } from '@/utils'

export const POSTGRES_QUERIES = {
  CREATE_NOTIFY_FUNCTION: () => sql`
    CREATE OR REPLACE FUNCTION fn_nodetify_notifications()
    RETURNS TRIGGER AS $$
    BEGIN
      PERFORM pg_notify(
        'nodetify', 
        json_build_object(
          'table', TG_TABLE_NAME,
          'type', TG_OP,
          'data', row_to_json(NEW)
        )::text
      );
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `,
  CREATE_NOTIFY_TRIGGER: (table: string) => sql`
    CREATE OR REPLACE TRIGGER trigger_nodetify_notifications_${table}
    AFTER INSERT OR UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE FUNCTION fn_nodetify_notifications();
  `,
  CHECK_NOTIFY_TRIGGER: (table: string) => sql`
    SELECT COUNT(*) > 0 as trigger_exists
    FROM information_schema.triggers 
    WHERE trigger_name = trigger_nodetify_notifications_${table};
  `,
  GET_DATABASE_SCHEMAS: () => sql`
    SELECT table_schema, table_name, column_name, data_type, is_nullable != 'NO' as is_nullable
    FROM information_schema.columns
    WHERE table_schema IN ('public')
    ORDER BY table_schema, table_name
  `
}
