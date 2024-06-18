import { IconBell } from '@tabler/icons-react'
import { type FC } from 'react'
import cn from 'classnames'

interface LogoProps {
  showTitle?: boolean
  className?: string
}

export const Logo: FC<LogoProps> = ({ className, showTitle = true }) => {
  return (
    <div className={cn('logo flex gap-2 items-center', className)}>
      <div className='bg-black w-[40px] h-[40px] center rounded-lg'>
        <IconBell className='text-white -rotate-12' size={30} stroke={1.8}/>
      </div>
      {showTitle && <span className='text-2xl transition-all duration-1000 font-bold'>Nodetify</span>}
    </div>
  )
}
