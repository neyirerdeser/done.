import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import api from '../lib/axios'
import Loading from '../shared/Loading'
import { AuthContext } from '../context/auth-context'
import LoginPromt from '../users/LoginPromt'
import ListCard from './ListCard'
import NewList from './NewList'
import EmptyArea from '../shared/EmptyArea'


const SidePanel = () => {
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(false)
  const auth = useContext(AuthContext)

  useEffect(() => {
    const fetchLists = async () => {
      if (auth.loggedIn) {
        setLoading(true)
        try {
          const res = await api.get(`/lists/user/${auth.userId}`)
          setLists(res.data.lists)
        } catch (error) {
          if(error.status!==404) toast.error(error.response.data.message)
        } finally {
          setLoading(false)
        }
      } else {
        setLists([])
      }
    }
    fetchLists()
  }, [auth])

  return (
    <div className='h-full mx-2 bg-base-200'>
      {auth.loggedIn && <NewList setLists={setLists} />}
      {loading && <Loading />}
      {!loading && !auth.loggedIn && <LoginPromt />}
      {!loading && lists.length === 0 && <EmptyArea textColor={"text-neutral"}/>}
      {!loading && lists && lists.map((list) => (
        <ListCard
          key={list.id}
          list={list}
          setLists={setLists}
        />
      ))}
    </div>
  )
}

export default SidePanel