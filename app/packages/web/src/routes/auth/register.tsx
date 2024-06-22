import { type FC } from 'react'
import { Button } from '@nextui-org/react'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import { type IRegisterBody, useAuth } from '@/hooks'
import { Alert, InputPassword, InputText } from '@/components/ui'
import { IconGoogle, IconGithub } from '@/components/icons'

const Register: FC = () => {
  const { register, isLoading, error } = useAuth()
  const navigate = Route.useNavigate()
  const router = useRouter()

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries()) as unknown as IRegisterBody
    await register(data)
      .then(async () => {
        await router.invalidate()
        await navigate({ to: '/auth/welcome', search: { registration: 'success' } })
      })
      .catch()
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
          <IconGithub width={18} height={18} className='flex-shrink-0' />
          <span className='font-bold'>Github</span>
        </Button>
      </div>
      <p className='text-center text-sm mt-6 text-gray-600'>or continue with your data</p>
      <form onSubmit={handleSubmitForm} className='w-full mt-6 center gap-4 flex-col'>
        <InputText
          label='Username'
          name='username'
          required
          className='[&>div]:border-gray-300'
        />
        <InputText
          label='Name'
          name='name'
          required
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
        {error?.error &&
          <Alert
            variant='danger'
            title='Error'
            description={error.message}
          />
        }
        <Button
          className='w-full h-[45px] mt-2 bg-gray-700 border-gray-800 text-white'
          color="default"
          variant="bordered"
          type='submit'
          isLoading={isLoading}
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
