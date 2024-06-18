import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/notifications/')({
  component: () => <div>Hello /notifications/!</div>
})
