import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { logoutUser } from '../services/authService'
import { 
  Menu, 
  X, 
  Home, 
  Calendar, 
  User, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Settings, 
  ChevronRight, 
  LayoutDashboard,
  Users,
  MapPin,
  BarChart3
} from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [adminMenuOpen, setAdminMenuOpen] = useState(false)
  const { currentUser, userData } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
    setAdminMenuOpen(false)
  }, [location.pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

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

  // Admin sub-menu items
  const adminLinks = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, hash: '' },
    { path: '/admin', label: 'Reservas', icon: Calendar, hash: 'reservas' },
    { path: '/admin', label: 'Usuarios', icon: Users, hash: 'usuarios' },
    { path: '/admin', label: 'Canchas', icon: MapPin, hash: 'canchas' },
  ]

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' 
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            
            {/* Logo */}
            <Link 
              to="/" 
              className="group flex items-center gap-2.5 transition-transform duration-300 hover:scale-[1.02]"
            >
              <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">
                ⚽
              </span>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                ixmi<span className="text-emerald-600">sport</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ path, label, icon: Icon, public: isPublic }) => (
                (!isPublic || !currentUser) && (currentUser || isPublic) && (
                  <Link
                    key={path}
                    to={path}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive(path)
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} strokeWidth={2} />
                    <span>{label}</span>
                    {isActive(path) && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full" />
                    )}
                  </Link>
                )
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {currentUser ? (
                <>
                  {userData?.isAdmin && (
                    <div className="relative">
                      <button 
                        onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border transition-all duration-300 ${
                          location.pathname === '/admin'
                            ? 'text-emerald-700 bg-emerald-100 border-emerald-300'
                            : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
                        }`}
                      >
                        <Settings size={16} />
                        <span>Admin</span>
                        <ChevronRight size={14} className={`transition-transform duration-200 ${adminMenuOpen ? 'rotate-90' : ''}`} />
                      </button>
                      
                      {/* Admin Dropdown */}
                      {adminMenuOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setAdminMenuOpen(false)} 
                          />
                          <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-3 py-2 border-b border-gray-100 mb-1">
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Panel Admin</p>
                            </div>
                            {adminLinks.map((link, idx) => (
                              <Link
                                key={idx}
                                to={link.path}
                                onClick={() => setAdminMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                              >
                                <link.icon size={16} />
                                <span>{link.label}</span>
                              </Link>
                            ))}
                            <div className="border-t border-gray-100 mt-1 pt-1">
                              <Link
                                to="/admin"
                                onClick={() => setAdminMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 font-medium transition-colors"
                              >
                                <BarChart3 size={16} />
                                <span>Ver estadísticas</span>
                              </Link>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300"
                  >
                    <LogOut size={16} />
                    <span>Salir</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all duration-300"
                  >
                    <span>Iniciar sesión</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <span>Registrarse</span>
                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-full transition-all duration-300"
              aria-label="Toggle menu"
            >
              <span className={`absolute transition-all duration-300 ${isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}>
                <Menu size={22} strokeWidth={2} />
              </span>
              <span className={`absolute transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}>
                <X size={22} strokeWidth={2} />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-[280px] bg-white z-50 lg:hidden shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="text-lg font-bold text-gray-900">
            Menú
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="flex flex-col h-[calc(100%-65px)] overflow-y-auto">
          <div className="flex-1 p-4 space-y-1">
            {navLinks.map(({ path, label, icon: Icon, public: isPublic }) => (
              (!isPublic || !currentUser) && (currentUser || isPublic) && (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(path)
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                  }`}
                >
                  <Icon size={18} strokeWidth={2} className={isActive(path) ? 'text-emerald-600' : 'text-gray-400'} />
                  <span>{label}</span>
                  {isActive(path) && (
                    <span className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  )}
                </Link>
              )
            ))}

            {/* Admin Section for Mobile */}
            {currentUser && userData?.isAdmin && (
              <div className="pt-3 mt-3 border-t border-gray-100">
                <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Administración</p>
                {adminLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive('/admin')
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                    }`}
                  >
                    <link.icon size={18} strokeWidth={2} className="text-emerald-600" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t border-gray-100 space-y-2">
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200"
              >
                <LogOut size={18} />
                <span>Cerrar sesión</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
                >
                  <LogIn size={18} />
                  <span>Iniciar sesión</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all duration-200"
                >
                  <UserPlus size={18} />
                  <span>Crear cuenta</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
