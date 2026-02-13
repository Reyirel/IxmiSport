import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, Zap, CheckCircle, ArrowRight, Trophy, Shield, Smartphone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState, useRef } from 'react'
import soccerImage from '../assets/imagen1.png'

export default function Home() {
  const { currentUser } = useAuth()
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / 50,
          y: (e.clientY - rect.top - rect.height / 2) / 50
        })
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

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
      {/* ====== HERO SECTION - Modern SaaS Style ====== */}
      <section 
        ref={heroRef}
        className="relative w-full min-h-screen flex items-center bg-white pt-20 pb-16 lg:pt-24 lg:pb-24"
      >
        {/* Subtle background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />
          {/* Floating shapes with parallax */}
          <div 
            className="absolute top-20 right-[15%] w-64 h-64 rounded-full bg-emerald-50 blur-3xl opacity-60"
            style={{ transform: `translate(${mousePosition.x * -1}px, ${mousePosition.y * -1}px)` }}
          />
          <div 
            className="absolute bottom-20 left-[10%] w-48 h-48 rounded-full bg-violet-50 blur-3xl opacity-50"
            style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
          />
          <div 
            className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-emerald-100 blur-2xl opacity-30"
            style={{ transform: `translate(${mousePosition.x * 0.5}px, ${scrollY * 0.1}px)` }}
          />
        </div>

        <div className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Content - Typography & CTA */}
            <div className="order-2 lg:order-1 max-w-xl">
              {/* Badge */}
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full mb-6 opacity-0"
                style={{ animation: 'fadeSlideUp 0.6s ease-out 0.1s forwards' }}
              >
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-700 text-sm font-medium tracking-wide">
                  Plataforma #1 en reservas deportivas
                </span>
              </div>

              {/* Headline */}
              <h1 
                className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6 opacity-0"
                style={{ 
                  animation: 'fadeSlideUp 0.6s ease-out 0.2s forwards',
                  fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif"
                }}
              >
                Reserva tu cancha
                <span className="block text-emerald-600 mt-2">
                  en segundos
                </span>
              </h1>
              
              {/* Subheadline */}
              <p 
                className="text-lg sm:text-xl text-gray-500 leading-relaxed mb-10 max-w-md opacity-0"
                style={{ animation: 'fadeSlideUp 0.6s ease-out 0.3s forwards' }}
              >
                La forma más rápida y segura de encontrar y reservar canchas de fútbol. Sin complicaciones, sin esperas.
              </p>

              {/* CTA Buttons */}
              <div 
                className="flex flex-col sm:flex-row gap-4 mb-10 opacity-0"
                style={{ animation: 'fadeSlideUp 0.6s ease-out 0.4s forwards' }}
              >
                {currentUser ? (
                  <Link 
                    to="/reservar" 
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-full font-semibold text-base hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <span>Explorar Canchas</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/register" 
                      className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-full font-semibold text-base hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <span>Comenzar Gratis</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                    <Link 
                      to="/login" 
                      className="group inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-full font-semibold text-base hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      Iniciar Sesión
                    </Link>
                  </>
                )}
              </div>

              {/* Trust indicators */}
              <div 
                className="flex flex-wrap items-center gap-6 opacity-0"
                style={{ animation: 'fadeSlideUp 0.6s ease-out 0.5s forwards' }}
              >
                <div className="flex items-center gap-2 text-gray-500">
                  <CheckCircle size={18} className="text-emerald-500" />
                  <span className="text-sm font-medium">Sin comisiones</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Shield size={18} className="text-emerald-500" />
                  <span className="text-sm font-medium">Pago seguro</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Zap size={18} className="text-emerald-500" />
                  <span className="text-sm font-medium">Confirmación instantánea</span>
                </div>
              </div>
            </div>

            {/* Right Content - Illustration */}
            <div 
              className="order-1 lg:order-2 flex items-center justify-center opacity-0"
              style={{ 
                animation: 'fadeSlideUp 0.8s ease-out 0.3s forwards',
                transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`
              }}
            >
              <div className="relative w-full max-w-lg lg:max-w-xl aspect-square">
                {/* Decorative ring */}
                <div 
                  className="absolute inset-0 rounded-full border border-emerald-100 opacity-50"
                  style={{ transform: `scale(${1 + scrollY * 0.0002})` }}
                />
                <div 
                  className="absolute inset-4 rounded-full border border-emerald-50 opacity-30"
                  style={{ transform: `scale(${1 + scrollY * 0.0001}) rotate(${scrollY * 0.02}deg)` }}
                />
                
                {/* Motion lines - left side */}
                <div className="absolute top-1/4 -left-4 w-16 opacity-40 hidden sm:block">
                  <div className="h-0.5 bg-emerald-400 rounded mb-3" style={{ width: '100%', animation: 'motionLine 2s ease-in-out infinite' }} />
                  <div className="h-0.5 bg-emerald-300 rounded mb-3" style={{ width: '75%', animation: 'motionLine 2s ease-in-out infinite', animationDelay: '0.3s' }} />
                  <div className="h-0.5 bg-emerald-400 rounded" style={{ width: '50%', animation: 'motionLine 2s ease-in-out infinite', animationDelay: '0.6s' }} />
                </div>
                
                {/* Motion lines - right side */}
                <div className="absolute top-1/3 -right-4 w-16 opacity-40 hidden sm:block">
                  <div className="h-0.5 bg-emerald-400 rounded mb-3 ml-auto" style={{ width: '50%', animation: 'motionLine 2s ease-in-out infinite', animationDelay: '0.2s' }} />
                  <div className="h-0.5 bg-emerald-300 rounded mb-3 ml-auto" style={{ width: '75%', animation: 'motionLine 2s ease-in-out infinite', animationDelay: '0.5s' }} />
                  <div className="h-0.5 bg-emerald-400 rounded ml-auto" style={{ width: '100%', animation: 'motionLine 2s ease-in-out infinite', animationDelay: '0.8s' }} />
                </div>
                
                {/* Main illustration container */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={soccerImage} 
                    alt="Soccer players illustration"
                    className="w-full h-full object-contain drop-shadow-xl"
                    style={{ 
                      transform: `translateY(${scrollY * 0.03}px)`,
                      animation: 'floatImage 4s ease-in-out infinite',
                      willChange: 'transform',
                    }}
                  />
                </div>
                
                {/* Decorative floating dots */}
                <div 
                  className="absolute -top-2 right-1/4 w-4 h-4 bg-emerald-200 rounded-full opacity-60"
                  style={{ animation: 'floatDot 3s ease-in-out infinite' }}
                />
                <div 
                  className="absolute bottom-1/4 -left-2 w-3 h-3 bg-violet-200 rounded-full opacity-50"
                  style={{ animation: 'floatDot 3.5s ease-in-out infinite', animationDelay: '1s' }}
                />
                <div 
                  className="absolute top-1/2 -right-3 w-2 h-2 bg-emerald-300 rounded-full opacity-40"
                  style={{ animation: 'floatDot 2.5s ease-in-out infinite', animationDelay: '0.5s' }}
                />
                <div 
                  className="absolute bottom-1/3 right-0 w-3 h-3 bg-emerald-100 rounded-full opacity-50"
                  style={{ animation: 'floatDot 4s ease-in-out infinite', animationDelay: '1.5s' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0"
          style={{ animation: 'fadeIn 0.6s ease-out 1s forwards' }}
        >
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <span className="text-xs font-medium tracking-widest uppercase">Descubre más</span>
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full p-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mx-auto animate-bounce" />
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
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes floatImage {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes floatDot {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-8px) scale(1.1);
            opacity: 0.8;
          }
        }

        @keyframes motionLine {
          0%, 100% {
            opacity: 0.2;
            transform: scaleX(1);
          }
          50% {
            opacity: 0.6;
            transform: scaleX(1.1);
          }
        }

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

        /* Smooth hover micro-interactions */
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -8px rgba(16, 185, 129, 0.15);
        }

        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        ::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }

        @media (max-width: 768px) {
          .animate-fadeInUp {
            animation: fadeInUp 0.4s ease-out forwards;
          }

          .animate-fadeInDown {
            animation: fadeInDown 0.4s ease-out forwards;
          }

          @keyframes floatPlayer1 {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-4px);
            }
          }

          @keyframes floatPlayer2 {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-3px);
            }
          }
        }

        /* Reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  )
}
