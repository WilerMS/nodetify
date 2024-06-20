import { type AuthContext } from '@/hooks'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

interface IRouterContext {
  auth: AuthContext
}

export const Route = createRootRouteWithContext<IRouterContext>()({
  component: () => (
    <div className='main-layout w-screen h-screen'>
      <Outlet />
      <TanStackRouterDevtools position='bottom-right' />
    </div>
  )
})
