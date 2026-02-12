import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { initializeCanchas } from '../services/firestoreService'

// Crear usuario admin de prueba - Solo en desarrollo
export const createAdminUser = async () => {
  // 🔒 SEGURIDAD: Solo ejecutar en desarrollo
  if (import.meta.env.MODE !== 'development') {
    console.warn('⚠️ createAdminUser solo disponible en desarrollo')
    return
  }

  // 🔒 SEGURIDAD: Obtener credenciales de variables de entorno
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    console.warn('⚠️ Variables de entorno VITE_ADMIN_EMAIL y VITE_ADMIN_PASSWORD no configuradas')
    return
  }

  try {
    // Verificar si el admin ya existe
    const adminRef = doc(db, 'usuarios', 'admin-user')
    const adminSnap = await getDoc(adminRef)

    if (adminSnap.exists() && adminSnap.data().isAdmin) {
      console.log('✓ Usuario admin ya existe')
      // Inicializar canchas
      await initializeCanchas()
      return
    }

    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      adminEmail,
      adminPassword
    )

    // Guardar datos del admin en Firestore
    await setDoc(doc(db, 'usuarios', userCredential.user.uid), {
      nombre: 'Administrador',
      email: adminEmail,
      estrellas: 5,
      totalReservas: 0,
      noAsistencias: 0,
      isAdmin: true,
      createdAt: new Date(),
    })

    console.log('✓ Usuario admin creado exitosamente')
    
    // Inicializar canchas
    await initializeCanchas()
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️ Email del admin ya está en uso')
      // Actualizar documento si es necesario
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          adminEmail,
          adminPassword
        )
        await setDoc(doc(db, 'usuarios', userCredential.user.uid), {
          isAdmin: true,
        }, { merge: true })
        
        // Inicializar canchas
        await initializeCanchas()
      } catch (signInError) {
        console.error('❌ Error al actualizar admin:', signInError)
      }
    } else {
      console.error('❌ Error al crear admin:', error)
    }
  }
}
