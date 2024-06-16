import { type FC } from 'react'
import { Link, type LinkProps } from '@tanstack/react-router'
import cn from 'classnames'
import { NavItem } from './NavItem'

interface NavLinkProps extends LinkProps {
  icon?: React.ReactNode
  title: React.ReactNode
  showTitle?: boolean
}

export const NavLink: FC<NavLinkProps> = ({
  icon,
  title,
  showTitle = true,
  ...props
}) => {
  return (
    <Link {...props}>
      {({ isActive }) => (
        <NavItem
          className={cn({
            // center: !showTitle
          })}
          isActive={isActive}
        >
          <span className='flex-shrink-0'>
            {icon}
          </span>
          {showTitle &&
            <span>
              {title}
            </span>
          }
        </NavItem>
      )}
    </Link>
  )
}
