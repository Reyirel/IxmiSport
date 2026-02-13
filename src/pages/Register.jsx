import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/authService'
import { addUserData } from '../services/firestoreService'
import { useAuth } from '../context/AuthContext'
import { 
  Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, Loader2, 
  CheckCircle, Shield, FileText, ChevronDown, ChevronUp, Phone,
  MapPin, Calendar
} from 'lucide-react'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [showDecalogo, setShowDecalogo] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: datos, 2: términos
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  // Si el usuario ya está logueado, redirigir al home
  if (currentUser) {
    navigate('/')
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    // Limpiar espacios en el email
    if (name === 'email') {
      setFormData({ ...formData, [name]: value.trim().toLowerCase() })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  // Validar formato de email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError('El nombre es requerido')
      return false
    }
    if (!formData.email.trim()) {
      setError('El correo electrónico es requerido')
      return false
    }
    if (!isValidEmail(formData.email.trim())) {
      setError('Por favor, ingresa un correo electrónico válido')
      return false
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return false
    }
    return true
  }

  const handleNextStep = () => {
    setError('')
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!acceptedTerms || !acceptedPrivacy) {
      setError('Debes aceptar el decálogo y el aviso de privacidad para continuar')
      return
    }

    setLoading(true)

    // Limpiar datos antes de enviar
    const cleanEmail = formData.email.trim().toLowerCase()
    const cleanName = formData.name.trim()

    try {
      // Registrar usuario en Firebase Auth
      const user = await registerUser(cleanEmail, formData.password)

      // Guardar datos del usuario en Firestore
      await addUserData(user.uid, {
        nombre: cleanName,
        email: cleanEmail,
        telefono: formData.phone?.trim() || '',
        estrellas: 5,
        totalReservas: 0,
        noAsistencias: 0,
        isAdmin: false,
        aceptoTerminos: true,
        aceptoPrivacidad: true,
        fechaRegistro: new Date().toISOString(),
      })

      navigate('/')
    } catch (err) {
      setError(err.message || 'Error al registrarse')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const decalogoItems = [
    'El registro y administración de la cuenta de usuario debe ser realizado obligatoriamente por una persona mayor de edad (18 años cumplidos). Los menores de edad podrán hacer uso de las instalaciones únicamente bajo la supervisión y responsabilidad de un adulto registrado.',
    'La reservación electrónica es obligatoria para el uso de cualquier cancha y debe realizarse con anticipación por los medios oficiales establecidos.',
    'El horario reservado debe respetarse estrictamente, iniciando y concluyendo puntualmente.',
    'Solo las personas registradas en la reservación podrán hacer uso de la cancha.',
    'La cancelación o modificación de una reservación deberá realizarse con al menos 24 horas de anticipación.',
    'El incumplimiento del horario reservado podrá ocasionar la pérdida del derecho de uso de la misma.',
    'El usuario es responsable del buen uso de las instalaciones, materiales y equipamiento.',
    'Queda prohibido subarrendar o ceder la reservación a terceros sin autorización de la Administración.',
    'El respeto y la conducta deportiva son obligatorios durante el uso de las instalaciones.',
    'La administración podrá sancionar al usuario que maltrate o dañe dicha instalación o le dé un uso distinto para el cual fue reservado.',
    'La administración no se hace responsable de cualquier robo y/o pérdida de objetos personales.',
    'La administración no se responsabiliza de cualquier tipo de daño físico y/o lesión alguna que pudieren sufrir los ocupantes en dicha cancha reservada.',
    'Es responsabilidad del usuario mantener limpio y en buen estado la cancha deportiva después de haberla ocupado.',
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">⚽</span>
            <span className="text-xl font-bold text-gray-900">
              ixmi<span className="text-emerald-600">sport</span>
            </span>
          </Link>
          <Link to="/login" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">
            ¿Ya tienes cuenta? <span className="font-semibold">Inicia sesión</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-emerald-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <span className="text-sm font-medium hidden sm:block">Datos personales</span>
            </div>
            <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-emerald-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-emerald-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <span className="text-sm font-medium hidden sm:block">Términos y condiciones</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 max-w-xl mx-auto animate-shake">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Step 1: Personal Data */}
        {step === 1 && (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Crea tu cuenta
              </h1>
              <p className="mt-2 text-gray-500">
                Únete a la comunidad deportiva de Ixmiquilpan
              </p>
            </div>

            <form className="space-y-5">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Juan Pérez García"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Teléfono <span className="text-gray-400 text-xs">(opcional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                    placeholder="771 123 4567"
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmar <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                La contraseña debe tener al menos 6 caracteres
              </p>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNextStep}
                className="group w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-xl font-semibold text-base hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-200 mt-6"
              >
                <span>Continuar</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Terms and Conditions */}
        {step === 2 && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Términos y Condiciones
              </h1>
              <p className="mt-2 text-gray-500">
                Por favor, lee y acepta los siguientes documentos
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Decálogo Section */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setShowDecalogo(!showDecalogo)}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">Decálogo de Reservaciones</h3>
                      <p className="text-sm text-gray-500">Unidad Deportiva del Municipio de Ixmiquilpan, Hidalgo</p>
                    </div>
                  </div>
                  {showDecalogo ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>

                {showDecalogo && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl max-h-80 overflow-y-auto">
                      <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                        Con fundamento por lo dispuesto en los numerales 7, 18, fracción III, de la Ley Orgánica Municipal del Estado de Hidalgo, 
                        16 fracción III del Bando de Policía y Gobierno para el Municipio de Ixmiquilpan, Hidalgo.
                      </p>
                      
                      <ol className="space-y-3">
                        {decalogoItems.map((item, index) => (
                          <li key={index} className="flex gap-3 text-sm text-gray-700">
                            <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                              {index + 1}
                            </span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}

                <div className="px-5 pb-5">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                      He leído y acepto el <span className="font-semibold text-emerald-600">Decálogo de Reservaciones</span> de las canchas de la Unidad Deportiva del Municipio de Ixmiquilpan, Hidalgo.
                    </span>
                  </label>
                </div>
              </div>

              {/* Privacy Policy Section */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setShowPrivacy(!showPrivacy)}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-violet-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">Aviso de Privacidad</h3>
                      <p className="text-sm text-gray-500">Protección de datos personales</p>
                    </div>
                  </div>
                  {showPrivacy ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>

                {showPrivacy && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl max-h-80 overflow-y-auto space-y-4 text-sm text-gray-700">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">AVISO DE PRIVACIDAD</h4>
                        <p className="leading-relaxed">
                          Uso de Canchas Deportivas de la Unidad del Municipio de Ixmiquilpan, Hidalgo.
                        </p>
                        <p className="leading-relaxed mt-2">
                          El H. Ayuntamiento de Ixmiquilpan, Hidalgo, a través de la dependencia responsable de la administración de las canchas deportivas de la unidad, es el responsable del tratamiento de los datos personales que se recaben con motivo del uso y/o reservación de dichas instalaciones, los cuales serán protegidos conforme a la normatividad aplicable en materia de protección de datos personales.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">2. Finalidad</h4>
                        <p className="leading-relaxed mb-2">Los datos personales recabados serán utilizados para las siguientes finalidades:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Registrar y controlar el uso de las canchas deportivas de la unidad.</li>
                          <li>Gestionar reservaciones y asignación de horarios.</li>
                          <li>Contactar a los usuarios para avisos relacionados con el uso de las instalaciones.</li>
                          <li>Garantizar la seguridad, el orden y el correcto funcionamiento de los espacios deportivos.</li>
                          <li>Cumplir con obligaciones legales y administrativas.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">3. Uso y protección de los datos</h4>
                        <p className="leading-relaxed">
                          Los datos personales serán tratados de forma confidencial y protegidos mediante medidas de seguridad administrativas, técnicas y físicas que eviten su pérdida, alteración, uso indebido o acceso no autorizado.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">4. Transferencia de datos personales</h4>
                        <p className="leading-relaxed">
                          Los datos personales no serán transferidos a terceros, salvo cuando exista una obligación legal o requerimiento de autoridad competente.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">5. Cambios al aviso de privacidad</h4>
                        <p className="leading-relaxed">
                          El presente aviso de privacidad puede sufrir modificaciones, las cuales serán publicadas por los medios oficiales del Municipio de Ixmiquilpan, Hidalgo.
                        </p>
                      </div>

                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 italic">
                          El uso de las canchas de la unidad deportiva implica el conocimiento y aceptación del presente Aviso de Privacidad.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="px-5 pb-5">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={acceptedPrivacy}
                      onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                      className="mt-1 w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                      He leído y acepto el <span className="font-semibold text-violet-600">Aviso de Privacidad</span> y autorizo el tratamiento de mis datos personales.
                    </span>
                  </label>
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-900 text-sm">Unidad Deportiva Municipal</h4>
                  <p className="text-sm text-emerald-700 mt-1">
                    Ixmiquilpan, Hidalgo • H. Ayuntamiento de Ixmiquilpan
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold text-base hover:bg-gray-200 transition-all duration-300"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={loading || !acceptedTerms || !acceptedPrivacy}
                  className="flex-1 group flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-xl font-semibold text-base hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-emerald-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creando cuenta...</span>
                    </>
                  ) : (
                    <>
                      <span>Crear mi cuenta</span>
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Terms Summary */}
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-2">
                <span className={`flex items-center gap-1 ${acceptedTerms ? 'text-emerald-600' : ''}`}>
                  {acceptedTerms ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 border border-gray-300 rounded" />}
                  Decálogo
                </span>
                <span className={`flex items-center gap-1 ${acceptedPrivacy ? 'text-emerald-600' : ''}`}>
                  {acceptedPrivacy ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 border border-gray-300 rounded" />}
                  Privacidad
                </span>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
