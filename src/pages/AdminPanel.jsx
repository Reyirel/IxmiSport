import { useEffect, useState } from 'react'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MapPin, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Star,
  ChevronDown,
  X,
  CalendarDays,
  Activity,
  UserCheck,
  Ban,
  PlayCircle,
  RefreshCw,
  FileText,
  Download
} from 'lucide-react'
import jsPDF from 'jspdf'
import {
  getAllReservasAdmin,
  getPendingReservas,
  updateReservaStatus,
  postponeReserva,
  getAllCanchas,
  disableCancha,
  enableCancha,
  getAllUsers,
  getUserReservasAdmin,
  getSystemStats,
  updateUserRating
} from '../services/firestoreService'

// Iconos SVG por deporte
const sportIcons = {
  Basquetbol: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M12 2v20M2 12h20M4.93 4.93c4.08 4.08 4.08 10.06 0 14.14M19.07 4.93c-4.08 4.08-4.08 10.06 0 14.14" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  Voleibol: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M12 2c0 5.5 4.5 10 10 10M12 2c0 5.5-4.5 10-10 10M12 22c0-5.5 4.5-10 10-10M12 22c0-5.5-4.5-10-10-10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  Pádel: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <ellipse cx="12" cy="8" rx="6" ry="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <line x1="12" y1="15" x2="12" y2="22" stroke="currentColor" strokeWidth="2"/>
      <circle cx="9" cy="7" r="1" fill="currentColor"/>
      <circle cx="15" cy="7" r="1" fill="currentColor"/>
      <circle cx="12" cy="10" r="1" fill="currentColor"/>
    </svg>
  ),
  Fútbol: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <polygon points="12,7 15,10 14,14 10,14 9,10" stroke="currentColor" strokeWidth="1" fill="none"/>
      <line x1="12" y1="2" x2="12" y2="7" stroke="currentColor" strokeWidth="1"/>
      <line x1="22" y1="12" x2="15" y2="10" stroke="currentColor" strokeWidth="1"/>
      <line x1="19" y1="19" x2="14" y2="14" stroke="currentColor" strokeWidth="1"/>
      <line x1="5" y1="19" x2="10" y2="14" stroke="currentColor" strokeWidth="1"/>
      <line x1="2" y1="12" x2="9" y2="10" stroke="currentColor" strokeWidth="1"/>
    </svg>
  ),
}

const sportColors = {
  Basquetbol: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700' },
  Voleibol: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' },
  Pádel: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
  Fútbol: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', badge: 'bg-green-100 text-green-700' },
}

const statusConfig = {
  pendiente: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock, label: 'Pendiente' },
  aprobada: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle, label: 'Aprobada' },
  rechazada: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle, label: 'Rechazada' },
  cancelada: { color: 'bg-gray-100 text-gray-600 border-gray-200', icon: Ban, label: 'Cancelada' },
  'no-asistió': { color: 'bg-rose-100 text-rose-700 border-rose-200', icon: AlertTriangle, label: 'No Asistió' },
  pospuesta: { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: RefreshCw, label: 'Pospuesta' }
}

// Tabs del panel
const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'reservas', label: 'Reservas', icon: Calendar },
  { id: 'usuarios', label: 'Usuarios', icon: Users },
  { id: 'canchas', label: 'Canchas', icon: MapPin },
]

// Función para calcular tiempo restante de inhabilitación
const getDisabledInfo = (cancha) => {
  if (!cancha.inhabilitada) return null

  const now = new Date()
  
  // Hora de inicio de la inhabilitación
  const inhabilitadaEn = cancha.inhabilitadaEn?.toDate?.() || null
  const horaInicio = inhabilitadaEn 
    ? inhabilitadaEn.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    : null
  const fechaInicio = inhabilitadaEn
    ? inhabilitadaEn.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    : null

  // Si hay fecha de finalización
  if (cancha.inhabilitadaHasta) {
    const inhabilitadaHasta = cancha.inhabilitadaHasta.toDate?.() || null
    if (inhabilitadaHasta) {
      const diff = inhabilitadaHasta - now
      if (diff <= 0) {
        return { expired: true, horaInicio, fechaInicio }
      }
      
      const minutosRestantes = Math.ceil(diff / (1000 * 60))
      const horasRestantes = Math.floor(minutosRestantes / 60)
      const mins = minutosRestantes % 60
      
      let tiempoRestante = ''
      if (horasRestantes > 0) {
        tiempoRestante = `${horasRestantes}h ${mins}min`
      } else {
        tiempoRestante = `${mins} min`
      }
      
      const horaFin = inhabilitadaHasta.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      const fechaFin = inhabilitadaHasta.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
      
      return {
        temporal: true,
        horaInicio,
        fechaInicio,
        horaFin,
        fechaFin,
        tiempoRestante,
        minutosRestantes
      }
    }
  }
  
  // Inhabilitación permanente
  return {
    permanente: true,
    horaInicio,
    fechaInicio
  }
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [allReservas, setAllReservas] = useState([])
  const [pendingReservas, setPendingReservas] = useState([])
  const [canchas, setCanchas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  
  // Modales
  const [postponeModal, setPostponeModal] = useState(null)
  const [disableModal, setDisableModal] = useState(null)
  const [userModal, setUserModal] = useState(null)
  const [userReservas, setUserReservas] = useState([])
  const [loadingUserReservas, setLoadingUserReservas] = useState(false)
  
  // Formularios
  const [postponeData, setPostponeData] = useState({ fecha: '', hora: '' })
  const [disableType, setDisableType] = useState('time')
  const [disableTime, setDisableTime] = useState('')
  const [disableStartHour, setDisableStartHour] = useState('') // Nueva hora de inicio
  const [disableDate, setDisableDate] = useState('')
  const [disableDateType, setDisableDateType] = useState('fullDay')
  
  // Filtros
  const [reservaFilter, setReservaFilter] = useState('all')
  const [reservaSearch, setReservaSearch] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [canchaFilter, setCanchaFilter] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [reservasData, pendingData, canchasData, usuariosData, statsData] = await Promise.all([
        getAllReservasAdmin(),
        getPendingReservas(),
        getAllCanchas(),
        getAllUsers(),
        getSystemStats()
      ])
      setAllReservas(reservasData)
      setPendingReservas(pendingData)
      setCanchas(canchasData)
      setUsuarios(usuariosData)
      setStats(statsData)
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveReserva = async (reservaId) => {
    try {
      setActionLoading(reservaId)
      await updateReservaStatus(reservaId, 'aprobada')
      await loadData()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectReserva = async (reservaId) => {
    try {
      setActionLoading(reservaId)
      await updateReservaStatus(reservaId, 'rechazada', 'Rechazada por administrador')
      await loadData()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handlePostponeReserva = async () => {
    if (!postponeModal || !postponeData.fecha || !postponeData.hora) {
      alert('Por favor completa todos los campos')
      return
    }
    try {
      setActionLoading(postponeModal)
      await postponeReserva(postponeModal, postponeData.fecha, postponeData.hora)
      setPostponeModal(null)
      setPostponeData({ fecha: '', hora: '' })
      await loadData()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDisableCancha = async () => {
    if (!disableModal) return
    try {
      setActionLoading(disableModal)
      let minutes = null
      let startHour = null

      if (disableType === 'time') {
        if (!disableTime) {
          alert('Por favor ingresa la duración en minutos')
          setActionLoading(null)
          return
        }
        minutes = parseInt(disableTime)
        // Si hay hora de inicio especificada, usarla
        startHour = disableStartHour || null
      } else if (disableType === 'fullDay') {
        const now = new Date()
        const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
        minutes = Math.ceil((midnight - now) / (1000 * 60))
        startHour = null // Empieza ahora
      } else if (disableType === 'date') {
        if (!disableDate) {
          alert('Por favor selecciona una fecha')
          setActionLoading(null)
          return
        }
        if (disableDateType === 'fullDay') {
          const targetDate = new Date(disableDate)
          targetDate.setHours(23, 59, 59)
          const now = new Date()
          minutes = Math.ceil((targetDate - now) / (1000 * 60))
          startHour = null // Empieza ahora
        } else if (disableDateType === 'withTime') {
          if (!disableTime) {
            alert('Por favor ingresa la cantidad de minutos')
            setActionLoading(null)
            return
          }
          minutes = parseInt(disableTime)
          startHour = disableStartHour || null
        }
      }

      await disableCancha(disableModal, minutes, startHour)
      setDisableModal(null)
      setDisableTime('')
      setDisableDate('')
      setDisableStartHour('')
      setDisableType('time')
      setDisableDateType('fullDay')
      await loadData()
    } catch (error) {
      console.error('Error:', error)
      alert('Error al inhabilitar la cancha')
    } finally {
      setActionLoading(null)
    }
  }

  const handleEnableCancha = async (canchaId) => {
    try {
      setActionLoading(canchaId)
      await enableCancha(canchaId)
      await loadData()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleViewUser = async (user) => {
    setUserModal(user)
    setLoadingUserReservas(true)
    try {
      const reservas = await getUserReservasAdmin(user.id)
      setUserReservas(reservas)
    } catch (error) {
      console.error('Error cargando reservas del usuario:', error)
    } finally {
      setLoadingUserReservas(false)
    }
  }

  const handleUpdateUserRating = async (userId, newRating) => {
    try {
      await updateUserRating(userId, newRating)
      await loadData()
      if (userModal && userModal.id === userId) {
        setUserModal({ ...userModal, estrellas: newRating })
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Generar PDF de reporte
  const generateReport = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    
    // Header
    doc.setFillColor(16, 185, 129)
    doc.rect(0, 0, pageWidth, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('Reporte Administrativo', pageWidth / 2, 20, { align: 'center' })
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generado: ${new Date().toLocaleDateString('es-ES', { dateStyle: 'full' })}`, pageWidth / 2, 32, { align: 'center' })
    
    let y = 55
    doc.setTextColor(31, 41, 55)
    
    // Estadísticas generales
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('📊 Estadísticas Generales', 20, y)
    y += 12
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    const statsLines = [
      `Total de reservas: ${stats?.totalReservas || 0}`,
      `Reservas de hoy: ${stats?.reservasHoy || 0}`,
      `Reservas del mes: ${stats?.reservasMes || 0}`,
      `Pendientes: ${stats?.pendientes || 0} | Aprobadas: ${stats?.aprobadas || 0} | Rechazadas: ${stats?.rechazadas || 0}`,
      `Total de usuarios: ${stats?.totalUsuarios || 0} | Activos: ${stats?.usuariosActivos || 0}`,
      `Rating promedio: ${stats?.ratingPromedio || '5.0'} estrellas`,
      `Canchas: ${stats?.totalCanchas || 0} total | ${stats?.canchasActivas || 0} activas | ${stats?.canchasInhabilitadas || 0} inhabilitadas`
    ]
    
    statsLines.forEach(line => {
      doc.text(line, 25, y)
      y += 8
    })
    
    y += 10
    
    // Reservas pendientes
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(`⏳ Reservas Pendientes (${pendingReservas.length})`, 20, y)
    y += 12
    
    if (pendingReservas.length > 0) {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      pendingReservas.slice(0, 10).forEach(reserva => {
        doc.text(`• ${reserva.userName} - ${reserva.chanchaName} - ${reserva.fecha} ${reserva.hora}`, 25, y)
        y += 7
        if (y > 270) {
          doc.addPage()
          y = 20
        }
      })
      if (pendingReservas.length > 10) {
        doc.text(`... y ${pendingReservas.length - 10} más`, 25, y)
        y += 10
      }
    } else {
      doc.setFontSize(10)
      doc.text('No hay reservas pendientes', 25, y)
      y += 10
    }
    
    // Footer
    doc.setFontSize(9)
    doc.setTextColor(107, 114, 128)
    doc.text('ixmisport - Sistema de Reservas Deportivas', pageWidth / 2, 285, { align: 'center' })
    
    doc.save(`reporte_admin_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // Filtrar reservas
  const filteredReservas = allReservas.filter(reserva => {
    const matchesFilter = reservaFilter === 'all' || reserva.estado === reservaFilter
    const matchesSearch = reservaSearch === '' || 
      reserva.userName?.toLowerCase().includes(reservaSearch.toLowerCase()) ||
      reserva.chanchaName?.toLowerCase().includes(reservaSearch.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Filtrar usuarios
  const filteredUsers = usuarios.filter(user => {
    return userSearch === '' ||
      user.nombre?.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearch.toLowerCase())
  })

  // Filtrar canchas
  const filteredCanchas = canchas.filter(cancha => {
    if (canchaFilter === 'all') return true
    if (canchaFilter === 'active') return !cancha.inhabilitada
    if (canchaFilter === 'disabled') return cancha.inhabilitada
    return cancha.deporte === canchaFilter
  }).sort((a, b) => (a.orden || 0) - (b.orden || 0))

  // Renderizar estrellas
  const renderStars = (rating, interactive = false, userId = null) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => interactive && userId && handleUpdateUserRating(userId, star)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Star
              size={interactive ? 18 : 14}
              className={star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}
            />
          </button>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-emerald-600" />
                </span>
                Panel de Administración
              </h1>
              <p className="text-gray-500 mt-1">Gestiona reservas, usuarios y canchas del sistema</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium shadow-sm"
              >
                <RefreshCw size={18} />
                Actualizar
              </button>
              <button
                onClick={generateReport}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-medium shadow-sm shadow-emerald-200"
              >
                <Download size={18} />
                Exportar PDF
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-1.5">
          <div className="flex flex-wrap gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
                {tab.id === 'reservas' && pendingReservas.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-semibold">
                    {pendingReservas.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </span>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Total</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.totalReservas}</p>
                <p className="text-sm text-gray-500 mt-1">Reservas totales</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </span>
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Pendientes</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.pendientes}</p>
                <p className="text-sm text-gray-500 mt-1">Por aprobar</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </span>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Usuarios</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsuarios}</p>
                <p className="text-sm text-gray-500 mt-1">{stats.usuariosActivos} activos</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </span>
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Canchas</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.canchasActivas}</p>
                <p className="text-sm text-gray-500 mt-1">de {stats.totalCanchas} disponibles</p>
              </div>
            </div>

            {/* Second Row Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg shadow-emerald-200 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Reservas de Hoy</p>
                    <p className="text-4xl font-bold mt-1">{stats.reservasHoy}</p>
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                    <CalendarDays className="w-7 h-7" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-emerald-100 text-sm">Este mes: <span className="text-white font-semibold">{stats.reservasMes}</span></p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg shadow-amber-200 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm font-medium">Rating Promedio</p>
                    <p className="text-4xl font-bold mt-1 flex items-center gap-2">
                      {stats.ratingPromedio}
                      <Star className="w-8 h-8 fill-white" />
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Activity className="w-7 h-7" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-amber-100 text-sm">No asistencias: <span className="text-white font-semibold">{stats.noAsistencias}</span></p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-200 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm font-medium">Tasa de Aprobación</p>
                    <p className="text-4xl font-bold mt-1">
                      {stats.totalReservas > 0 ? Math.round((stats.aprobadas / stats.totalReservas) * 100) : 0}%
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-indigo-100 text-sm">Rechazadas: <span className="text-white font-semibold">{stats.rechazadas}</span></p>
                </div>
              </div>
            </div>

            {/* Stats by Sport */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                Estadísticas por Deporte
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(stats.estadisticasPorDeporte || {}).map(([deporte, data]) => {
                  const colors = sportColors[deporte] || sportColors.Fútbol
                  return (
                    <div key={deporte} className={`${colors.bg} rounded-xl p-4 border ${colors.border}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={colors.text}>{sportIcons[deporte] || sportIcons.Fútbol}</span>
                        <span className={`font-semibold ${colors.text}`}>{deporte}</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{data.total}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="text-emerald-600">✓ {data.aprobadas}</span>
                        <span className="text-amber-600">⏳ {data.pendientes}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Pending Reservations Quick View */}
            {pendingReservas.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-600" />
                    Reservas Pendientes de Aprobación
                  </h3>
                  <button
                    onClick={() => setActiveTab('reservas')}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Ver todas →
                  </button>
                </div>
                <div className="space-y-3">
                  {pendingReservas.slice(0, 5).map(reserva => (
                    <div key={reserva.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{reserva.userName}</p>
                          <p className="text-sm text-gray-500">{reserva.chanchaName} • {reserva.fecha} • {reserva.hora}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApproveReserva(reserva.id)}
                          disabled={actionLoading === reserva.id}
                          className="px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 transition-all"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleRejectReserva(reserva.id)}
                          disabled={actionLoading === reserva.id}
                          className="px-3 py-1.5 bg-red-100 text-red-600 text-sm font-medium rounded-lg hover:bg-red-200 disabled:bg-gray-100 transition-all"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reservas Tab */}
        {activeTab === 'reservas' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por usuario o cancha..."
                    value={reservaSearch}
                    onChange={(e) => setReservaSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={reservaFilter}
                    onChange={(e) => setReservaFilter(e.target.value)}
                    className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white cursor-pointer"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="aprobada">Aprobadas</option>
                    <option value="rechazada">Rechazadas</option>
                    <option value="cancelada">Canceladas</option>
                    <option value="no-asistió">No asistió</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Reservations List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cancha</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hora</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredReservas.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          No se encontraron reservas
                        </td>
                      </tr>
                    ) : (
                      filteredReservas.map(reserva => {
                        const status = statusConfig[reserva.estado] || statusConfig.pendiente
                        const StatusIcon = status.icon
                        const sportColor = sportColors[reserva.deporte] || sportColors.Fútbol
                        
                        return (
                          <tr key={reserva.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-semibold text-sm">
                                  {reserva.userName?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <span className="font-medium text-gray-900">{reserva.userName || 'Sin nombre'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className={`${sportColor.text}`}>{sportIcons[reserva.deporte] || sportIcons.Fútbol}</span>
                                <span className="text-gray-700">{reserva.chanchaName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-700">{reserva.fecha}</td>
                            <td className="px-6 py-4 text-gray-700">{reserva.hora}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                                <StatusIcon size={14} />
                                {status.label}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {reserva.estado === 'pendiente' ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleApproveReserva(reserva.id)}
                                    disabled={actionLoading === reserva.id}
                                    className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 disabled:bg-gray-100 disabled:text-gray-400 transition-all"
                                    title="Aprobar"
                                  >
                                    <CheckCircle size={18} />
                                  </button>
                                  <button
                                    onClick={() => setPostponeModal(reserva.id)}
                                    disabled={actionLoading === reserva.id}
                                    className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400 transition-all"
                                    title="Posponer"
                                  >
                                    <RefreshCw size={18} />
                                  </button>
                                  <button
                                    onClick={() => handleRejectReserva(reserva.id)}
                                    disabled={actionLoading === reserva.id}
                                    className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 transition-all"
                                    title="Rechazar"
                                  >
                                    <XCircle size={18} />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">—</span>
                              )}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Usuarios Tab */}
        {activeTab === 'usuarios' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o correo..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.length === 0 ? (
                <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
                  No se encontraron usuarios
                </div>
              ) : (
                filteredUsers.map(user => (
                  <div key={user.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                          {user.nombre?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{user.nombre || 'Sin nombre'}</h4>
                          <p className="text-sm text-gray-500 truncate max-w-[150px]">{user.email}</p>
                        </div>
                      </div>
                      {user.isAdmin && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">Admin</span>
                      )}
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Rating</span>
                        {renderStars(user.estrellas || 5)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Reservas totales</span>
                        <span className="font-medium text-gray-900">{user.totalReservas || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">No asistencias</span>
                        <span className={`font-medium ${(user.noAsistencias || 0) > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                          {user.noAsistencias || 0}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleViewUser(user)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-medium hover:bg-emerald-100 transition-all"
                    >
                      <Eye size={18} />
                      Ver detalles
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Canchas Tab */}
        {activeTab === 'canchas' && (
          <div className="space-y-6">
            {/* Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex flex-wrap gap-2">
                {['all', 'active', 'disabled', 'Basquetbol', 'Voleibol', 'Pádel', 'Fútbol'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setCanchaFilter(filter)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      canchaFilter === filter
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    {filter === 'all' ? 'Todas' : filter === 'active' ? 'Activas' : filter === 'disabled' ? 'Inhabilitadas' : filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Canchas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCanchas.map(cancha => {
                const colors = sportColors[cancha.deporte] || sportColors.Fútbol
                const isDisabled = cancha.inhabilitada
                const disabledInfo = getDisabledInfo(cancha)
                
                return (
                  <div 
                    key={cancha.id} 
                    className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${
                      isDisabled ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
                    }`}
                  >
                    <div className={`p-4 ${colors.bg} border-b ${colors.border}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={colors.text}>{sportIcons[cancha.deporte] || sportIcons.Fútbol}</span>
                          <span className={`font-semibold ${colors.text}`}>{cancha.deporte}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isDisabled ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {isDisabled ? 'Inhabilitada' : 'Disponible'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h4 className="font-semibold text-gray-900 mb-3">{cancha.nombre}</h4>
                      <div className="space-y-2 text-sm text-gray-500 mb-4">
                        <p className="flex items-center gap-2">
                          <Users size={14} />
                          Mínimo {cancha.personasMinimas} personas
                        </p>
                        
                        {/* Info de inhabilitación mejorada */}
                        {isDisabled && disabledInfo && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl space-y-2">
                            {disabledInfo.horaInicio && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">Desde:</span>
                                <span className="font-semibold text-red-700">
                                  {disabledInfo.fechaInicio} - {disabledInfo.horaInicio}
                                </span>
                              </div>
                            )}
                            
                            {disabledInfo.temporal && (
                              <>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-600">Hasta:</span>
                                  <span className="font-semibold text-red-700">
                                    {disabledInfo.fechaFin} - {disabledInfo.horaFin}
                                  </span>
                                </div>
                                <div className="flex items-center justify-center gap-2 pt-2 border-t border-red-100">
                                  <Clock size={14} className="text-amber-600" />
                                  <span className="text-amber-700 font-semibold text-sm">
                                    {disabledInfo.tiempoRestante} restantes
                                  </span>
                                </div>
                              </>
                            )}
                            
                            {disabledInfo.permanente && (
                              <div className="flex items-center justify-center gap-2 pt-1">
                                <AlertTriangle size={14} className="text-red-600" />
                                <span className="text-red-700 font-medium text-xs">
                                  Inhabilitación permanente
                                </span>
                              </div>
                            )}
                            
                            {disabledInfo.expired && (
                              <div className="flex items-center justify-center gap-2 pt-1">
                                <CheckCircle size={14} className="text-emerald-600" />
                                <span className="text-emerald-700 font-medium text-xs">
                                  Inhabilitación expirada
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {isDisabled ? (
                        <button
                          onClick={() => handleEnableCancha(cancha.id)}
                          disabled={actionLoading === cancha.id}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:bg-gray-300 transition-all"
                        >
                          <PlayCircle size={18} />
                          {actionLoading === cancha.id ? 'Habilitando...' : 'Habilitar'}
                        </button>
                      ) : (
                        <button
                          onClick={() => setDisableModal(cancha.id)}
                          disabled={actionLoading === cancha.id}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium hover:bg-red-100 disabled:bg-gray-100 transition-all"
                        >
                          <Ban size={18} />
                          Inhabilitar
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal Posponer Reserva */}
      {postponeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-600" />
                Posponer Reserva
              </h3>
              <button
                onClick={() => setPostponeModal(null)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Fecha</label>
                <input
                  type="date"
                  value={postponeData.fecha}
                  onChange={(e) => setPostponeData({ ...postponeData, fecha: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Hora</label>
                <select
                  value={postponeData.hora}
                  onChange={(e) => setPostponeData({ ...postponeData, hora: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecciona una hora</option>
                  {Array.from({ length: 17 }, (_, i) => 5 + i).map(hour => (
                    <option key={hour} value={`${hour}:00`}>{hour}:00</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handlePostponeReserva}
                disabled={actionLoading === postponeModal}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-gray-300 transition-all"
              >
                {actionLoading === postponeModal ? 'Procesando...' : 'Confirmar'}
              </button>
              <button
                onClick={() => setPostponeModal(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Inhabilitar Cancha */}
      {disableModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Ban className="w-5 h-5 text-red-600" />
                Inhabilitar Cancha
              </h3>
              <button
                onClick={() => {
                  setDisableModal(null)
                  setDisableTime('')
                  setDisableDate('')
                  setDisableStartHour('')
                  setDisableType('time')
                  setDisableDateType('fullDay')
                }}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Inhabilitación</label>
                <div className="space-y-2">
                  {[
                    { value: 'time', label: 'Por tiempo específico (minutos)' },
                    { value: 'fullDay', label: 'Todo el día' },
                    { value: 'date', label: 'Hasta una fecha específica' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
                      <input
                        type="radio"
                        value={option.value}
                        checked={disableType === option.value}
                        onChange={(e) => {
                          setDisableType(e.target.value)
                          setDisableTime('')
                          setDisableDate('')
                          setDisableStartHour('')
                        }}
                        className="w-4 h-4 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {disableType === 'time' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Clock size={14} className="inline mr-1" />
                      Hora de inicio (opcional)
                    </label>
                    <input
                      type="time"
                      value={disableStartHour}
                      onChange={(e) => setDisableStartHour(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {disableStartHour 
                        ? `La inhabilitación iniciará a las ${disableStartHour}` 
                        : 'Dejar vacío para iniciar inmediatamente'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duración (minutos)</label>
                    <input
                      type="number"
                      value={disableTime}
                      onChange={(e) => setDisableTime(e.target.value)}
                      placeholder="60"
                      min="1"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Ejemplo: 60 minutos, 120 minutos, etc.</p>
                  </div>
                  
                  {/* Vista previa de inhabilitación */}
                  {disableTime && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-700 font-medium mb-1">📋 Resumen de inhabilitación:</p>
                      <p className="text-sm text-red-600">
                        • Inicia: {disableStartHour ? `Hoy a las ${disableStartHour}` : 'Inmediatamente'}
                      </p>
                      <p className="text-sm text-red-600">
                        • Duración: {disableTime} minutos
                      </p>
                      <p className="text-sm text-red-600">
                        • Termina: {(() => {
                          const now = new Date()
                          let startTime = now
                          if (disableStartHour) {
                            const [h, m] = disableStartHour.split(':').map(Number)
                            startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0)
                            if (startTime < now) startTime = now
                          }
                          const endTime = new Date(startTime.getTime() + parseInt(disableTime) * 60000)
                          return endTime.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
                        })()}
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {disableType === 'fullDay' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm text-amber-700">La cancha estará inhabilitada hasta la medianoche de hoy.</p>
                </div>
              )}
              
              {disableType === 'date' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hasta qué fecha</label>
                    <input
                      type="date"
                      value={disableDate}
                      onChange={(e) => setDisableDate(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Opciones</label>
                    <div className="space-y-2">
                      {[
                        { value: 'fullDay', label: 'Todo el día' },
                        { value: 'withTime', label: 'Por minutos específicos' }
                      ].map(option => (
                        <label key={option.value} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
                          <input
                            type="radio"
                            value={option.value}
                            checked={disableDateType === option.value}
                            onChange={(e) => setDisableDateType(e.target.value)}
                            className="w-4 h-4 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {disableDateType === 'withTime' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Clock size={14} className="inline mr-1" />
                          Hora de inicio (opcional)
                        </label>
                        <input
                          type="time"
                          value={disableStartHour}
                          onChange={(e) => setDisableStartHour(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {disableStartHour 
                            ? `La inhabilitación iniciará a las ${disableStartHour}` 
                            : 'Dejar vacío para iniciar inmediatamente'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duración (minutos)</label>
                        <input
                          type="number"
                          value={disableTime}
                          onChange={(e) => setDisableTime(e.target.value)}
                          placeholder="60"
                          min="1"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                      
                      {/* Vista previa de inhabilitación */}
                      {disableTime && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                          <p className="text-sm text-red-700 font-medium mb-1">📋 Resumen de inhabilitación:</p>
                          <p className="text-sm text-red-600">
                            • Inicia: {disableStartHour ? `A las ${disableStartHour}` : 'Inmediatamente'}
                          </p>
                          <p className="text-sm text-red-600">
                            • Duración: {disableTime} minutos
                          </p>
                          <p className="text-sm text-red-600">
                            • Termina: {(() => {
                              const now = new Date()
                              let startTime = now
                              if (disableStartHour) {
                                const [h, m] = disableStartHour.split(':').map(Number)
                                startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0)
                                if (startTime < now) startTime = now
                              }
                              const endTime = new Date(startTime.getTime() + parseInt(disableTime) * 60000)
                              return endTime.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
                            })()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleDisableCancha}
                disabled={actionLoading === disableModal}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:bg-gray-300 transition-all"
              >
                {actionLoading === disableModal ? 'Procesando...' : 'Confirmar'}
              </button>
              <button
                onClick={() => {
                  setDisableModal(null)
                  setDisableTime('')
                  setDisableDate('')
                  setDisableStartHour('')
                  setDisableType('time')
                  setDisableDateType('fullDay')
                }}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Usuario */}
      {userModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-200">
                  {userModal.nombre?.charAt(0)?.toUpperCase() || userModal.email?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{userModal.nombre || 'Sin nombre'}</h3>
                  <p className="text-gray-500">{userModal.email}</p>
                  {userModal.isAdmin && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">Administrador</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setUserModal(null)
                  setUserReservas([])
                }}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-amber-50 rounded-xl p-4 text-center">
                  <div className="flex justify-center mb-2">{renderStars(userModal.estrellas || 5, true, userModal.id)}</div>
                  <p className="text-xs text-amber-600 font-medium">Rating (editable)</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-700">{userModal.totalReservas || 0}</p>
                  <p className="text-xs text-emerald-600 font-medium">Reservas totales</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-red-700">{userModal.noAsistencias || 0}</p>
                  <p className="text-xs text-red-600 font-medium">No asistencias</p>
                </div>
              </div>
              
              {/* User Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-gray-400" />
                  Información
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Teléfono:</span>
                    <span className="ml-2 text-gray-900">{userModal.telefono || 'No registrado'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Carnet:</span>
                    <span className="ml-2 text-gray-900">{userModal.carnet || 'No registrado'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Carrera:</span>
                    <span className="ml-2 text-gray-900">{userModal.carrera || 'No registrada'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Registro:</span>
                    <span className="ml-2 text-gray-900">
                      {userModal.createdAt?.toDate?.()?.toLocaleDateString('es-ES') || 'No disponible'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Reservations */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  Historial de Reservas
                </h4>
                
                {loadingUserReservas ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Cargando reservas...</p>
                  </div>
                ) : userReservas.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Este usuario no tiene reservas</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {userReservas.map(reserva => {
                      const status = statusConfig[reserva.estado] || statusConfig.pendiente
                      const StatusIcon = status.icon
                      const sportColor = sportColors[reserva.deporte] || sportColors.Fútbol
                      
                      return (
                        <div key={reserva.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <span className={sportColor.text}>{sportIcons[reserva.deporte] || sportIcons.Fútbol}</span>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{reserva.chanchaName}</p>
                              <p className="text-xs text-gray-500">{reserva.fecha} • {reserva.hora}</p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                            <StatusIcon size={12} />
                            {status.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => {
                  setUserModal(null)
                  setUserReservas([])
                }}
                className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
