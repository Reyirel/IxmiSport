import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUserReservas, updateUserData, updateReservaStatus, decreaseUserRating } from '../services/firestoreService'

export default function Perfil() {
  const { currentUser, userData, setUserData } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelando, setCancelando] = useState(null)
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
      setReservas(data)
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

  const renderStars = (estrellas) => {
    const fullStars = Math.floor(estrellas || 5)
    return '⭐'.repeat(fullStars)
  }

  const handleCancelarReserva = async (reservaId) => {
    if (!window.confirm('⚠️ Cancelar tu reserva reducirá tu calificación en 1 estrella. ¿Continuar?')) {
      return
    }

    try {
      setCancelando(reservaId)
      
      // Cancelar la reserva
      await updateReservaStatus(reservaId, 'cancelada', 'Cancelada por el usuario')
      
      // Restar una estrella por cancelación
      await decreaseUserRating(currentUser.uid)
      
      // Obtener datos actualizados para mostrar nuevas estrellas
      const updatedReservas = await getUserReservas(currentUser.uid)
      setReservas(updatedReservas)
      
      // Actualizar userData localmente (estrellas y noAsistencias)
      const newEstrellas = Math.max(1, (userData.estrellas || 5) - 1)
      const newNoAsistencias = (userData.noAsistencias || 0) + 1
      
      setUserData({
        ...userData,
        estrellas: newEstrellas,
        noAsistencias: newNoAsistencias,
      })
      
      alert('❌ Reserva cancelada. Tu calificación se redujo en 1 estrella.')
    } catch (error) {
      console.error('Error al cancelar reserva:', error)
      alert('Error al cancelar la reserva')
    } finally {
      setCancelando(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Información Personal
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
                >
                  {isEditing ? 'Cancelar' : 'Editar'}
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                    Nombre Completo
                  </label>
                  {isEditing ? (
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{userData?.nombre || 'No especificado'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Correo Electrónico
                  </label>
                  <p className="mt-1 text-gray-900">{userData?.email || currentUser?.email}</p>
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  {isEditing ? (
                    <input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{userData?.telefono || 'No especificado'}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700">
                    Ciudad
                  </label>
                  {isEditing ? (
                    <input
                      id="ciudad"
                      name="ciudad"
                      type="text"
                      value={formData.ciudad}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{userData?.ciudad || 'No especificado'}</p>
                  )}
                </div>

                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 font-medium"
                  >
                    Guardar Cambios
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mi Reputación</h3>
              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-gray-700">Estrellas</p>
                  <p className="text-3xl font-bold mt-2">
                    {renderStars(userData?.estrellas || 5)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {userData?.estrellas || 5} / 5
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700">Total Reservas</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {userData?.totalReservas || 0}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-gray-700">No Asistencias</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    {userData?.noAsistencias || 0}
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-sm font-bold text-red-700">⚠️ Importante</p>
                <p className="text-xs text-red-600 mt-1">
                  Cancelar una reserva pendiente o no asistir a una aprobada restará <strong>1 estrella</strong> de tu calificación.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Reservas</h2>

          {loading ? (
            <p>Cargando reservas...</p>
          ) : reservas.length === 0 ? (
            <p className="text-gray-700">No tienes reservas aún</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                      Cancha
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                      Deporte
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                      Fecha
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                      Hora
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                      Personas
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                      Estado
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((reserva) => (
                    <tr key={reserva.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{reserva.chanchaName}</td>
                      <td className="px-4 py-3 text-gray-900">{reserva.deporte}</td>
                      <td className="px-4 py-3 text-gray-900">{reserva.fecha}</td>
                      <td className="px-4 py-3 text-gray-900">{reserva.hora}</td>
                      <td className="px-4 py-3 text-gray-900">
                        {reserva.cantidadPersonas || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            reserva.estado === 'aprobada'
                              ? 'bg-green-100 text-green-800'
                              : reserva.estado === 'pendiente'
                              ? 'bg-yellow-100 text-yellow-800'
                              : reserva.estado === 'no-asistió'
                              ? 'bg-red-100 text-red-800'
                              : reserva.estado === 'cancelada'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {reserva.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {reserva.estado === 'pendiente' && (
                          <button
                            onClick={() => handleCancelarReserva(reserva.id)}
                            disabled={cancelando === reserva.id}
                            className="text-red-600 hover:text-red-800 font-medium text-sm disabled:text-gray-400"
                          >
                            {cancelando === reserva.id ? 'Cancelando...' : 'Cancelar'}
                          </button>
                        )}
                        {reserva.estado === 'aprobada' && (
                          <span className="text-gray-600 text-sm">
                            ✅ Confirmada
                          </span>
                        )}
                        {reserva.estado === 'cancelada' && (
                          <span className="text-gray-500 text-sm">
                            Cancelada
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8 border-l-4 border-blue-600">
          <h3 className="text-lg font-bold text-blue-900 mb-3">📋 Estados de las Reservas</h3>
          <ul className="space-y-3 text-sm text-blue-800">
            <li><strong>🟡 Pendiente:</strong> Espera aprobación del admin. Puedes cancelarla, pero <span className="text-red-600 font-bold">perderás 1 ⭐</span>.</li>
            <li><strong>🟢 Aprobada:</strong> El admin confirmó tu reserva. No se puede cancelar. Asegúrate de asistir.</li>
            <li><strong>🔴 No asistió:</strong> No asististe a tu reserva aprobada. <span className="text-red-600 font-bold">Pierdes 1 ⭐</span>.</li>
            <li><strong>⚫ Cancelada:</strong> La reserva fue cancelada (por ti o por el admin).</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

