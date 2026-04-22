import { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router'

import { useAuth } from "./hooks/auth-hook"
import { AuthContext } from "./context/auth-context"

import Loading from './components/Loading';
import SidePanel from './components/SidePanel';
import TitleBar from './components/TitleBar';
import Auth from './pages/Auth';
import { Menu } from 'lucide-react';
//import pages

const App = () => {
  const { token, userId, login, logout } = useAuth();
  let routes

  // if(token)
  //   routes = (
  //     <Routes>
  //       <Route path="/" element={<Homepage/>} exact />
  //       <Route path="/:lid" element={<List/>} exact />
  //       <Route path="/" element={<Page/>} exact />
  //       <Route path="/" element={<Page/>} exact />
  //       <Route path="/" element={<Page/>} exact />
  //       <Route path="/" element={<Page/>} exact />
  //       <Redirect to="/" />
  //     </Routes>
  // )
  // else
  //   routes = (
  //     <Routes>
  //       <Route path="/" element={<Homepage/>} exact />
  //       <Route path="/" element={<Page/>} exact />
  //       <Route path="/" element={<Page/>} exact />
  //       <Route path="/" element={<Page/>} exact />
  //       <Route path="/" element={<Page/>} exact />
  //       <Route path="/auth" element={<Auth/>} exact />
  //       <Redirect to="/auth" />
  //     </Routes>
  // )

  return (
    <div className="h-screen bg-base-300" data-theme="fantasy">
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token, // we're keeping the isLoggedIn for convenience
          token: token,
          userId: userId,
          login: login,
          logout: logout,
        }}>
        <Router>
          <TitleBar />
          <div className='h-full flex'>
            <div className='w-0 invisible md:visible md:w-72'>
              <SidePanel />
            </div>
            <div className='flex bg-primary/20 flex-1 md:rounded-tl-2xl'>
              <div className='visible md:invisible md:w-0 p-4'><Menu className='size-8 text-base-200' /></div>
              <div className='flex-1 h-full'>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
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