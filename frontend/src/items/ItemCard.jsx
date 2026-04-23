import { Circle, Trash2, X } from "lucide-react"
import api from "../lib/axios"
import { useState, useEffect } from "react"
import toast from 'react-hot-toast'
import ItemDetails from "./ItemDetails"
import Modal from "../shared/Modal"

const ItemCard = ({ itemId, setItems }) => {
    const [item, setItem] = useState(null)
    const [detailsOpen, setDetailsOpen] = useState(false)

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await api.get(`/items/${itemId}`)
                setItem(response.data.item)
            } catch (error) {
                if (error.status !== 404) toast.error(error.response.data.message)
            }
        }
        fetchItem()
    }, [itemId])

    const deleteHandler = async (event) => {
        event.preventDefault()
        setDetailsOpen(false)
        if (!window.confirm("Are you sure you'd like to delete this item? This cannot be undone.")) return
        try {
            await api.delete(`/items/${itemId}`)
            const response = await api.get(`/items/list/${item.list}`)
            setItems(response.data.items)
        } catch (error) {
            if (error.status !== 404) toast.error(error.response.data.message)
        }
    }

    return (
        <div className="py-1 mr-1">
            <div className="bg-base-200 h-10 flex justify-between items-center hover:bg-base-100 disabled:bg-base-300 p-1 mr-4 rounded-md">
                <Circle className='size-5 mx-1' />
                <div onClick={() => { setDetailsOpen(true) }} className='flex-1 mx-2'>
                    {item && item.title}
                </div>
                <button onClick={(e) => deleteHandler(e)} className='btn btn-sm btn-error btn-outline px-1.5 mx-1'>
                    <Trash2 className='size-5 stroke-2' />
                </button>
            </div>
            {detailsOpen &&
                <Modal onClose={() => { setDetailsOpen(false) }} fgStyling='w-80 place-self-end'>
                    <div className='mt-6 btn btn-ghost btn-sm px-0.5 mx-5 place-self-end' onClick={() => setDetailsOpen(false)}>
                        <X className='size-5 text-primary' />
                    </div>
                    <ItemDetails item={item} setItem={setItem} closeModal={() => setDetailsOpen(false)} />
                </Modal>}
        </div>
    )
}

export default ItemCard