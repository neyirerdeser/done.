import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router'

import { useAuth } from "./hooks/auth-hook"
import { AuthContext } from "./context/auth-context"

import SidePanel from './lists/SidePanel';
import TitleBar from './shared/TitleBar';
import Auth from './users/Auth';
import MainPage from './shared/MainPage';
import ListItems from './items/ListItems';
import Hamburger from './shared/Hamburger';

const App = () => {
  const { token, userId, login, logout } = useAuth();

  return (
    <div className="position-absolute overflow-clip bg-base-200" data-theme="fantasy">
      <AuthContext.Provider
        value={{
          loggedIn: !!token, // we're keeping the loggedIn for convenience
          token: token,
          userId: userId,
          login: login,
          logout: logout,
        }}>
        <Router>
          <TitleBar />
          <div className='h-svh flex'>
            <div className='w-0 invisible md:visible md:w-72'>
              <div className='mb-6'></div>
              <SidePanel />
            </div>
            <div className='flex bg-primary/20 flex-1 md:rounded-tl-2xl'>
              <div className='visible md:invisible md:w-0 p-3'>
                <Hamburger />
              </div>
              <div className='h-full flex-1'>
                <Routes>
                  <Route path="/" element={<MainPage />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/list/:lid" element={token ? <ListItems /> : <Auth />} />
                </Routes>
              </div>
            </div>
          </div>
        </Router>

      </AuthContext.Provider>
    </div>
  )
}

export default App