import { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { PlusIcon } from 'lucide-react'
import toast from 'react-hot-toast'

import api from '../../lib/axios'
import { setLists } from '../../lib/listSlice'
import { AuthContext } from '../../context/auth-context'

const NewList = () => {
  const auth = useContext(AuthContext)
  const headers = { Authorization: "Bearer " + auth.token }
  const [title, setTitle] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const listSubmitHandler = async (event) => {
    event.preventDefault()
    if (title.length > 20) {
      toast.error("List name cannot be longer than 20 characters")
      return
    }
    if (title.trim() === "") {
      toast.error("Title cannot be left empty")
      setTitle("")
      return
    }
    try {
      const listRes = await api.post("/lists",
        { title, creator: auth.userId }, { headers })
      const response = await api.get(`/lists/user/${auth.userId}`, { headers })
      setTitle("")
      dispatch(setLists(response.data.lists))
      navigate(`/list/${listRes.data.list._id}`)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className='py-1 mr-1'>
      <div className='group h-10 flex justify-between items-center hover:bg-base-300 p-1 rounded-md'>
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
                  className='bg-base-200 group-hover:bg-base-300'
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