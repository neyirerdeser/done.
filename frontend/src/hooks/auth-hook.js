import { useCallback, useEffect, useState } from "react"


let logoutTimer

export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [tokenExpiry, setTokenExpiry] = useState()

  const login = useCallback((uid, token, expiryDate) => {
    const tokenExpiryDate = expiryDate || new Date(new Date().getTime() + 60 * 60 * 1000) // 1hr    
    setToken(token)
    setUserId(uid)
    setTokenExpiry(tokenExpiryDate)


    localStorage.setItem("userData", JSON.stringify({
      userId: uid,
      token,
      expiry: tokenExpiryDate.toISOString()
    }))

  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    setTokenExpiry(null)
    localStorage.removeItem("userData")
  }, [])

  useEffect(() => {
    const cache = JSON.parse(localStorage.getItem("userData"))
    if (cache && cache.token && new Date(cache.expiry) > new Date())
      login(cache.userId, cache.token, new Date(cache.expiry))
  }, [login])

  useEffect(() => {
    if (token && tokenExpiry) {
      const remainingTime = tokenExpiry.getTime() - new Date().getTime()
      logoutTimer = setTimeout(logout, remainingTime)
    } else {
      clearTimeout(logoutTimer)
    }
  }, [token, logout, tokenExpiry])

  return { token, userId, login, logout }
}