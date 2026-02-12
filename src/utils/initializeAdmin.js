import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { initializeCanchas } from '../services/firestoreService'

// Crear usuario admin de prueba
export const createAdminUser = async () => {
  try {
    // Verificar si el admin ya existe
    const adminRef = doc(db, 'usuarios', 'admin-user')
    const adminSnap = await getDoc(adminRef)

    if (adminSnap.exists() && adminSnap.data().isAdmin) {
      console.log('Usuario admin ya existe')
      // Inicializar canchas
      await initializeCanchas()
      return
    }

    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'admin@test.com',
      'admin123'
    )

    // Guardar datos del admin en Firestore
    await setDoc(doc(db, 'usuarios', userCredential.user.uid), {
      nombre: 'Administrador',
      email: 'admin@test.com',
      estrellas: 5,
      totalReservas: 0,
      noAsistencias: 0,
      isAdmin: true,
      createdAt: new Date(),
    })

    console.log('Usuario admin creado exitosamente')
    
    // Inicializar canchas
    await initializeCanchas()
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('Email del admin ya está en uso')
      // Actualizar documento si es necesario
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          'admin@test.com',
          'admin123'
        )
        await setDoc(doc(db, 'usuarios', userCredential.user.uid), {
          isAdmin: true,
        }, { merge: true })
        
        // Inicializar canchas
        await initializeCanchas()
      } catch (signInError) {
        console.error('Error al actualizar admin:', signInError)
      }
    } else {
      console.error('Error al crear admin:', error)
    }
  }
}
