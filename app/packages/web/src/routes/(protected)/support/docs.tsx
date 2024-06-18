import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/support/docs')({
  component: () => <div>Hello /_more/support/docs!</div>
})
