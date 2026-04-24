import { PlusIcon } from 'lucide-react'
import { useContext, useState } from 'react'
import { setLists } from '../lib/listSlice'

import toast from 'react-hot-toast'

import api from '../lib/axios'
import { AuthContext } from '../context/auth-context'
import { useDispatch } from 'react-redux'

const NewList = () => {
  const auth = useContext(AuthContext)
  const [title, setTitle] = useState("")
  const dispatch = useDispatch()

  const listSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      await api.post("/lists", { title, creator: auth.userId })
      const response = await api.get(`/lists/user/${auth.userId}`)
      setTitle("")
      dispatch(setLists(response.data.lists))
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className='py-1 mr-1'>
      <div className='h-10 flex justify-between items-center hover:bg-base-300 p-1 rounded-md'>
        <PlusIcon className='size-5 mx-1' />
        <div className='flex-1 mx-2'>
          <form onSubmit={listSubmitHandler}>
            <div className='form-control'>
              <label className="flex items-center">
                <input
                  type="text"
                  placeholder="New List"
                  value={title}
                  onChange={(event) => { setTitle(event.target.value) }}
                  className='bg-base-200 hover:bg-base-300'
                />
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewList