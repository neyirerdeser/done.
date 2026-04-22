import { LogOut, UserRoundKey } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import api from '../lib/axios'
import { AuthContext } from '../context/auth-context';
import { Link } from 'react-router';
import Auth from '../pages/Auth';

const TitleBar = () => {
    const auth = useContext(AuthContext);
    const [username, setUsername] = useState("come on")

    useEffect(() => {
        const getUsername = async () => {
            if (auth.isLoggedIn) {
                try {
                    const res = await api.get(`/users/${auth.userId}`)
                    setUsername(res.data.username)
                } catch (error) {}
            }
            getUsername()
        }
    }, [auth])


    return (
        <div className='w-screen h-20 text-primary py-4 flex justify-between'>
            {!auth.isLoggedIn && (
                <Link to={"/auth"} className='btn btn-ghost pt-2'><UserRoundKey className='size-10' /></Link>
            )}
            {auth.isLoggedIn && (
                <button onClick={auth.logout} className='btn btn-ghost pt-2'><LogOut className='size-10' /></button>
            )}
            <div className=' h-full flex px-8 '>
                <div className='place-self-center text-xl pr-4 pt-6 invisible md:visible'>{username}, time to get it</div>
                <div className='text-5xl'>done.</div>
            </div>
        </div>
    )
}

export default TitleBar