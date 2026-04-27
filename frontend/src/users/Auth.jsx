import { useContext, useState } from 'react'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { KeyRound, UserRound } from 'lucide-react'

import api from '../lib/axios.js'
import { AuthContext } from '../context/auth-context.js'


const Auth = () => {
    const auth = useContext(AuthContext)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [signup, setSignup] = useState(false)

    const navigate = useNavigate()

    const authSubmitHandler = async (event) => {
        event.preventDefault()
        if (username.length > 30) {
            toast.error("Username cannot be longer than 30 characters")
            return
        }
        setLoading(true)
        let response
        try {
            // first create if needed
            if (signup) await api.post(`/users/signup`, { username, password })
            // then login
            response = await api.post(`/users/login`, { username, password }) // returns userId, token
            auth.login(response.data.userId, response.data.token)
            navigate("/")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='h-full py-12 justify-items-center'>
            <form onSubmit={authSubmitHandler} className='w-auto'>
                <div className='form-control'>
                    <label className="input input-bordered flex items-center gap-1">
                        <UserRound className='size-4 text-neutral/80' />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(event) => { setUsername(event.target.value) }}
                        />
                    </label>
                    <div className='py-1'></div>
                    <label className="input input-bordered flex items-center gap-2">
                        <KeyRound className='size-4 text-neutral/80' />
                        <input
                            type="password"
                            placeholder='Password'
                            value={password}
                            onChange={(event) => { setPassword(event.target.value) }}
                        />
                    </label>
                </div>
                <div className='card-actions justify-center pt-4'>
                    <button type='submit' disabled={loading} className='btn btn-outline btn-primary btn-ghost w-20'>
                        {!signup && <div>{loading ? "logging in" : "login"}</div>}
                        {signup && <div>{loading ? "signing up" : "signup"}</div>}
                    </button>
                </div>
            </form>
            <div className='hover:text-primary/50 mt-2 text-primary underline' onClick={() => { setSignup(!signup) }}>
                {signup ? "Already have an account? Login instead." : "Don't have an account? Signup now!"}
            </div>
        </div>
    )
}

export default Auth