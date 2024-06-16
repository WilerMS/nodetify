import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import { SideBar } from '@/features/sidebar'
import { Header } from '@/features/header'

export const Route = createRootRoute({
  component: () => (
    <div className='main-layout w-screen h-screen'>
      <div className="app w-full h-full flex">
        <SideBar />
        <div className='w-full h-full flex flex-col'>
          <Header />
          <main className='w-full h-full bg-gray-100'>
            <Outlet />
          </main>
        </div>
        <TanStackRouterDevtools position='bottom-right' />
      </div>
    </div>
  )
})
