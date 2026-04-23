import { useState } from "react"
import api from "../lib/axios"
import toast from 'react-hot-toast'

const ListTitle = ({ list, setList }) => {
    const [title, setTitle] = useState(list.title)

    const titleEditHandler = async (event) => {
        event.preventDefault()
        try {
            const response = await api.patch(`/lists/${list._id}`,{title})
            setList(response.data.list)
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    return (
        <div className="text-3xl font-bold py-2 my-4 mr-5 rounded-md hover:bg-primary/5">
            <div className='ml-2'>
                <form onSubmit={titleEditHandler}>
                    <div className='form-control'>
                        <label className="flex items-center">
                            <input
                                type="text"
                                placeholder="New Item"
                                value={title}
                                onChange={(event) => { setTitle(event.target.value) }}
                                className='bg-transparent'
                            />
                        </label>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ListTitle