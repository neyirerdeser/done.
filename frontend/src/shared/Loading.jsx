import { LoaderIcon } from 'lucide-react'

// animate-spin ekle sonra LoaderIcon classname'e (basim dondu)

const Loading = () => {
  return (
    <div className='w-full flex flex-col items-center justify-center mt-20'>
      <LoaderIcon className='size-10 text-primary' />
      <p className='text-primary mt-6'>Loading...</p>
    </div>
  )
}

export default Loading