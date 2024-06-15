import { type FC } from 'react'
import { Link, type LinkProps } from '@tanstack/react-router'
import { NavItem } from './NavItem'

interface NavLinkProps extends LinkProps {
  icon?: React.ReactNode
  children: React.ReactNode
}

export const NavLink: FC<NavLinkProps> = ({ icon, children, ...props }) => {
  return (
    <Link {...props}>
      {({ isActive }) => (
        <NavItem isActive={isActive}>
          {icon}
          {children}
        </NavItem>
      )}
    </Link>
  )
}
