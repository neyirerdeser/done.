import { useEffect, useState } from "react"
import api from "../lib/axios"
import { useParams } from "react-router"
import Loading from "../shared/Loading"
import ItemCard from "../items/ItemCard"
import NewItem from "./NewItem"
import ListTitle from "../lists/ListTitle"

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
            }
        }
        fetchList()
    }, [listId])

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true)
            try {
                const response = await api.get(`/items/list/${listId}`)
                setItems(response.data.items)
            } catch (error) {
                setItems([])
            } finally {
                setLoading(false)
            }
        }
        fetchItems()
    }, [list])



    return (
        <div className="h-full">
            {list && <ListTitle list={list} setList={setList} />}
            <div className="">
                <NewItem setItems={setItems} list={list} />
                {loading && <Loading />}
                {!loading && items.length > 0 && items.map((item) => (
                    <ItemCard
                        key={item.id}
                        itemId={item}
                        setItems={setItems}
                    />
                ))}
            </div>
        </div>
    )
}

export default ListItems