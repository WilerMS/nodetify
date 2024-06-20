import cn from 'classnames'
import { type FC } from 'react'

interface AlertProps {
  icon?: JSX.Element
  title?: string
  variant: 'info' | 'danger' | 'success' | 'warning' | 'dark'
  description?: string | JSX.Element | JSX.Element[]
  className?: string
}

const VARIANTS_STYLES = {
  info: 'py-1 px-4 text-blue-800 border border-blue-300 rounded-lg bg-blue-50',
  danger: 'py-1 px-4 text-red-800 border border-red-300 rounded-lg bg-red-50',
  success: 'py-1 px-4 text-green-800 border border-green-300 rounded-lg bg-green-50',
  warning: 'py-1 px-4 text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50',
  dark: 'py-1 px-4 border border-gray-300 rounded-lg bg-gray-50'
}

export const Alert: FC<AlertProps> = ({
  icon,
  title,
  variant,
  description,
  className
}) => {
  return (
    <div
      className={cn(VARIANTS_STYLES[variant], 'w-full flex flex-col', className)}
      role="alert"
    >
      {!!title &&
        <div className="flex gap-4 items-center">
          {icon}
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      }

      {!!description &&
        <div className={cn('text-sm')}>
          {description}
        </div>
      }
    </div>
  )
}
