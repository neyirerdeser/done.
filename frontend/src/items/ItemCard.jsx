import { Circle, Trash2 } from "lucide-react"
import api from "../lib/axios"
import { useState, useEffect } from "react"

const ItemCard = ({ itemId, setItems }) => {
    const [item, setItem] = useState(null)

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await api.get(`/items/${itemId}`)
                setItem(response.data.item)
            } catch (error) { }
        }
        fetchItem()
    }, [itemId])

    const deleteHandler = async (event) => {
        event.preventDefault()
        if (!window.confirm("Are you sure you'd like to delete this item? This cannot be undone.")) return
        try {
            await api.delete(`/items/${itemId}`)
            const response = await api.get(`/items/list/${item.list}`)
            setItems(response.data.items)
        } catch (error) { }
    }
    return (
        <div className="py-1 mr-1">
            <div className="bg-base-200 h-10 flex justify-between items-center hover:bg-base-100 disabled:bg-base-300 p-1 rounded-md">
                <Circle className='size-5 mx-1' />
                <div className='flex-1 mx-2'>
                    {item && item.title}
                </div>
                <button onClick={(e) => deleteHandler(e)} className='btn btn-sm btn-error btn-outline px-1.5 mx-1'>
                    <Trash2 className='size-5 stroke-2' />
                </button>
            </div>
        </div>
    )
}

export default ItemCard