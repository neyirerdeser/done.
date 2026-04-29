import { useContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { Trash2 } from 'lucide-react'

import { AuthContext } from '../../context/auth-context'
import api from '../../lib/axios'
import { setLists } from '../../lib/listSlice'

import Icon from '../shared/Icon'

const ListCard = ({ list }) => {
  const auth = useContext(AuthContext)
  const headers = { Authorization: "Bearer " + auth.token }
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const viewingList = window.location.href.split("list/")[1]

  const deleteHandler = async (event, id) => {
    event.preventDefault()
    if (!window.confirm("Are you sure you'd like to delete this list? This cannot be undone.")) return
    try {
      await api.delete(`/lists/${id}`, { headers })
      const response = await api.get(`/lists/user/${auth.userId}`, { headers })
      dispatch(setLists(response.data.lists))
      if (id == viewingList)
        navigate("/")
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className='py-1 mr-1'>
      <Link to={`/list/${list._id}`} className='h-10 flex justify-between items-center hover:bg-base-300 disabled:bg-base-300 p-1 rounded-md'>
        <Icon name={list.iconName} className='size-5 mx-1' />
        <div data-testid="list-card" className='flex-1 mx-2'>
          {list.title}
        </div>
        <button onClick={(e) => deleteHandler(e, list._id)} className='btn btn-sm btn-error btn-outline px-1.5 mx-1'>
          <Trash2 className='size-5 stroke-2' />
        </button>
      </Link>
    </div>
  )
}

export default ListCard