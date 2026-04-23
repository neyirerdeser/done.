import { useContext, useState } from 'react'
import { AuthContext } from '../context/auth-context.js'
import UserSVG from '../assests/UserSVG.jsx.jsx'
import PasswordSVG from '../assests/PasswordSVG.jsx'
import api from '../lib/axios.js'
import { useNavigate } from 'react-router'


const Auth = () => {
    const auth = useContext(AuthContext)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const authSubmitHandler = async (event) => {
        event.preventDefault()
        setLoading(true)
        let response
        try {
            response = await api.post(`/users/login`, { username, password }) // returns userId, token
            auth.login(response.data.userId, response.data.token)
            navigate("/")
        } catch (error) {
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='h-full py-12 justify-items-center'>
            <form onSubmit={authSubmitHandler} className='w-auto'>
                <div className='form-control'>
                    <label className="input input-bordered flex items-center gap-1">
                        <UserSVG />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(event) => { setUsername(event.target.value) }}
                        />
                    </label>
                    <div className='py-1'></div>
                    <label className="input input-bordered flex items-center gap-2">
                        <PasswordSVG />
                        <input
                            type="password"
                            placeholder='Password'
                            value={password}
                            onChange={(event) => { setPassword(event.target.value) }}
                        />
                    </label>
                </div>
                <div className='card-actions justify-center pt-4'>
                    <button type='submit' disabled={loading} className='btn btn-outline btn-primary btn-ghost'>
                        {loading ? "logging in" : "login"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Auth