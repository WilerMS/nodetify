import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/databases/')({
  component: () => <div>Hello /databases/!</div>

})
