import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/settings/')({
  component: () => <div>Hello /_more/settings!</div>
})
