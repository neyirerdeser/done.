import React, { useEffect, useState } from 'react'
import api from '../lib/axios'
import Loading from './Loading'
import { PlusIcon } from 'lucide-react'


const SidePanel = () => {
  // const userId = useParams().uid;
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await api.get(`/lists`)
        setLists(res.data)
      } catch (error) {
      } finally {
        setLoading(false)
      }
      fetchLists()
    }
  }, [])

  return (
    <div>
      <div></div>
      {loading && <Loading />}

    </div>
  )
}

export default SidePanel