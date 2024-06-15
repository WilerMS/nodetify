import React, { type FC } from 'react'
import cn from 'classnames'

interface NavItemProps extends React.PropsWithChildren {
  isActive?: boolean
}

export const NavItem: FC<NavItemProps> = ({ isActive, children, ...props }) => {
  return (
    <div
      className={cn(
        'flex gap-2 py-2 px-3 rounded-lg truncate',
        'active:scale-95 transition-transform duration-200',
        {
          'hover:bg-gray-200': !isActive,
          'bg-blue-100': isActive,
          'font-normal': isActive,
          'font-light': !isActive
        }
      )}
      {...props}
    >
      {children}
    </div>
  )
}
