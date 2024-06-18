import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <div className='main-layout w-screen h-screen'>
      <Outlet />
      <TanStackRouterDevtools position='bottom-right' />
    </div>
  )
})
