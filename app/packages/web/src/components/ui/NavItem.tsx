import React, { type FC } from 'react'
import cn from 'classnames'

interface NavItemProps extends React.PropsWithChildren {
  isActive?: boolean
  className?: string
}

export const NavItem: FC<NavItemProps> = ({ isActive, className, children, ...props }) => {
  return (
    <div
      className={cn(
        'flex items-center gap-4 py-3 px-3 rounded-lg truncate relative',
        'active:scale-95 transition-all duration-200',
        {
          'hover:bg-gray-100': !isActive,
          'bg-gray-200': isActive,
          'font-bold': isActive,
          'font-normal': !isActive,
          'text-gray-600': !isActive,
          'text-black': isActive
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
