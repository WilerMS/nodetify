import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/alarms/')({
  component: () => <div>Hello /alarms/!</div>
})
