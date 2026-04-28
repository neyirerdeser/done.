import { LoaderIcon } from 'lucide-react'

const Loading = () => {
  return (
    <div className='w-full flex flex-col items-center justify-center mt-20'>
      <LoaderIcon className='animate-spin size-10 text-primary' />
      <p className='text-primary mt-6'>Loading...</p>
    </div>
  )
}

export default Loading