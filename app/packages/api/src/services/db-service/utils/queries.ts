import { sql } from '@/utils'

export const POSTGRES_QUERIES = {
  NOTIFY_FUNCTION: () => sql`
    CREATE OR REPLACE FUNCTION fn_nodetify_notifications()
    RETURNS TRIGGER AS $$
    BEGIN
      PERFORM pg_notify('nodetify', json_build_object(
        'table', TG_TABLE_NAME,
        'type', TG_OP,
        'data', row_to_json(NEW))::text
      );
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `,
  NOTIFY_TRIGGER: (table: string) => sql`
    CREATE TRIGGER trigger_nodetify_notifications_${table}
    AFTER INSERT OR UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE FUNCTION fn_nodetify_notifications();
  `
}
