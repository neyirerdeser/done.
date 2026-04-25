import { LogOut, UserRoundKey } from 'lucide-react'
import { useContext } from 'react';
import { AuthContext } from '../context/auth-context';
import { Link, useNavigate } from 'react-router';


const AuthButton = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate()

  const logoutHandler = () => {
    auth.logout()
    navigate("/auth")
  }

  return (
    <div className='btn btn-ghost pt-2 ml-3 w-14'>
      {!auth.loggedIn && (<Link to={"/auth"}><UserRoundKey className='size-10' /></Link>)}
      {auth.loggedIn && (<button onClick={logoutHandler}><LogOut className='size-10' /></button>)}
    </div>
  )
}

export default AuthButton