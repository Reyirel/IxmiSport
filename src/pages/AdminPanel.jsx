import { useEffect, useState } from 'react'
import {
  getAllReservasAdmin,
  getPendingReservas,
  updateReservaStatus,
  postponeReserva,
  getAllCanchas,
  disableCancha,
  enableCancha,
} from '../services/firestoreService'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('reservas')
  const [allReservas, setAllReservas] = useState([])
  const [pendingReservas, setPendingReservas] = useState([])
  const [canchas, setCanchas] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [postponeModal, setPostponeModal] = useState(null)
  const [disableModal, setDisableModal] = useState(null)
  const [postponeData, setPostponeData] = useState({ fecha: '', hora: '' })
  const [disableType, setDisableType] = useState('time') // 'time', 'fullDay', 'date'
  const [disableTime, setDisableTime] = useState('')
  const [disableDate, setDisableDate] = useState('')
  const [disableDateType, setDisableDateType] = useState('fullDay') // 'fullDay', 'withTime'

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [reservasData, pendingData, chanchasData] = await Promise.all([
        getAllReservasAdmin(),
        getPendingReservas(),
        getAllCanchas(),
      ])
      setAllReservas(reservasData)
      setPendingReservas(pendingData)
      setCanchas(chanchasData)
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

      if (disableType === 'time') {
        // Inhabilitar por tiempo específico
        minutes = disableTime ? parseInt(disableTime) : null
      } else if (disableType === 'fullDay') {
        // Inhabilitar todo el día (desde ahora hasta medianoche)
        const now = new Date()
        const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
        minutes = Math.ceil((midnight - now) / (1000 * 60))
      } else if (disableType === 'date') {
        // Inhabilitar hasta una fecha específica
        if (!disableDate) {
          alert('Por favor selecciona una fecha')
          setActionLoading(null)
          return
        }
        
        if (disableDateType === 'fullDay') {
          // Todo el día de esa fecha (hasta medianoche)
          const targetDate = new Date(disableDate)
          targetDate.setHours(23, 59, 59)
          const now = new Date()
          minutes = Math.ceil((targetDate - now) / (1000 * 60))
        } else if (disableDateType === 'withTime') {
          // Por minutos dentro de esa fecha
          if (!disableTime) {
            alert('Por favor ingresa la cantidad de minutos')
            setActionLoading(null)
            return
          }
          minutes = parseInt(disableTime)
        }
      }

      await disableCancha(disableModal, minutes)
      setDisableModal(null)
      setDisableTime('')
      setDisableDate('')
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

  const handleEnableCancha = async (chanchaId) => {
    try {
      setActionLoading(chanchaId)
      await enableCancha(chanchaId)
      await loadData()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const getStats = () => {
    const stats = {
      totalReservas: allReservas.length,
      pendientes: allReservas.filter((r) => r.estado === 'pendiente').length,
      aprobadas: allReservas.filter((r) => r.estado === 'aprobada').length,
      canchasInhabilitadas: canchas.filter((c) => c.inhabilitada).length,
    }
    return stats
  }

  const stats = getStats()

  if (loading) {
    return <div className="p-8 text-center">Cargando datos...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Panel de Administrador</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-700 text-lg font-semibold">Total Reservas</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">{stats.totalReservas}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-700 text-lg font-semibold">Pendientes</h3>
            <p className="text-4xl font-bold text-yellow-600 mt-2">{stats.pendientes}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-700 text-lg font-semibold">Aprobadas</h3>
            <p className="text-4xl font-bold text-green-600 mt-2">{stats.aprobadas}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-700 text-lg font-semibold">Canchas Inhabilitadas</h3>
            <p className="text-4xl font-bold text-red-600 mt-2">{stats.canchasInhabilitadas}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('reservas')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'reservas'
                  ? 'bg-blue-100 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Reservas Pendientes ({stats.pendientes})
            </button>
            <button
              onClick={() => setActiveTab('todasReservas')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'todasReservas'
                  ? 'bg-blue-100 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Todas las Reservas
            </button>
            <button
              onClick={() => setActiveTab('canchas')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'canchas'
                  ? 'bg-blue-100 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Gestionar Canchas
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'reservas' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Reservas Pendientes</h3>
                {pendingReservas.length === 0 ? (
                  <p className="text-gray-700">No hay reservas pendientes</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                            Usuario
                          </th>
                          <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                            Cancha
                          </th>
                          <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                            Fecha
                          </th>
                          <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                            Hora
                          </th>
                          <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingReservas.map((reserva) => (
                          <tr key={reserva.id} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-900">{reserva.userName}</td>
                            <td className="px-6 py-4 text-gray-900">{reserva.chanchaName}</td>
                            <td className="px-6 py-4 text-gray-900">{reserva.fecha}</td>
                            <td className="px-6 py-4 text-gray-900">{reserva.hora}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleApproveReserva(reserva.id)}
                                  disabled={actionLoading === reserva.id}
                                  className="text-green-600 hover:text-green-700 font-medium disabled:text-gray-400"
                                >
                                  Aprobar
                                </button>
                                <button
                                  onClick={() => setPostponeModal(reserva.id)}
                                  disabled={actionLoading === reserva.id}
                                  className="text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400"
                                >
                                  Posponer
                                </button>
                                <button
                                  onClick={() => handleRejectReserva(reserva.id)}
                                  disabled={actionLoading === reserva.id}
                                  className="text-red-600 hover:text-red-700 font-medium disabled:text-gray-400"
                                >
                                  Rechazar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'todasReservas' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Todas las Reservas</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                          Usuario
                        </th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                          Cancha
                        </th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                          Hora
                        </th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allReservas.map((reserva) => (
                        <tr key={reserva.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 text-gray-900">{reserva.userName}</td>
                          <td className="px-6 py-4 text-gray-900">{reserva.chanchaName}</td>
                          <td className="px-6 py-4 text-gray-900">{reserva.fecha}</td>
                          <td className="px-6 py-4 text-gray-900">{reserva.hora}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                reserva.estado === 'aprobada'
                                  ? 'bg-green-100 text-green-800'
                                  : reserva.estado === 'pendiente'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : reserva.estado === 'rechazada'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {reserva.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'canchas' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Gestionar Canchas</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                          Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                          Deporte
                        </th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                          Precio
                        </th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {canchas.map((cancha) => (
                        <tr key={cancha.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 text-gray-900">{cancha.nombre}</td>
                          <td className="px-6 py-4 text-gray-900">{cancha.deporte}</td>
                          <td className="px-6 py-4 text-gray-900">${cancha.precio}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                cancha.inhabilitada
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {cancha.inhabilitada ? 'Inhabilitada' : 'Disponible'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {cancha.inhabilitada ? (
                              <button
                                onClick={() => handleEnableCancha(cancha.id)}
                                disabled={actionLoading === cancha.id}
                                className="text-green-600 hover:text-green-700 font-medium disabled:text-gray-400"
                              >
                                Habilitar
                              </button>
                            ) : (
                              <button
                                onClick={() => setDisableModal(cancha.id)}
                                disabled={actionLoading === cancha.id}
                                className="text-red-600 hover:text-red-700 font-medium disabled:text-gray-400"
                              >
                                Inhabilitar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para Posponer Reserva */}
      {postponeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Posponer Reserva</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nueva Fecha</label>
                <input
                  type="date"
                  value={postponeData.fecha}
                  onChange={(e) =>
                    setPostponeData({ ...postponeData, fecha: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nueva Hora</label>
                <select
                  value={postponeData.hora}
                  onChange={(e) =>
                    setPostponeData({ ...postponeData, hora: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Selecciona una hora</option>
                  {Array.from({ length: 12 }, (_, i) => 8 + i).map((hour) => (
                    <option key={hour} value={`${hour}:00`}>
                      {hour}:00
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePostponeReserva}
                  disabled={actionLoading === postponeModal}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setPostponeModal(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Inhabilitar Cancha */}
      {disableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Inhabilitar Cancha</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de Inhabilitación
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="time"
                      checked={disableType === 'time'}
                      onChange={(e) => {
                        setDisableType(e.target.value)
                        setDisableTime('')
                      }}
                      className="mr-3"
                    />
                    <span className="text-gray-700">Por tiempo específico (minutos)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="fullDay"
                      checked={disableType === 'fullDay'}
                      onChange={(e) => setDisableType(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-gray-700">Todo el día</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="date"
                      checked={disableType === 'date'}
                      onChange={(e) => {
                        setDisableType(e.target.value)
                        setDisableDate('')
                      }}
                      className="mr-3"
                    />
                    <span className="text-gray-700">Hasta una fecha específica</span>
                  </label>
                </div>
              </div>

              {disableType === 'time' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duración (minutos)
                  </label>
                  <input
                    type="number"
                    value={disableTime}
                    onChange={(e) => setDisableTime(e.target.value)}
                    placeholder="60"
                    min="1"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="mt-1 text-xs text-gray-500">Ejemplo: 60 minutos, 120 minutos, etc.</p>
                </div>
              )}

              {disableType === 'date' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hasta qué fecha
                    </label>
                    <input
                      type="date"
                      value={disableDate}
                      onChange={(e) => setDisableDate(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de inhabilitación en esa fecha
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="fullDay"
                          checked={disableDateType === 'fullDay'}
                          onChange={(e) => setDisableDateType(e.target.value)}
                          className="mr-3"
                        />
                        <span className="text-gray-700">Todo el día</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="withTime"
                          checked={disableDateType === 'withTime'}
                          onChange={(e) => setDisableDateType(e.target.value)}
                          className="mr-3"
                        />
                        <span className="text-gray-700">Por minutos específicos</span>
                      </label>
                    </div>
                  </div>

                  {disableDateType === 'withTime' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Duración (minutos)
                      </label>
                      <input
                        type="number"
                        value={disableTime}
                        onChange={(e) => setDisableTime(e.target.value)}
                        placeholder="60"
                        min="1"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <p className="mt-1 text-xs text-gray-500">Ejemplo: 60 minutos, 120 minutos, etc.</p>
                    </div>
                  )}
                </div>
              )}

              {disableType === 'fullDay' && (
                <div className="bg-blue-50 p-3 rounded text-sm text-blue-700">
                  La cancha estará inhabilitada hasta la medianoche de hoy.
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDisableCancha}
                disabled={actionLoading === disableModal}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:bg-gray-400 font-medium"
              >
                {actionLoading === disableModal ? 'Procesando...' : 'Confirmar'}
              </button>
              <button
                onClick={() => {
                  setDisableModal(null)
                  setDisableTime('')
                  setDisableDate('')
                  setDisableType('time')
                  setDisableDateType('fullDay')
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
