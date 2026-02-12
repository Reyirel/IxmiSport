import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, Zap, CheckCircle, ArrowRight, Trophy, Shield, Smartphone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { currentUser } = useAuth()

  const features = [
    {
      icon: Calendar,
      title: 'Reserva Inteligente',
      description: 'Sistema de reserva simple e intuitivo. Selecciona fecha, hora y cancha en segundos.',
    },
    {
      icon: MapPin,
      title: 'Ubicaciones Cercanas',
      description: 'Encuentra canchas disponibles en tu zona. Acceso a cientos de instalaciones.',
    },
    {
      icon: Users,
      title: 'Comunidad Activa',
      description: 'Conecta con otros jugadores. Únete a eventos y torneos locales.',
    },
    {
      icon: Zap,
      title: 'Organización Rápida',
      description: 'Crea grupos y organiza partidos. Sistema de confirmación automático.',
    },
  ]

  const stats = [
    { number: '2.5K+', label: 'Canchas Disponibles' },
    { number: '15K+', label: 'Usuarios Activos' },
    { number: '98%', label: 'Satisfacción' },
    { number: '24/7', label: 'En Línea' },
  ]

  const steps = [
    {
      step: '01',
      icon: MapPin,
      title: 'Busca',
      description: 'Encuentra canchas disponibles en tu zona con filtros personalizados.',
    },
    {
      step: '02',
      icon: Calendar,
      title: 'Selecciona',
      description: 'Elige fecha, hora y cancha perfecta para tu necesidad.',
    },
    {
      step: '03',
      icon: CheckCircle,
      title: 'Reserva',
      description: 'Confirma tu reserva y paga de forma segura en nuestra plataforma.',
    },
  ]

  return (
    <div className="w-full bg-white overflow-hidden">
      {/* ====== ANIMATED BACKGROUND ELEMENTS ====== */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-40 -mr-20 -mt-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-30 -ml-20 -mb-20" style={{ animation: 'float 8s ease-in-out infinite' }}></div>
      </div>

      {/* ====== HERO SECTION ====== */}
      <section className="relative w-full min-h-screen flex items-center justify-center pt-20 pb-12 lg:pt-32 lg:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <div className="order-2 lg:order-1 animate-fadeInUp">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
                Reserva tu Cancha
                <span className="block bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent"> sin complicaciones</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
                La plataforma más rápida y segura para encontrar y reservar las mejores canchas deportivas en tu ciudad.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {currentUser ? (
                  <Link 
                    to="/reservar" 
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-emerald-200 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <span>Explorar Canchas</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/register" 
                      className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-emerald-200 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <span>Empezar Ahora</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                      to="/login" 
                      className="group inline-flex items-center justify-center px-8 py-4 border-2 border-emerald-600 text-emerald-600 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      Ya tengo cuenta
                    </Link>
                  </>
                )}
              </div>

              {/* Trust Badges */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700 font-semibold">
                  <Shield size={20} className="text-emerald-500" />
                  <span>Sin comisiones ocultas</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 font-semibold">
                  <CheckCircle size={20} className="text-emerald-500" />
                  <span>Pago seguro garantizado</span>
                </div>
              </div>
            </div>

            {/* Illustration */}
            <div className="order-1 lg:order-2 flex items-center justify-center animate-fadeInDown">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-96 lg:h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-300 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
                <div className="absolute inset-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden">
                  <div className="text-8xl sm:text-9xl animate-bounce" style={{ animationDuration: '2.5s' }}>
                    ⚽
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FEATURES SECTION ====== */}
      <section className="w-full py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 lg:mb-20 animate-fadeInUp">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              ¿Por qué elegir ixmisport?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Todo lo que necesitas para disfrutar del deporte que amas
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group relative p-8 bg-white border border-gray-200 rounded-2xl hover:border-emerald-300 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-100 hover:scale-105 cursor-pointer animate-fadeInUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Icon Box */}
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={32} className="text-emerald-600" strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Bottom Accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====== STATS SECTION ====== */}
      <section className="w-full py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 text-center mb-16 lg:mb-20 animate-fadeInUp tracking-tight">
            Números que hablan por sí solos
          </h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="relative p-8 sm:p-10 bg-white bordborder-gray-200 rounded-2xl text-center group hover:border-emerald-300 hover:shadow-lg transition-all duration-500 animate-fadeInUp"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                {/* Number */}
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent mb-3">
                  {stat.number}
                </div>

                {/* Label */}
                <p className="text-gray-600 font-semibold text-sm sm:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS SECTION ====== */}
      <section className="w-full py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 lg:mb-20 animate-fadeInUp">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              Cómo funciona
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Tres simples pasos para reservar tu cancha
            </p>
          </div>

          {/* Steps Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="relative animate-fadeInUp" style={{ animationDelay: `${index * 150}ms` }}>
                  {/* Connector Line (Desktop) */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-24 left-full w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-300 transform -translate-y-1/2"></div>
                  )}

                  {/* Card */}
                  <div className="relative p-8 sm:p-10 bg-white border border-gray-200 rounded-2xl hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100 transition-all duration-500 group h-full">
                    {/* Step Number Background */}
                    <div className="absolute top-4 right-4 text-5xl sm:text-6xl font-black text-emerald-100 group-hover:text-emerald-200 transition-colors">
                      {item.step}
                    </div>

                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                      <Icon size={28} className="text-emerald-600" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 relative z-10">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed relative z-10">
                      {item.description}
                    </p>

                    {/* Bottom Accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====== CTA SECTION ====== */}
      <section className="w-full py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        {/* Content */}
        <div className="max-w-3xl mx-auto text-center relative z-10 animate-fadeInUp">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">
            ¿Listo para empezar?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-10 leading-relaxed">
            Únete a miles de jugadores que ya disfrutan de nuestro servicio
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {currentUser ? (
              <Link 
                to="/reservar" 
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span>Ver Canchas Disponibles</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <span>Registrarse Gratis</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/login" 
                  className="group inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white hover:text-emerald-600 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Add animations to CSS */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out forwards;
          opacity: 0;
        }

        @media (max-width: 768px) {
          .animate-fadeInUp {
            animation: fadeInUp 0.4s ease-out forwards;
          }

          .animate-fadeInDown {
            animation: fadeInDown 0.4s ease-out forwards;
          }
        }
      `}</style>
    </div>
  )
}
