import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  getAllCanchas,
  isCanchaAvailable,
  addReserva,
  incrementUserReservas,
  getUserReservas,
  autoCancelPendingReservas,
  getCancha,
} from '../services/firestoreService'

export default function CanchasReservar() {
  const { currentUser, userData } = useAuth()
  const [canchas, setCanchas] = useState([])
  const [userReservas, setUserReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedCancha, setSelectedCancha] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [cantidadPersonas, setCantidadPersonas] = useState(1)
  const [loading2, setLoading2] = useState(false)

  useEffect(() => {
    loadCanchas()
    if (currentUser) {
      loadUserReservas()
    }
    
    // Recargar canchas cada 30 segundos para detectar inhabilitaciones
    const interval = setInterval(loadCanchas, 30000)
    return () => clearInterval(interval)
  }, [currentUser])

  const loadCanchas = async () => {
    try {
      setLoading(true)
      // Cancelar automáticamente reservas pendientes vencidas
      await autoCancelPendingReservas()
      const data = await getAllCanchas()
      setCanchas(data)
    } catch (err) {
      setError('Error al cargar canchas: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadUserReservas = async () => {
    try {
      const reservas = await getUserReservas(currentUser.uid)
      setUserReservas(reservas)
    } catch (err) {
      console.error('Error al cargar reservas:', err)
    }
  }

  const handleReserva = async (e) => {
    e.preventDefault()
    if (!selectedCancha || !selectedDate || !selectedTime || cantidadPersonas < 1) {
      setError('Por favor completa todos los campos')
      return
    }

    // Validar cantidad mínima de personas
    if (cantidadPersonas < selectedCancha.personasMinimas) {
      setError(`Se requieren al menos ${selectedCancha.personasMinimas} personas para jugar ${selectedCancha.deporte}`)
      return
    }

    // Validar rango horario (5:00 AM a 10:00 PM)
    const [hora, minutos] = selectedTime.split(':').map(Number)
    if (hora < 5 || hora >= 22) {
      setError('❌ Las reservas solo se pueden hacer entre las 5:00 AM y las 10:00 PM (22:00)')
      return
    }

    setLoading2(true)
    setError('')
    setSuccess('')

    try {
      // Verificar estado actual de la cancha (por si fue inhabilitada recientemente)
      const chanchaActual = await getCancha(selectedCancha.id)
      if (!chanchaActual) {
        setError('La cancha no existe')
        setLoading2(false)
        return
      }

      if (chanchaActual.inhabilitada) {
        if (chanchaActual.inhabilitadaHasta) {
          const ahora = new Date()
          const inhabilitadaHasta = chanchaActual.inhabilitadaHasta.toDate()
          if (ahora < inhabilitadaHasta) {
            setError('❌ La cancha está inhabilitada. El admin la deshabilitará a: ' + inhabilitadaHasta.toLocaleString())
            setLoading2(false)
            return
          }
        } else {
          setError('❌ La cancha está inhabilitada y no está disponible para reservas')
          setLoading2(false)
          return
        }
      }

      // Verificar disponibilidad de horario
      const available = await isCanchaAvailable(selectedCancha.id, selectedDate, selectedTime)
      if (!available) {
        setError('⏰ La cancha no está disponible en ese horario. Intenta con otro horario.')
        setLoading2(false)
        return
      }

      // Crear reserva
      const reservaId = await addReserva({
        userId: currentUser.uid,
        userName: userData?.nombre || 'Usuario',
        chanchaId: selectedCancha.id,
        chanchaName: selectedCancha.nombre,
        deporte: selectedCancha.deporte,
        fecha: selectedDate,
        hora: selectedTime,
        fechaHora: new Date(`${selectedDate}T${selectedTime}`).toISOString(),
        precio: selectedCancha.precio,
        cantidadPersonas: cantidadPersonas,
        personasConfirmadas: 1, // Solo el que hace la reserva
      })

      // Incrementar contador de reservas del usuario
      await incrementUserReservas(currentUser.uid)

      setSuccess('✅ Reserva creada correctamente. Espera aprobación del admin.')
      setSelectedCancha(null)
      setSelectedDate('')
      setSelectedTime('')
      setCantidadPersonas(1)
      
      // Recargar reservas
      await loadUserReservas()
    } catch (err) {
      setError('Error al crear reserva: ' + err.message)
    } finally {
      setLoading2(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Cargando canchas...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Reservar Canchas</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Canchas Disponibles</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {canchas.map((cancha) => (
                  <div
                    key={cancha.id}
                    className={`border p-6 rounded-lg cursor-pointer transition ${
                      cancha.inhabilitada
                        ? 'border-gray-300 bg-gray-100 opacity-50'
                        : selectedCancha?.id === cancha.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-500'
                    }`}
                    onClick={() => !cancha.inhabilitada && setSelectedCancha(cancha)}
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {cancha.nombre}
                    </h3>
                    <p className="text-gray-700 mb-2">Deporte: {cancha.deporte}</p>
                    <p className="text-gray-700 mb-2">Mínimo de personas: {cancha.personasMinimas}</p>
                    <p className="font-bold text-lg mb-4">
                      Gratis
                    </p>
                    {cancha.inhabilitada && (
                      <p className="text-red-600 font-semibold">Inhabilitada</p>
                    )}
                    {!cancha.inhabilitada && selectedCancha?.id === cancha.id && (
                      <p className="text-green-600 font-semibold">Seleccionada</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Reservas</h2>
              
              {userReservas.length === 0 ? (
                <p className="text-gray-700">No tienes reservas aún</p>
              ) : (
                <div className="space-y-4">
                  {userReservas.map((reserva) => (
                    <div key={reserva.id} className="border p-4 rounded-lg bg-gray-50">
                      <p><strong>Cancha:</strong> {reserva.chanchaName}</p>
                      <p><strong>Fecha:</strong> {reserva.fecha}</p>
                      <p><strong>Hora:</strong> {reserva.hora}</p>
                      <p>
                        <strong>Estado:</strong>{' '}
                        <span
                          className={`font-semibold ${
                            reserva.estado === 'aprobada'
                              ? 'text-green-600'
                              : reserva.estado === 'pendiente'
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {reserva.estado}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-8 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Mi Información</h2>

              <div className="mb-6 p-4 bg-blue-50 rounded">
                <p><strong>Nombre:</strong> {userData?.nombre || 'Usuario'}</p>
                <p><strong>Email:</strong> {userData?.email}</p>
                <p><strong>Estrellas:</strong> {'⭐'.repeat(userData?.estrellas || 5)}</p>
                <p><strong>Total Reservas:</strong> {userData?.totalReservas || 0}</p>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">Nueva Reserva</h3>

              {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                  {success}
                </div>
              )}

              <form onSubmit={handleReserva} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cancha Seleccionada
                  </label>
                  <p className="mt-1 p-2 bg-gray-100 rounded">
                    {selectedCancha ? selectedCancha.nombre : 'Selecciona una cancha'}
                  </p>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Fecha
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                    Hora (5:00 AM - 10:00 PM)
                  </label>
                  <input
                    id="time"
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="05:00"
                    max="21:59"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Puedes reservar de 5:00 AM hasta 10:00 PM. Ejemplo: 10:37, 15:45, 20:15, etc.
                  </p>
                </div>

                <div>
                  <label htmlFor="personas" className="block text-sm font-medium text-gray-700">
                    Cantidad de Personas
                  </label>
                  <input
                    id="personas"
                    type="number"
                    min="1"
                    max="20"
                    value={cantidadPersonas}
                    onChange={(e) => setCantidadPersonas(parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  {selectedCancha && (
                    <p className="mt-1 text-sm text-gray-600">
                      Mínimo requerido: {selectedCancha.personasMinimas} personas
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading2 || !selectedCancha}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 font-bold text-lg disabled:bg-gray-400"
                >
                  {loading2 ? 'Creando...' : 'Reservar'}
                </button>
              </form>

              <p className="mt-4 text-sm text-gray-600">
                Recuerda: Tu reserva será cancelada automáticamente si no confirmas a la hora exacta.
                Si no asistes después de confirmar, se restará una estrella.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
