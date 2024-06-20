import { type FC } from 'react'
import { Button } from '@nextui-org/react'
import { createFileRoute } from '@tanstack/react-router'

import { InputPassword, InputText } from '@/components/ui'
import { IconGoogle, IconFacebook } from '@/components/icons'

const Register: FC = () => {
  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    console.log({ data })
  }

  return (
    <div className='w-full'>
      <div className="w-full gap-4 flex-col">
        <h1 className='text-3xl font-light'>Welcome to Nodetify</h1>
        <p className='text-sm text-gray-700 mt-2'>Sign up with your social networks.</p>
      </div>
      <div className="w-full mt-6 flex items-center justify-center flex-col lg:flex-row gap-4">
        <Button className='w-full h-[45px]' color="default" variant="faded">
          <IconGoogle width={18} height={18} className='flex-shrink-0 mr-1' />
          <span className='font-bold'>Google</span>
        </Button>
        <Button className='w-full h-[45px]' color="default" variant="faded">
          <IconFacebook width={18} height={18} className='flex-shrink-0' />
          <span className='font-bold'>Facebook</span>
        </Button>
      </div>
      <p className='text-center text-sm mt-6 text-gray-600'>or continue with your data</p>
      <form onSubmit={handleSubmitForm} className='w-full mt-6 center gap-4 flex-col'>
        <InputText
          label='Username'
          name='username'
          required
          placeholder='john_doe@example.com'
          className='[&>div]:border-gray-300'
        />
        <InputText
          label='Email'
          name='email'
          type='email'
          required
          placeholder='john_doe@example.com'
          className='[&>div]:border-gray-300'
        />
        <InputPassword
          name='password'
          required
          className='[&>div]:border-gray-300'
        />
        <InputPassword
          name='repeat-password'
          label='Repeat password'
          required
          className='[&>div]:border-gray-300'
        />
        <Button
          className='w-full h-[45px] mt-2 bg-gray-700 border-gray-800 text-white'
          color="default"
          variant="bordered"
          type='submit'
        >
          Sign up
        </Button>
      </form>
    </div>
  )
}

export const Route = createFileRoute('/auth/register')({
  component: () => <Register />
})
