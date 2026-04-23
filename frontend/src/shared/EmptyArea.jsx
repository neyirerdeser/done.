import { CornerLeftUp } from 'lucide-react'

const EmptyArea = ({textColor}) => {
  return (
    <div className='flex p-3 text-lg'>
        <CornerLeftUp className={`${textColor} size-5`}/>
        <div className={`${textColor} ml-2`}>
            so empty, let's fill it up
        </div>
    </div>
  )
}

export default EmptyArea