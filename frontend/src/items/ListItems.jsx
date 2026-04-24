import { useEffect, useState } from "react"
import api from "../lib/axios"
import { useParams } from "react-router"
import toast from 'react-hot-toast'

import Loading from "../shared/Loading"
import ItemCard from "../items/ItemCard"
import NewItem from "./NewItem"
import ListTitle from "../lists/ListTitle"
import EmptyArea from "../shared/EmptyArea"

const ListItems = () => {
    const listId = useParams().lid
    const [list, setList] = useState(null)
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchList = async () => {
            setLoading(true)
            try {
                const response = await api.get(`/lists/${listId}`)
                setList(response.data.list)
            } catch (error) {
                setList(null)
                if (error.status !== 404) toast.error(error.response.data.message)
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
                const response = await api.get(`/items/list/${listId}`)
                setItems(response.data.items)
            } catch (error) {
                setItems([])
                if (error.status !== 404) toast.error(error.response.data.message)
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
        <div className="h-full">
            {loading && <Loading />}
            {!loading && <div>
                {list && <ListTitle list={list} setList={setList} />}
                <NewItem setItems={setItems} list={list} />
                {items.length == 0 && <EmptyArea textColor={"text-base-100"} />}
                {items.length > 0 && items.map((item) => (
                    <ItemCard
                        key={item.id}
                        itemId={item}
                        setItems={setItems}
                    />
                ))}
            </div>}
        </div>
    )
}

export default ListItems