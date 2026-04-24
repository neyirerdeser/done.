import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import api from '../lib/axios'
import Loading from '../shared/Loading'
import { AuthContext } from '../context/auth-context'
import LoginPromt from '../users/LoginPromt'
import ListCard from './ListCard'
import NewList from './NewList'
import EmptyArea from '../shared/EmptyArea'
import { useDispatch, useSelector } from 'react-redux'
import { setLists } from '../lib/listSlice'


const SidePanel = () => {
  const [loading, setLoading] = useState(false)
  const auth = useContext(AuthContext)
  const headers = { Authorization: "Bearer " + auth.token }
  const lists = useSelector((state) => state.lists)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchLists = async () => {
      if (auth.loggedIn) {
        setLoading(true)
        try {
          const res = await api.get(`/lists/user/${auth.userId}`, { headers })
          dispatch(setLists(res.data.lists))
        } catch (error) {
          if (error.status !== 404) toast.error(error.response.data.message)
        } finally {
          setLoading(false)
        }
      } else {
        dispatch(setLists([]))
      }
    }
    fetchLists()
    // decided against cleanup here for loading speeds
  }, [auth])

  return (
    <div className='h-full mx-2 bg-base-200'>
      {auth.loggedIn && <NewList />}
      {loading && <Loading />}
      {!loading && !auth.loggedIn && <LoginPromt />}
      {!loading && lists.length === 0 && <EmptyArea textColor={"text-neutral"} />}
      {!loading && lists && lists.map((list) => (
        <ListCard
          key={list._id}
          list={list}
        />
      ))}
    </div>
  )
}

export default SidePanel