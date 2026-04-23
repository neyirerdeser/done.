import React, { useContext } from 'react'
import { AuthContext } from '../context/auth-context'

const MainPage = () => {
  const auth = useContext(AuthContext)

  return (
    <div className='h-full flex justify-center py-32 text-3xl text-base-100'>
      {auth.loggedIn &&
        <div className='flex flex-col items-center'>
          <diiv>create a new list to get started or</diiv>
          <diiv>click on an existing list to view it</diiv>
        </div>}
      {!auth.loggedIn && 'login to get started'}
    </div>

  )
}

export default MainPage