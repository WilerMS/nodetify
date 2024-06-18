import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/')({
  component: () => <div className='w-full h-full '>Home</div>
})
