import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUserReservas, updateUserData, updateReservaStatus, decreaseUserRating } from '../services/firestoreService'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Star, 
  Trophy, 
  AlertTriangle,
  Calendar,
  Clock,
  Users,
  Edit3,
  Save,
  X,
  CheckCircle,
  XCircle,
  Loader2,
  Activity,
  FileText,
  ChevronRight,
  AlertCircle,
  Filter,
  Search
} from 'lucide-react'
import jsPDF from 'jspdf'

// Iconos SVG personalizados para cada deporte
const BasketballIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M4.93 4.93l14.14 14.14"/>
    <path d="M19.07 4.93L4.93 19.07"/>
    <path d="M12 2c2.76 0 5 4.48 5 10s-2.24 10-5 10"/>
    <path d="M12 2c-2.76 0-5 4.48-5 10s2.24 10 5 10"/>
  </svg>
)

const VolleyballIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2c3 3 4.5 7 4.5 10"/>
    <path d="M12 2c-3 3-4.5 7-4.5 10"/>
    <path d="M2.5 9c3 1 7 1.5 9.5 1.5s6.5-.5 9.5-1.5"/>
    <path d="M12 12v10"/>
  </svg>
)

const PadelIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="8" rx="6" ry="6"/>
    <path d="M12 14v8"/>
    <path d="M9 22h6"/>
    <circle cx="10" cy="7" r="1" fill="currentColor"/>
    <circle cx="14" cy="7" r="1" fill="currentColor"/>
    <circle cx="12" cy="10" r="1" fill="currentColor"/>
  </svg>
)

const SoccerIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2l2 4-2 2-2-2 2-4z"/>
    <path d="M22 12l-4 2-2-2 2-2 4 2z"/>
    <path d="M12 22l-2-4 2-2 2 2-2 4z"/>
    <path d="M2 12l4-2 2 2-2 2-4-2z"/>
    <path d="M12 8l2 2v4l-2 2-2-2v-4l2-2z"/>
  </svg>
)

export default function Perfil() {
  const { currentUser, userData, setUserData } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelando, setCancelando] = useState(null)
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    ciudad: '',
  })

  useEffect(() => {
    if (userData) {
      setFormData({
        nombre: userData.nombre || '',
        telefono: userData.telefono || '',
        ciudad: userData.ciudad || '',
      })
      loadReservas()
    }
  }, [userData])

  const loadReservas = async () => {
    try {
      setLoading(true)
      const data = await getUserReservas(currentUser.uid)
      const sorted = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      setReservas(sorted)
    } catch (err) {
      console.error('Error al cargar reservas:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSave = async () => {
    try {
      await updateUserData(currentUser.uid, formData)
      setUserData({ ...userData, ...formData })
      setIsEditing(false)
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
    }
  }

  const handleCancelarReserva = async (reservaId) => {
    if (!window.confirm('Cancelar tu reserva reducira tu calificacion en 1 estrella. ¿Continuar?')) {
      return
    }

    try {
      setCancelando(reservaId)
      await updateReservaStatus(reservaId, 'cancelada', 'Cancelada por el usuario')
      await decreaseUserRating(currentUser.uid)
      
      const updatedReservas = await getUserReservas(currentUser.uid)
      setReservas(updatedReservas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)))
      
      const newEstrellas = Math.max(1, (userData.estrellas || 5) - 1)
      const newNoAsistencias = (userData.noAsistencias || 0) + 1
      
      setUserData({
        ...userData,
        estrellas: newEstrellas,
        noAsistencias: newNoAsistencias,
      })
    } catch (error) {
      console.error('Error al cancelar reserva:', error)
      alert('Error al cancelar la reserva')
    } finally {
      setCancelando(null)
    }
  }

  const generatePDF = (reserva) => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    
    const emerald600 = [5, 150, 105]
    const emerald100 = [209, 250, 229]
    const gray900 = [17, 24, 39]
    const gray500 = [107, 114, 128]
    
    doc.setFillColor(...emerald600)
    doc.rect(0, 0, pageWidth, 45, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text('ixmisport', pageWidth / 2, 22, { align: 'center' })
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Comprobante de Reserva', pageWidth / 2, 35, { align: 'center' })
    
    doc.setFillColor(...emerald100)
    doc.rect(0, 45, pageWidth, 3, 'F')
    
    let y = 65
    
    doc.setTextColor(...gray900)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('Detalles de tu Reserva', 20, y)
    
    y += 15
    doc.setDrawColor(...emerald600)
    doc.setLineWidth(0.5)
    doc.line(20, y, pageWidth - 20, y)
    
    y += 15
    
    const estadoTexto = reserva.estado === 'aprobada' ? 'Aprobada' : 
                        reserva.estado === 'pendiente' ? 'Pendiente de aprobacion' :
                        reserva.estado === 'cancelada' ? 'Cancelada' : reserva.estado
    
    const datos = [
      ['Cancha:', reserva.chanchaName],
      ['Deporte:', reserva.deporte],
      ['Fecha:', new Date(reserva.fecha).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
      ['Hora:', reserva.hora + ' hrs'],
      ['Personas:', (reserva.cantidadPersonas || '-') + ' jugadores'],
      ['Reservado por:', reserva.userName || userData?.nombre || 'Usuario'],
      ['Estado:', estadoTexto],
    ]
    
    datos.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(...gray500)
      doc.text(label, 25, y)
      
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(12)
      doc.setTextColor(...gray900)
      doc.text(String(value), 75, y)
      
      y += 12
    })
    
    y += 10
    doc.setFillColor(...emerald100)
    doc.roundedRect(20, y - 5, pageWidth - 40, 25, 3, 3, 'F')
    
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...emerald600)
    doc.text('ID de Reserva:', pageWidth / 2, y + 5, { align: 'center' })
    
    doc.setFontSize(12)
    doc.setTextColor(...gray900)
    doc.text(reserva.id || 'N/A', pageWidth / 2, y + 15, { align: 'center' })
    
    y = 270
    doc.setDrawColor(...emerald600)
    doc.setLineWidth(0.5)
    doc.line(20, y, pageWidth - 20, y)
    
    doc.setFontSize(9)
    doc.setTextColor(...gray500)
    doc.text('Generado el ' + new Date().toLocaleString('es-MX'), pageWidth / 2, y + 10, { align: 'center' })
    doc.text('ixmisport - Sistema de Reservas Deportivas', pageWidth / 2, y + 18, { align: 'center' })
    
    doc.save('reserva-' + reserva.deporte.toLowerCase() + '-' + reserva.fecha + '.pdf')
  }

  const getDeporteIcon = (deporte, className = "w-5 h-5") => {
    switch (deporte) {
      case 'Basquetbol': return <BasketballIcon className={className} />
      case 'Voleibol': return <VolleyballIcon className={className} />
      case 'Padel': case 'Pádel': return <PadelIcon className={className} />
      case 'Futbol': case 'Fútbol': return <SoccerIcon className={className} />
      default: return <Activity className={className} />
    }
  }

  const getDeporteColor = (deporte) => {
    switch (deporte) {
      case 'Basquetbol': return { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' }
      case 'Voleibol': return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' }
      case 'Padel': case 'Pádel': return { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' }
      case 'Futbol': case 'Fútbol': return { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' }
    }
  }

  const getEstadoStyle = (estado) => {
    switch (estado) {
      case 'aprobada': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle }
      case 'pendiente': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock }
      case 'rechazada': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: XCircle }
      case 'cancelada': return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300', icon: X }
      case 'no-asistio': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', icon: AlertTriangle }
      default: return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', icon: Activity }
    }
  }

  const reservasFiltradas = reservas.filter(reserva => {
    const matchEstado = filtroEstado === 'todos' || reserva.estado === filtroEstado
    const matchBusqueda = busqueda === '' || 
      reserva.chanchaName?.toLowerCase().includes(busqueda.toLowerCase()) ||
      reserva.deporte?.toLowerCase().includes(busqueda.toLowerCase()) ||
      reserva.fecha?.includes(busqueda)
    return matchEstado && matchBusqueda
  })

  const stats = {
    total: reservas.length,
    aprobadas: reservas.filter(r => r.estado === 'aprobada').length,
    pendientes: reservas.filter(r => r.estado === 'pendiente').length,
    canceladas: reservas.filter(r => r.estado === 'cancelada').length,
  }

  return (
    <div className="min-h-screen bg-white pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-emerald-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Mi Perfil
            </h1>
          </div>
          <p className="text-gray-500 ml-13">
            Gestiona tu informacion personal y revisa tu historial de reservas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Personal */}
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-emerald-600" />
                  Informacion Personal
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={'flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ' + (
                    isEditing 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  )}
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4" />
                      Cancelar
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4" />
                      Editar
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1.5">
                    <User className="w-4 h-4 inline mr-1.5 text-gray-400" />
                    Nombre Completo
                  </label>
                  {isEditing ? (
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      placeholder="Tu nombre completo"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                      {userData?.nombre || 'No especificado'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Mail className="w-4 h-4 inline mr-1.5 text-gray-400" />
                    Correo Electronico
                  </label>
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                    {userData?.email || currentUser?.email}
                  </p>
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Phone className="w-4 h-4 inline mr-1.5 text-gray-400" />
                    Telefono
                  </label>
                  {isEditing ? (
                    <input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      placeholder="Tu numero de telefono"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                      {userData?.telefono || 'No especificado'}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1.5">
                    <MapPin className="w-4 h-4 inline mr-1.5 text-gray-400" />
                    Ciudad
                  </label>
                  {isEditing ? (
                    <input
                      id="ciudad"
                      name="ciudad"
                      type="text"
                      value={formData.ciudad}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      placeholder="Tu ciudad"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                      {userData?.ciudad || 'No especificado'}
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={handleSave}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all"
                >
                  <Save className="w-5 h-5" />
                  Guardar Cambios
                </button>
              )}
            </div>

            {/* Mis Reservas */}
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  Historial de Reservas
                </h2>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{stats.total} total</span>
                  <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">{stats.aprobadas} aprobadas</span>
                  <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-full">{stats.pendientes} pendientes</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por cancha, deporte o fecha..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer"
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="aprobada">Aprobadas</option>
                    <option value="cancelada">Canceladas</option>
                    <option value="no-asistio">No asistio</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-500">Cargando reservas...</p>
                </div>
              ) : reservasFiltradas.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    {reservas.length === 0 ? 'No tienes reservas aun' : 'No hay reservas que coincidan con tu busqueda'}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {reservas.length === 0 ? 'Haz tu primera reserva desde el menu Reservar' : 'Intenta con otros filtros'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reservasFiltradas.map((reserva) => {
                    const deporteColor = getDeporteColor(reserva.deporte)
                    const estadoStyle = getEstadoStyle(reserva.estado)
                    const EstadoIcon = estadoStyle.icon
                    
                    return (
                      <div 
                        key={reserva.id} 
                        className="group p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md hover:border-gray-200 transition-all duration-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ' + deporteColor.bg + ' ' + deporteColor.text}>
                              {getDeporteIcon(reserva.deporte, "w-6 h-6")}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate">{reserva.chanchaName}</h4>
                              <p className="text-sm text-gray-500">{reserva.deporte}</p>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  {new Date(reserva.fecha).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  {reserva.hora} hrs
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Users className="w-4 h-4 text-gray-400" />
                                  {reserva.cantidadPersonas || '-'} personas
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                            <span className={'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ' + estadoStyle.bg + ' ' + estadoStyle.text + ' ' + estadoStyle.border}>
                              <EstadoIcon className="w-3.5 h-3.5" />
                              {reserva.estado === 'no-asistio' ? 'No asistio' : reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                            </span>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => generatePDF(reserva)}
                                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Descargar comprobante"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              
                              {reserva.estado === 'pendiente' && (
                                <button
                                  onClick={() => handleCancelarReserva(reserva.id)}
                                  disabled={cancelando === reserva.id}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Cancelar reserva"
                                >
                                  {cancelando === reserva.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <XCircle className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Columna Lateral */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                  {userData?.nombre?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{userData?.nombre || 'Usuario'}</h3>
                <p className="text-sm text-gray-500">{userData?.email}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="bg-amber-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-amber-700">Reputacion</span>
                    <span className="text-sm text-amber-600">{userData?.estrellas || 5}/5</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={'w-6 h-6 ' + (i < (userData?.estrellas || 5) ? 'text-amber-400 fill-amber-400' : 'text-gray-200')} 
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700">Total Reservas</span>
                    </div>
                    <span className="text-2xl font-bold text-emerald-700">{userData?.totalReservas || 0}</span>
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium text-red-700">No Asistencias</span>
                    </div>
                    <span className="text-2xl font-bold text-red-600">{userData?.noAsistencias || 0}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">Importante</p>
                    <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                      Cancelar una reserva pendiente o no asistir a una aprobada restara <strong>1 estrella</strong> de tu calificacion.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-emerald-600" />
                Estados de Reservas
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                  <div>
                    <span className="font-medium text-gray-900">Pendiente</span>
                    <p className="text-gray-500">Espera aprobacion del admin</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                  <div>
                    <span className="font-medium text-gray-900">Aprobada</span>
                    <p className="text-gray-500">Confirmada, asiste a tiempo</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gray-400 mt-1.5 shrink-0"></span>
                  <div>
                    <span className="font-medium text-gray-900">Cancelada</span>
                    <p className="text-gray-500">Reserva cancelada</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                  <div>
                    <span className="font-medium text-gray-900">No asistio</span>
                    <p className="text-gray-500">No asististe (-1 estrella)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

