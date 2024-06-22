import { Logo } from '@/components/ui'
import { IconArrowLeft } from '@tabler/icons-react'
import { Link, Outlet, createFileRoute, redirect, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

const AuthLayout = () => {
  const router = useRouterState()
  const [showBack, setShowBack] = useState(false)
  const [showLogo, setShowLogo] = useState(true)

  useEffect(() => {
    setShowBack(
      router.location.pathname.includes('register') ||
      !router.location.pathname.includes('welcomne')
    )

    setShowLogo(
      !router.location.pathname.includes('welcome')
    )
  }, [router.location.pathname])

  return (
    <div className="w-full h-full flex bg-gray-700">
      <main className="w-full h-full center">
        <div className="w-full h-full lg:w-[500px] lg:h-[800px] flex flex-col bg-white p-10 lg:rounded-xl shadow-lg">
          <div className="w-full flex gap-3 flex-shrink-0">
            {showBack && (
              <Link
                search={{ redirect: '/' }}
                to='/auth/login'
                className="rounded-full p-2 border-2 border-gray-500"
              >
                <IconArrowLeft size={20} />
              </Link>
            )}
            {showLogo && <Logo className='h-[max-content]' />}
          </div>
          <div className="w-full h-full center">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}

export const Route = createFileRoute('/auth')({
  beforeLoad: async ({ context }) => {
    const { auth } = context
    if (auth.isAuthenticated) {
      throw redirect({
        to: '/'
      })
    }
  },
  component: () => <AuthLayout />
})
