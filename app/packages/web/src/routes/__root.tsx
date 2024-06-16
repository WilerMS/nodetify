import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import { SideBar } from '@/features/sidebar'
import { Header } from '@/features/header'

export const Route = createRootRoute({
  component: () => (
    <div className='main-layout w-screen h-screen'>
      <div className="app w-full h-full flex">
        <SideBar />
        <div className='w-full'>
          <Header />
          <main>
            <Outlet />
          </main>
        </div>
        <TanStackRouterDevtools />
      </div>
    </div>
  )
})
