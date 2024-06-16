import { NavDropdownItem, NavLink } from '@/components/ui'
import { IconHome, IconDatabase, IconAlarm, IconSettings, IconHelpCircle } from '@tabler/icons-react'

export const SideBar = () => {
  return (
    <aside className="h-screen w-[250px] flex-shrink-0 border-r-2 px-4 py-8">
      <div>
        <h2 className='text-2xl'>Nodetify</h2>
      </div>

      <nav className='flex flex-col gap-2 mt-10'>
        <NavLink to='/' icon={<IconHome size={20} />}>
          <span>Home</span>
        </NavLink>

        <h3 className='font-medium text-sm my-1'>Main Menu</h3>

        <NavLink to='/databases' icon={<IconDatabase size={20} />}>
          <span>Databases</span>
        </NavLink>

        <NavLink to='/alarms' icon={<IconAlarm size={20} />}>
          <span>Summary of Alarms</span>
        </NavLink>

        <h3 className='font-medium text-sm my-1'>General</h3>

        <NavLink to='/settings' icon={<IconSettings size={20} />}>
          <span>Settings</span>
        </NavLink>

        <NavDropdownItem
          icon={<IconHelpCircle size={20} />}
          title={<span>Support</span>}
          defaultOpen
        >
          <NavLink to='/support/docs'>
            <span>Documentation</span>
          </NavLink>
          <NavLink to='/support/tutorials'>
            <span>Tutorials and Guides</span>
          </NavLink>
          <NavLink to='/support/contact'>
            <span>Contact Support</span>
          </NavLink>
        </NavDropdownItem>

        <h3 className='font-medium text-sm my-1'>Updates</h3>

        <NavLink to='/support/contact' icon={<IconHome size={20} />}>
          <span>Changes</span>
        </NavLink>

      </nav>
    </aside>
  )
}
