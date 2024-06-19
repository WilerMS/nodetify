import React, { type FC } from 'react'
import cn from 'classnames'
import { Input, type InputProps } from '@nextui-org/react'
import { IconEye, IconEyeFilled } from '@tabler/icons-react'

export const InputText: FC<InputProps> = ({
  variant = 'bordered',
  className,
  ...props
}) => {
  return (
    <Input
      type='text'
      variant={variant}
      className={cn('w-full', className)}
      {...props}
    />
  )
}

export const InputPassword: FC<InputProps> = ({
  label = 'Password',
  variant = 'bordered',
  className,
  ...props
}) => {
  const [isVisible, setIsVisible] = React.useState(false)

  const toggleVisibility = () => setIsVisible(!isVisible)

  return (
    <Input
      label={label}
      variant={variant}
      endContent={
        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
          {isVisible
            ? <IconEye className="text-2xl text-default-400 pointer-events-none" />
            : <IconEyeFilled className="text-2xl text-default-400 pointer-events-none" />
          }
        </button>
      }
      type={isVisible ? 'text' : 'password'}
      className={cn('w-full', className)}
      {...props}
    />
  )
}
