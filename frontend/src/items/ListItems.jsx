import { useEffect, useState, useContext } from "react"
import api from "../lib/axios"
import { useNavigate, useParams } from "react-router"
import toast from 'react-hot-toast'

import { AuthContext } from '../context/auth-context'
import Loading from "../shared/Loading"
import ItemCard from "../items/ItemCard"
import NewItem from "./NewItem"
import ListTitle from "../lists/ListTitle"
import EmptyArea from "../shared/EmptyArea"

const ListItems = () => {
    const listId = useParams().lid
    const auth = useContext(AuthContext)
    const headers = { Authorization: "Bearer " + auth.token }
    const [list, setList] = useState(null)
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchList = async () => {
            setLoading(true)
            try {
                const response = await api.get(`/lists/${listId}`, { headers })
                setList(response.data.list)
            } catch (error) {
                setList(null)
                toast.error(error.response.data.message)
            }
        }
        fetchList()
        return () => {
            setList(null)
        }
    }, [listId])

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true)
            try {
                const response = await api.get(`/items/list/${listId}`, { headers })
                setItems(response.data.items)
            } catch (error) {
                setItems([])
                toast.error(error.response.data.message)
                navigate("/")
            } finally {
                setLoading(false)
            }
        }
        fetchItems()
        return () => {
            setItems([])
        }

    }, [list])



    return (
        <div className="h-full overflow-y-auto">
            {loading && <Loading />}
            {!loading && <div>
                {list && <ListTitle list={list} setList={setList} />}
                <NewItem setItems={setItems} list={list} />
                {items.length == 0 && <EmptyArea textColor={"text-base-100"} />}
                {items.length > 0 && items.map((item) => (
                    <ItemCard
                        key={item}
                        itemId={item}
                        setItems={setItems}
                    />
                ))}
            </div>}
        </div>
    )
}

export default ListItems