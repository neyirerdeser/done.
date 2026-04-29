import { useEffect, useState, useContext } from "react"
import { useNavigate, useParams } from "react-router"
import toast from 'react-hot-toast'

import api from "../../lib/axios"
import { AuthContext } from '../../context/auth-context'

import Loading from "../shared/Loading"
import ItemCard from "../items/ItemCard"
import NewItem from "./NewItem"
import ListTitle from "../lists/ListTitle"
import EmptyArea from "../shared/EmptyArea"

const ListItems = () => {
    console.log('render')
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
                console.log('fetch list', response.data)
                setList(response.data.list)
            } catch (error) {
                setList(null)
                toast.error(error.response.data.message)
            } finally {
                setLoading(false)
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
                console.log('fetch items',response.data)
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
        <div className="h-full w-full pb-48 justify-items-center">
            <div className="w-1/2 -ml-6">{!loading && list && <ListTitle list={list} setList={setList} />}</div>
            <div className="h-full w-full justify-items-center overflow-y-auto ">
                <div className="w-1/2">
                    {loading && <Loading />}
                    {!loading && <div>
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
            </div>
        </div>
    )
}

export default ListItems