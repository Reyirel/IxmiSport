import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { logoutUser } from '../services/authService'
import { Menu, X, Home, Calendar, User, LogOut, LogIn, UserPlus, Settings } from 'lucide-react'
import '../styles/navbar.css'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { currentUser, userData } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await logoutUser()
      navigate('/')
      setIsOpen(false)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'Inicio', icon: Home, public: true },
    { path: '/reservar', label: 'Reservar', icon: Calendar, public: false },
    { path: '/perfil', label: 'Perfil', icon: User, public: false },
  ]

  const publicLinks = [
    { path: '/login', label: 'Iniciar sesión', icon: LogIn },
    { path: '/register', label: 'Registrarse', icon: UserPlus },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⚽</span>
          <span className="logo-text">ixmisport</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-menu-desktop">
          <div className="nav-links">
            {navLinks.map(({ path, label, icon: Icon, public: isPublic }) => (
              (!isPublic || !currentUser) && (currentUser || isPublic) && (
                <Link
                  key={path}
                  to={path}
                  className={`nav-link ${isActive(path) ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              )
            ))}
          </div>

          <div className="nav-actions">
            {currentUser ? (
              <>
                {userData?.isAdmin && (
                  <Link to="/admin" className="nav-link admin-badge">
                    <Settings size={18} />
                    <span>Admin</span>
                  </Link>
                )}
                <button onClick={handleLogout} className="btn-nav-logout">
                  <LogOut size={18} />
                  <span>Cerrar sesión</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  <LogIn size={18} />
                  <span>Iniciar sesión</span>
                </Link>
                <Link to="/register" className="btn-nav-primary">
                  <UserPlus size={18} />
                  <span>Registrarse</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="navbar-menu-mobile">
          <div className="mobile-links">
            {navLinks.map(({ path, label, icon: Icon, public: isPublic }) => (
              (!isPublic || !currentUser) && (currentUser || isPublic) && (
                <Link
                  key={path}
                  to={path}
                  className={`mobile-link ${isActive(path) ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              )
            ))}

            {currentUser ? (
              <>
                {userData?.isAdmin && (
                  <Link
                    to="/admin"
                    className="mobile-link"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings size={18} />
                    Panel Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="mobile-link logout"
                >
                  <LogOut size={18} />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="mobile-link"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn size={18} />
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="mobile-link primary"
                  onClick={() => setIsOpen(false)}
                >
                  <UserPlus size={18} />
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
