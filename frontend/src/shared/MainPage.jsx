import React, { useContext } from 'react'
import { AuthContext } from '../context/auth-context'

const MainPage = () => {
  const auth = useContext(AuthContext)

  return (
    <div className='h-full flex justify-center py-32 text-3xl text-base-100'>
      {auth.loggedIn && 'click on a list to view it'}
      {!auth.loggedIn && 'login to get started'}
    </div>
  )
}

export default MainPage