import { CalendarDays, StickyNote } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import api from "../lib/axios"

const ItemDetails = ({ item, setItem, closeModal }) => {
  const [title, setTitle] = useState(item.title)
  const [note, setNote] = useState(item.detail.note || "")
  const [dueDate, setDueDate] = useState(item.detail.dueDate ? item.detail.dueDate.slice(0,10) : "")
  const [completed, setCompleted] = useState(item.detail.completed)
  const [saving, setSaving] = useState(false)

  const editHandler = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const response = await api.patch(`/items/${item._id}`, {
        title, dueDate, completed, note
      })
      setItem(response.data.item)
      closeModal()
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      setSaving(false)
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
        <label className="textarea flex items-center gap-4">
          <StickyNote className="size-5 text-neutral/80 mr-0.5" />
          <input
            placeholder={note || "Add Note"}
            value={note}
            onChange={(event) => { setNote(event.target.value) }}
          />
        </label>
      </div>
      <div className='card-actions justify-end pt-4'>
        <button type='submit' disabled={saving} className='btn btn-outline btn-primary btn-ghost'>
          {saving ? "saving..." : "save"}
        </button>
      </div>
    </form>
  )


  return (
    <div className="p-4">
      {form}
    </div>
  )
}

export default ItemDetails