import React, { type FC } from 'react'
import cn from 'classnames'

interface NavItemProps extends React.PropsWithChildren {
  isActive?: boolean
}

export const NavItem: FC<NavItemProps> = ({ isActive, children, ...props }) => {
  return (
    <div
      className={cn(
        'flex items-center gap-2 py-3 px-3 rounded-lg truncate text-gray-700',
        'active:scale-95 transition-all duration-200',
        {
          'hover:bg-gray-200': !isActive,
          'bg-blue-100': isActive,
          'font-bold': isActive,
          'font-normal': !isActive
        }
      )}
      {...props}
    >
      {children}
    </div>
  )
}
