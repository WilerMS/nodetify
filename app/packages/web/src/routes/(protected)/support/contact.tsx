import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/support/contact')({
  component: () => <div>Hello /_more/support/contact!</div>
})
