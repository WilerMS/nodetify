import React, { useState, type FC } from 'react'
import { IconChevronDown, IconChevronLeft } from '@tabler/icons-react'
import { Collapse } from './Collapse'
import { NavItem } from './NavItem'

interface NavDropdownItemProps extends React.PropsWithChildren {
  icon?: React.ReactNode
  title: React.ReactNode
  defaultOpen?: boolean
}

export const NavDropdownItem: FC<NavDropdownItemProps> = ({
  icon,
  title,
  defaultOpen,
  children
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultOpen)

  const handleToggle = (value: boolean) => setIsExpanded(value)

  return (
    <Collapse
      title={
        <NavItem>
          <div className='w-full flex items-center gap-2'>
            {icon}
            {title}
            <div className='w-full flex justify-end'>
              {isExpanded
                ? <IconChevronDown size={20} />
                : <IconChevronLeft size={20} />
              }
            </div>
          </div>
        </NavItem>
      }
      defaultOpen={defaultOpen}
      onToggle={handleToggle}
    >
      {children}
    </Collapse>
  )
}
