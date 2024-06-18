import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/support/tutorials')({
  component: () => <div>Hello /_more/support/tutorials!</div>
})
