import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/alarms/')({
  component: () => <div>Hello /alarms/!</div>
})
