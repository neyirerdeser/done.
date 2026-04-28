import { useContext } from 'react'
import { CornerLeftUp } from 'lucide-react'
import { AuthContext } from '../../context/auth-context'


const EmptyArea = ({ textColor }) => {
  const auth = useContext(AuthContext)
  return (
    <div className='flex p-3 text-lg'>
      {auth.loggedIn && <div>
        <CornerLeftUp className={`${textColor} size-5`} />
        <div className={`${textColor} ml-2`}>
          so empty, let's fill it up
        </div>
      </div>}
    </div>
  )
}

export default EmptyArea