import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_more/settings')({
  component: () => <div>Hello /_more/settings!</div>
})
