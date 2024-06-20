import cn from 'classnames'
import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import {
  IconDatabase,
  IconAlarm,
  IconSettings,
  IconHelpCircle,
  IconDashboard,
  IconMailExclamation,
  IconLogout2,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-react'

import { useAuth } from '@/hooks'
import { Route } from '@/routes/(protected)'
import { Logo, NavDropdownItem, NavItem, NavLink } from '@/components/ui'

export const SideBar = () => {
  const [expanded, setExpanded] = useState(true)
  const router = useRouter()
  const navigate = Route.useNavigate()

  const { logout } = useAuth()

  const handleToggleExpanded = () => setExpanded(prev => !prev)
  const handleLogout = () => {
    logout().then(() => {
      router.invalidate().finally(() => {
        navigate({ to: '/' })
      })
    })
  }

  return (
    <aside
      className={cn(
        'group h-screen flex flex-col flex-shrink-0 transition-width',
        {
          'w-[250px]': expanded,
          'w-[87px]': !expanded
        }
      )}
    >
      <div className='h-[75px] w-full flex-col center relative'>
        <div className='w-full h-full px-6 flex items-center cursor-pointer'>
          <Logo className='pt-[5px]' showTitle={expanded} />
        </div>
        <button
          className={cn(
            'w-[25px] h-[25px] absolute right-[-13px] mt-[5px] ',
            'hidden shadow border center rounded-full bg-gray-100 transition-all',
            'group-hover:block active:scale-95 duration-100'
          )}
          onClick={handleToggleExpanded}
        >
          {expanded
            ? <IconChevronLeft className='ml-[2px]' size={18} />
            : <IconChevronRight className='ml-[3px]' size={18} />
          }
        </button>
      </div>

      <nav className='h-full flex flex-col gap-2 px-4 py-4'>
        <NavLink
          to='/'
          title='Dashboard'
          showTitle={expanded}
          icon={<IconDashboard size={30} />}
        />

        <NavLink
          to='/databases'
          title='Databases'
          showTitle={expanded}
          icon={<IconDatabase size={30} />}
        />

        <NavLink
          to='/alarms'
          title='Summary of Alarms'
          showTitle={expanded}
          icon={<IconAlarm size={30} />}
        />

        <NavLink
          to='/notifications'
          title='Notifications'
          showTitle={expanded}
          icon={<IconMailExclamation size={30} />}
        />

        <div className='flex-grow'></div>

        <NavDropdownItem
          icon={<IconHelpCircle size={30} />}
          title='Support'
          collapsed={!expanded}
          onExpand={() => setExpanded(true)}
          defaultOpen
        >
          <NavLink to='/support/docs' title='Documentation' />
          <NavLink to='/support/tutorials' title='Tutorials and Guides' />
          <NavLink to='/support/contact' title='Contact Support' />
        </NavDropdownItem>

        <NavLink
          to='/settings'
          title='Settings'
          showTitle={expanded}
          icon={<IconSettings size={30} />}
        />

        <button onClick={handleLogout}>
          <NavItem className='hover:bg-red-100 text-red-600 cursor-pointer'>
            <IconLogout2 className='-ml-[3px]' size={30} />
            {expanded && <span className='truncate'>Log out</span>}
          </NavItem>
        </button>

      </nav>
    </aside>
  )
}
