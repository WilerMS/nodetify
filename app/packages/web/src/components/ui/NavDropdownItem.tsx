import React, { useState, type FC } from 'react'
import { IconChevronDown, IconChevronLeft } from '@tabler/icons-react'
import { Collapse } from './Collapse'
import { NavItem } from './NavItem'

interface NavDropdownItemProps extends React.PropsWithChildren {
  icon?: React.ReactNode
  title: string
  defaultOpen?: boolean
  collapsed?: boolean
  onExpand?: (value: boolean) => void
}

export const NavDropdownItem: FC<NavDropdownItemProps> = ({
  icon,
  title,
  defaultOpen,
  collapsed = false,
  onExpand,
  children
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultOpen)

  const handleToggle = (value: boolean) => {
    setIsExpanded(value)
    if (value) onExpand?.(value)
  }

  return (
    <Collapse
      title={
        <NavItem>
          <div className='w-full flex-shrink-0 flex items-center gap-2'>
            <div>{icon}</div>
            {!collapsed && (
              <>
                <span>{title}</span>
                <div className='w-full flex justify-end'>
                  {isExpanded
                    ? <IconChevronDown size={20} />
                    : <IconChevronLeft size={20} />
                  }
                </div>
              </>
            )}
          </div>
        </NavItem>
      }
      defaultOpen={defaultOpen}
      forceClosed={collapsed}
      onToggle={handleToggle}
    >
      {children}
    </Collapse>
  )
}
