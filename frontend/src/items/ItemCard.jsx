import { Trash2, X } from "lucide-react"
import api from "../lib/axios"
import { useState, useEffect, useContext } from "react"
import toast from 'react-hot-toast'
import ItemDetails from "./ItemDetails"
import Modal from "../shared/Modal"
import { AuthContext } from '../context/auth-context'

const ItemCard = ({ itemId, setItems }) => {
  const auth = useContext(AuthContext)
  const headers = { Authorization: "Bearer " + auth.token }
  const [item, setItem] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/items/${itemId}`, { headers })
        setItem(response.data.item)
        setCompleted(response.data.item.detail.completed)
      } catch (error) {
        setItem(null)
        toast.error(error.response.data.message)
      }
    }
    fetchItem()
    return () => {
      setItem(null)
    }
  }, [itemId, completed])

  const deleteHandler = async (event) => {
    event.preventDefault()
    setDetailsOpen(false)
    if (!window.confirm("Are you sure you'd like to delete this item? This cannot be undone.")) return
    try {
      await api.delete(`/items/${itemId}`, { headers })
      const response = await api.get(`/items/list/${item.list}`, { headers })
      setItems(response.data.items)
    } catch (error) {
      toast.error(error.response.data.message)
    }

  }

  const completeHandler = async (event) => {
    event.preventDefault()
    try {
      const response = await api.patch(`/items/${itemId}`, { completed: !completed }, { headers })
      setCompleted(!completed)
      setItem(response.data.item)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
  return (
    <div className="py-1 mr-1">
      {item &&
        <div>
          <div className={`${item.detail.completed ? "line-through text-neutral/80 bg-base-300" : "bg-base-200"} h-10 flex justify-between items-center hover:bg-base-100 p-1 mr-4 rounded-md`}>
            <input
              className="checkbox checkbox-sm border-neutral/80 bg-base-200 hover:bg-base-100 ml-1"
              type="checkbox"
              checked={completed}
              onChange={completeHandler}
            />
            <div onClick={() => { setDetailsOpen(true) }} className={`flex-1 mx-2`}>
              {item.title}
            </div>
            <button onClick={(e) => deleteHandler(e)} className='btn btn-sm btn-error btn-outline px-1.5 mx-1'>
              <Trash2 className='size-5 stroke-2' />
            </button>
          </div>

          <Modal open={detailsOpen} onClose={() => { setDetailsOpen(false) }} fgStyling='w-80 place-self-end'>
            <div className='mt-6 btn btn-ghost btn-sm px-0.5 mx-5 place-self-end' onClick={() => setDetailsOpen(false)}>
              <X className='size-5 text-primary' />
            </div>
            <ItemDetails item={item} setItem={setItem} closeModal={() => setDetailsOpen(false)} />
          </Modal>
        </div>}

    </div>
  )
}

export default ItemCard