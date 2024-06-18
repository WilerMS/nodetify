import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Header } from '@/features/header'
import { SideBar } from '@/features/sidebar'

export const Route = createFileRoute('/(protected)')({
  component: () => (
    <div className="app w-full h-full flex">
      <SideBar />
      <div className='w-full h-full flex flex-col'>
        <Header />
        <main className='w-full h-full bg-gray-100'>
          <Outlet />
        </main>
      </div>
    </div>
  )
})
