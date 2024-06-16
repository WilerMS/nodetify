import { IconBell, IconBrandGithub, IconSearch } from '@tabler/icons-react'
import cn from 'classnames'
import ProfileNavMenu from './ProfileNavMenu'

export const Header = () => {
  return (
    <header
      className={cn(
        'w-full h-[75px] border-b flex items-center flex-shrink-0'
      )}
    >
      <div className='w-full h-full px-6 flex justify-end items-center'>
        <div
          className={cn(
            'w-full h-10 bg-gray-100 bg-opacity-50 rounded-xl overflow-hidden px-5 flex items-center gap-4 border border-gray-200'
          )}
        >
          <IconSearch size={20} className='text-gray-500 flex-shrink-0' />
          <input
            type="text"
            placeholder='Search...'
            className='outline-none w-full h-full bg-transparent'
          />
        </div>
      </div>
      <nav className='flex gap-5 items-center mr-5'>
        <span><IconBell /></span>
        <span><IconBrandGithub /></span>
        <ProfileNavMenu />
      </nav>
    </header>
  )
}
