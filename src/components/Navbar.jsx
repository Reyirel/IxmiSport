import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { logoutUser } from '../services/authService'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { currentUser, userData } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logoutUser()
      navigate('/')
      setIsOpen(false)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold">
              ixmisport
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Inicio
              </Link>
              {currentUser ? (
                <>
                  <Link
                    to="/reservar"
                    className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Reservar
                  </Link>
                  <Link
                    to="/perfil"
                    className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Perfil
                  </Link>
                  {userData?.isAdmin && (
                    <Link
                      to="/admin"
                      className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium bg-purple-600"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/register"
                    className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Inicio
            </Link>
            {currentUser ? (
              <>
                <Link
                  to="/reservar"
                  className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Reservar
                </Link>
                <Link
                  to="/perfil"
                  className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Perfil
                </Link>
                {userData?.isAdmin && (
                  <Link
                    to="/admin"
                    className="bg-purple-600 hover:bg-purple-700 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
