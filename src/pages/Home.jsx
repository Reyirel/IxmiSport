import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Bienvenido a ixmisport
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Encuentra y reserva las mejores canchas deportivas
          </p>
          <Link
            to="/reservar"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg inline-block"
          >
            Reservar una Cancha
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">⚽</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Variedad de Deportes
            </h3>
            <p className="text-gray-700">
              Encuentra canchas para fútbol, tenis, basketball y más deportes
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Reserva Fácil
            </h3>
            <p className="text-gray-700">
              Reserva tu cancha en cualquier momento desde tu dispositivo
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Precios Competitivos
            </h3>
            <p className="text-gray-700">
              Disfruta de los mejores precios del mercado
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
