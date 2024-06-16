import cn from 'classnames'
import { useState } from 'react'
import { Divider } from '@nextui-org/divider'
import {
  IconHome,
  IconDatabase,
  IconAlarm,
  IconSettings,
  IconHelpCircle,
  IconChevronLeft,
  IconChevronRight,
  IconDashboard,
  IconLayoutSidebarRightCollapse,
  IconLayoutSidebarLeftCollapse
} from '@tabler/icons-react'

import { Logo, NavDropdownItem, NavItem, NavLink } from '@/components/ui'

export const SideBar = () => {
  const [expanded, setExpanded] = useState(true)

  const handleToggleExpanded = () => setExpanded(prev => !prev)

  return (
    <aside
      className={cn(
        'h-screen flex flex-col flex-shrink-0 transition-width',
        {
          'w-[250px]': expanded,
          'w-[87px]': !expanded
        }
      )}
    >
      <div className='h-[75px] w-full flex-col center relative'>
        <Logo className='pt-[5px]' showTitle={expanded} />
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
          to='/settings'
          title='Settings'
          showTitle={expanded}
          icon={<IconSettings size={30} />}
        />

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
          to='/support/contact'
          title='Changes'
          showTitle={expanded}
          icon={<IconHome size={30} />}
        />

        <div className='flex-grow'></div>

        <button
          className='center gap-12 px-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 py-3 transition-all'
          onClick={handleToggleExpanded}
        >
          {expanded && <span className='truncate'>Collapse Menu</span>}
          {expanded
            ? <IconLayoutSidebarLeftCollapse size={30} />
            : <IconLayoutSidebarRightCollapse size={30} />
          }
        </button>

      </nav>
    </aside>
  )
}
