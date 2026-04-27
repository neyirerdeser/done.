import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import api from '../lib/axios'
import { AuthContext } from '../context/auth-context';

import AuthButton from '../users/AuthButton';
import done from '../assests/done-purple.png'

const TitleBar = () => {
    const auth = useContext(AuthContext);
    const headers = { Authorization: "Bearer " + auth.token }
    const [username, setUsername] = useState("come on")

    useEffect(() => {
        const getUsername = async () => {
            if (auth.loggedIn) {
                try {
                    const res = await api.get(`/users/${auth.userId}`, { headers })
                    setUsername("welcome " + res.data.user.username)
                } catch (error) {
                    toast.error(error.response.data.message)
                }
            } else {
                setUsername("come on")
            }
        }
        getUsername()
    }, [auth])

    return (
        <div className='w-screen h-20 text-primary py-4 flex justify-between'>
            <AuthButton />
            <div className=' h-full flex px-8 '>
                <div className='place-self-center text-xl pr-4 pt-5 invisible md:visible'>{username}, time to get it</div>
                <img src={done} className='pt-1 text-primary' />
            </div>
        </div>
    )
}

export default TitleBar