import { type FC } from 'react'
import { type IconProps } from './types'

export const IconFacebook: FC<IconProps> = ({
  width = 24,
  height = 24,
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="38.657999999999994 12.828 207.085 207.085"
      version="1.1"
      {...props}
    >
      <path
        d="M158.232 219.912v-94.461h31.707l4.747-36.813h-36.454V65.134c0-10.658 2.96-17.922 18.245-17.922l19.494-.009V14.278c-3.373-.447-14.944-1.449-28.406-1.449-28.106 0-47.348 17.155-47.348 48.661v27.149H88.428v36.813h31.788v94.461l38.016-.001z"
        fill="#000"
      />
    </svg>
  )
}
