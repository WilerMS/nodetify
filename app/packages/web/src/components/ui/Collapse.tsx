import React, { type FC, useState } from 'react'
import cn from 'classnames'

interface CollapseProps extends React.PropsWithChildren {
  title: React.ReactNode
  defaultOpen?: boolean
  onToggle: (expanded: boolean) => void
}

export const Collapse: FC<CollapseProps> = ({
  title,
  defaultOpen = false,
  children,
  onToggle
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultOpen)

  const handleToggle = () => {
    const expanded = !isExpanded
    onToggle(expanded)
    setIsExpanded(expanded)
  }

  return (
    <div className='custom-collapse'>
      <div
        className='cursor-pointer mb-2'
        onClick={handleToggle}
      >
        {title}
      </div>
      <div
        className={cn(
          'overflow-hidden transition-height duration-300 ease-in pl-5',
          {
            'h-0': !isExpanded,
            'h-[130px]': isExpanded
          }
        )}
      >
        <div className='flex flex-col gap-1'>{children}</div>
      </div>
    </div>
  )
}
