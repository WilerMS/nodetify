import { type FC } from 'react'
import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { IconBell } from '@tabler/icons-react'

const WelcomeMessage: FC = () => (
  <div className="w-full h-[600px]">
    <div className="center mb-8">
      <div className='bg-black w-[120px] h-[120px] center rounded-2xl'>
        <IconBell className='text-white -rotate-12' size={90} stroke={1.5}/>
      </div>
    </div>
    <h1 className='text-3xl'>Welcome to <strong>Nodetify!</strong></h1>
    <p className='mt-2 font-light text-justify'>We are thrilled to have you on board. Our platform is designed to help you seamlessly manage alarms for your SQL databases, ensuring you never miss an important update or alert.</p>
    <p className='mt-4 mb-1 text-xl'><strong>Getting Started:</strong></p>
    <ul className='list-disc pl-6 font-light'>
      <li>Explore our features to create, manage, and monitor your database alarms efficiently.</li>
      <li>Access detailed reports and analytics to stay on top of your data.</li>
    </ul>
    <p className='mt-4 font-light'>If you have any questions or need assistance, feel free to reach out to our support team.</p>
    <div className="center mt-10 mb-2">
      <Link
        to='/auth/login'
        search={{ redirect: '/' }}
        className="font-bold hover:scale-105 transition-all"
      >
        Go back to Login
      </Link>
    </div>
  </div>
)

export const Route = createFileRoute('/auth/welcome')({
  validateSearch: (search: Record<string, string>): { registration?: 'success' } => ({
    registration: search.registration as 'success'
  }),
  beforeLoad: ({ search }) => {
    if (search.registration !== 'success') {
      throw redirect({
        to: '/auth/login',
        search: { redirect: '/' }
      })
    }
  },
  component: () => <WelcomeMessage />
})
