import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({children}) {
  const [worker, setWorker] = useState(() =>
  {
    const savedWorker = localStorage.getItem('worker')

    return savedWorker ? JSON.parse(savedWorker) : null
  })

  const [token, setToken] = useState(() =>
    localStorage.getItem('token')
  )

  const login = (loginResult) => {
    localStorage.setItem(
      'token',
      loginResult.token
    )

    localStorage.setItem(
      'worker',
      JSON.stringify(loginResult.worker)
    )

    setToken(loginResult.token)
    setWorker(loginResult.worker)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('worker')

    setToken(null)
    setWorker(null)
  }

  return (
    <AuthContext.Provider value={{ worker, token, isLoggedIn: !!token, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}
export function useAuth() {
  return useContext(AuthContext)
}