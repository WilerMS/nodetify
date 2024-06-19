import { type FC } from 'react'
import { Button } from '@nextui-org/react'
import { Link, createFileRoute } from '@tanstack/react-router'

import { InputPassword, InputText, Logo } from '@/components/ui'
import { IconGoogle, IconFacebook } from '@/components/icons'

const Login: FC = () => {
  return (
    <div className='w-full h-full flex bg-gray-700'>
      <main className='w-full h-full center'>
        <div className="w-full h-full lg:w-[500px] lg:h-[750px] flex flex-col bg-white p-10 lg:rounded-xl shadow-lg">
          <div className="w-full flex-shrink-0">
            <Logo className='h-[max-content]' />
          </div>
          <div className="w-full h-full center">
            <div className='w-full'>
              <div className="w-full gap-4 flex-col">
                <h1 className='text-3xl font-light'>Log in into your Account</h1>
                <p className='text-sm text-gray-700 mt-2'>Welcome back! Select a method to log in</p>
              </div>
              <div className="w-full mt-10 flex items-center justify-center flex-col lg:flex-row gap-4">
                <Button className='w-full h-[45px]' color="default" variant="solid">
                  <IconGoogle width={20} height={20} className='flex-shrink-0 mr-1' />
                  <span className='font-bold'>Google</span>
                </Button>
                <Button className='w-full h-[45px]' color="default" variant="solid">
                  <IconFacebook width={20} height={20} className='flex-shrink-0' />
                  <span className='font-bold'>Facebook</span>
                </Button>
              </div>
              <div className="w-full mt-6 text-gray-600 center">
                <p className='text-sm'>or continue with username</p>
              </div>
              <div className='w-full mt-6 center gap-4 flex-col'>
                <InputText label='Username' />
                <InputPassword />
                <div className="w-full flex justify-end items-center">
                  <Link to='/register' className='font-bold'>Forgot your password?</Link>
                </div>
                <Button
                  className='w-full h-[45px]'
                  color="default"
                  variant="faded"
                >
                  Log in
                </Button>
              </div>
              <div className="w-full flex gap-2 pt-8 center text-sm">
                <span>
                  Dont&apos;t have an account?
                </span>
                <Link to='/register' className='font-bold'>Click here!</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export const Route = createFileRoute('/(auth)/login')({
  component: () => <Login />
})
