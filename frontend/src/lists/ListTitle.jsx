import { useState, useContext } from "react"
import api from "../lib/axios"
import toast from 'react-hot-toast'

import { AuthContext } from '../context/auth-context'

const ListTitle = ({ list, setList }) => {
    const auth = useContext(AuthContext)
    const headers = { Authorization: "Bearer " + auth.token }

    const [title, setTitle] = useState(list.title)

    const titleEditHandler = async (event) => {
        event.preventDefault()
        if (title.trim() === "") {
            toast.error("title cannot be left empty")
            setTitle(list.title)
            return
        }
        try {
            const response = await api.patch(`/lists/${list._id}`,
                { title }, { headers }
            )
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
                                placeholder="enter list title..."
                                value={title}
                                onChange={(event) => { setTitle(event.target.value) }}
                                onBlur={titleEditHandler}
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