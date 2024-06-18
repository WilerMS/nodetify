import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/databases/')({
  component: () => <div>Hello /databases/!</div>

})
