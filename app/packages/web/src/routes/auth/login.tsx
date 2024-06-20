import { Button } from '@nextui-org/react'
import { Link, createFileRoute, useRouter } from '@tanstack/react-router'

import { Alert, InputPassword, InputText } from '@/components/ui'
import { IconGoogle, IconGithub } from '@/components/icons'
import { type ILoginBody, useAuth } from '@/hooks'

interface ILoginSearch {
  redirect: string
}

export const Route = createFileRoute('/auth/login')({
  validateSearch: (search: Record<string, string>): ILoginSearch => ({
    redirect: search.redirect
  }),
  component: () => <Login />
})

function Login () {
  const router = useRouter()
  const navigate = Route.useNavigate()
  const search = Route.useSearch()
  const { login, isLoading, error } = useAuth()

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries()) as ILoginBody
    login(data)
      .then(async () => {
        await router.invalidate()
        await navigate({ to: search.redirect ?? '/' })
      })
  }

  return (
    <div className='login w-full'>
      <div className="w-full gap-4 flex-col">
        <h1 className='text-3xl font-light'>Log in into your account</h1>
        <p className='text-sm text-gray-700 mt-2'>Welcome back! Select a method to log in</p>
      </div>
      <div className="w-full mt-10 flex items-center justify-center flex-col lg:flex-row gap-4">
        <Button className='w-full h-[45px]' color="default" variant="faded">
          <IconGoogle width={18} height={18} className='flex-shrink-0 mr-1' />
          <span className='font-bold'>Google</span>
        </Button>
        <Button className='w-full h-[45px]' color="default" variant="faded">
          <IconGithub width={18} height={18} className='flex-shrink-0' />
          <span className='font-bold'>Github</span>
        </Button>
      </div>
      <p className='text-center text-sm mt-6 text-gray-600'>or continue with username</p>
      <form onSubmit={handleSubmitForm} className='w-full mt-6 center gap-4 flex-col'>
        <InputText label='Username' name='username' className='[&>div]:border-gray-300' />
        <InputPassword name='password' className='[&>div]:border-gray-300' />
        <div className="w-full flex justify-end items-center">
          <span className='cursor-pointer font-bold'>Forgot your password?</span>
        </div>
        {error?.error &&
          <Alert
            variant='danger'
            title='Error'
            description={error.message}
          />
        }
        <Button
          className='w-full h-[45px] bg-gray-700 border-gray-800 text-white'
          color="default"
          variant="bordered"
          type='submit'
          isLoading={isLoading}
        >
          Log in
        </Button>
      </form>
      <div className="w-full flex gap-2 pt-8 center text-sm">
        <span>
          Dont&apos;t have an account?
        </span>
        {!isLoading && <Link to='/auth/register' className='font-bold'>Sign up!</Link>}
      </div>
    </div>
  )
}
