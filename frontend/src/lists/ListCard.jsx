import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'
import Icon from '../shared/Icon'
import api from '../lib/axios'
import { Link } from 'react-router'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/auth-context'

// TODO fix/remove backgounrd colouring when selected

const ListCard = ({ list, setLists }) => {
  const auth = useContext(AuthContext)

  const deleteHandler = async (event, id) => {
    event.preventDefault()
    if(!window.confirm("Are you sure you'd like to delete this list? This cannot be undone.")) return
    try {
      await api.delete(`/lists/${id}`)
      const response = await api.get(`/lists/user/${auth.userId}`)
      setLists(response.data.lists)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className='py-1 mr-1'>
      <Link to={`/list/${list._id}`} className='h-10 flex justify-between items-center hover:bg-base-300 disabled:bg-base-300 p-1 rounded-md'>
        <Icon name={list.iconName} className='size-5 mx-1' />
        <div className='flex-1 mx-2'>
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