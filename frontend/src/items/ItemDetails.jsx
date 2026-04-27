import { CalendarDays, StickyNote } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import api from "../lib/axios"
import { useContext } from "react"
import { AuthContext } from '../context/auth-context'

const ItemDetails = ({ item, setItem }) => {
  const auth = useContext(AuthContext)
  const headers = { Authorization: "Bearer " + auth.token }
  const [title, setTitle] = useState(item.title)
  const [note, setNote] = useState(item.detail.note || "")
  const [dueDate, setDueDate] = useState(item.detail.dueDate ? item.detail.dueDate.slice(0, 10) : "")
  const [completed, setCompleted] = useState(item.detail.completed)

  const editHandler = async (event) => {
    event.preventDefault()

    if (title.length > 40) {
      toast.error("Task name cannot be longer than 40 characters")
      return
    }

    // check if theres something to save
    let titleChange = !(title === item.title)
    let dateChange = !(dueDate === (item.detail.dueDate ? item.detail.dueDate.slice(0, 10) : ""))
    let completedChange = !(completed === item.detail.completed)
    let noteChange = !(note === (item.detail.note ? item.detail.note : ""))

    let anyChange = titleChange || dateChange || completedChange || noteChange

    if (anyChange) {
      try {
        const response = await api.patch(`/items/${item._id}`, { title, dueDate, completed, note }, { headers })
        setItem(response.data.item)
        toast.success("task updated")
      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
      }
    }
  }

  const form = (
    <form onSubmit={editHandler} className='w-auto'>
      <div className='form-control'>
        <div className="flex items-center bg-base-100 rounded-lg">
          <input
            className="checkbox border-neutral/80 rounded-lg flex-0 bg-base-100 ml-3.5"
            type="checkbox"
            checked={completed}
            onChange={() => { setCompleted(!completed) }}
          />
          <label className="input flex flex-1 items-center">
            <input
              type="text"
              placeholder={title}
              value={title}
              onChange={(event) => { setTitle(event.target.value) }}
            />
          </label>
        </div>
        <div className='py-1'></div>
        <label className="input flex items-center gap-4">
          <CalendarDays className="size-5 text-neutral/80 mr-0.5" />
          <input
            type="date"
            value={dueDate}
            onChange={(event) => { setDueDate(event.target.value) }}
          />
        </label>
        <div className='py-1'></div>
        <label className="textarea flex  gap-4">
          <StickyNote className="flex-0 size-5 text-neutral/80 mr-0.5 mt-1" />
          <textarea
            placeholder={note || "Add Note"}
            value={note}
            onChange={(event) => { setNote(event.target.value) }}
            className="flex-1"
          />
        </label>
      </div>
      <div className='card-actions justify-end pt-4'>
      </div>
    </form>
  )


  return (
    <div onBlur={editHandler} className="p-4">
      {form}
    </div>
  )
}

export default ItemDetails