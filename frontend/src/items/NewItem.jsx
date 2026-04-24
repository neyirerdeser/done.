import { PlusIcon } from 'lucide-react'
import { useState, useContext } from 'react'
import toast from 'react-hot-toast'
import api from '../lib/axios'

import { AuthContext } from '../context/auth-context'


const NewItem = ({ list, setItems }) => {
    const auth = useContext(AuthContext)
    const headers = { Authorization: "Bearer " + auth.token }
    const [title, setTitle] = useState("")

    const itemSubmitHandler = async (event) => {
        event.preventDefault()
        try {
            await api.post("/items", { title, list }, { headers })
            const response = await api.get(`/items/list/${list._id}`, { headers })
            setTitle("")
            setItems(response.data.items)
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    return (
        <div className='py-1 mr-1 '>
            <div className='h-10 flex justify-between items-center bg-base-200 hover:bg-base-100 p-1 mr-4 rounded-md'>
                <PlusIcon className='size-5 mx-1' />
                <div className='flex-1 mx-2'>
                    <form onSubmit={itemSubmitHandler}>
                        <div className='form-control'>
                            <label className="flex items-center">
                                <input
                                    type="text"
                                    placeholder="New Item"
                                    value={title}
                                    onChange={(event) => { setTitle(event.target.value) }}
                                    className='bg-base-200 hover:bg-base-100'
                                />
                            </label>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default NewItem