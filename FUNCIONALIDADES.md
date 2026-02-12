# ixmisport - App de Reserva de Canchas Deportivas

## Funcionalidades Implementadas

### Autenticación
- Login y Registro con Firebase Authentication
- Rutas protegidas (solo usuarios logueados pueden reservar)
- Rol de administrador con acceso especial

### Reserva de Canchas
- **4 Canchas de Basketball**
- **2 Canchas de Voleibol**
- **1 Cancha de Padel**
- **4 Canchas de Basquet**

Características:
- Solo usuarios logueados pueden hacer reservas
- Verificación de disponibilidad de canchas
- Sistema de 10 minutos para asistir a la reserva (sino se marca como no-asistencia)
- Las reservas comienzan en estado "pendiente" hasta que el admin las apruebe

### Sistema de Estrellas/Reputación
- Cada usuario comienza con 5 estrellas
- Si no asiste a una reserva aprobada (pasan 10 minutos), pierde una estrella
- El perfil muestra: estrellas, total de reservas, no asistencias

### Panel de Administrador
Acceso protegido solo para usuarios admin. Funcionalidades:

1. **Gestionar Reservas Pendientes**
   - Aprobar reservas
   - Rechazar reservas
   - Posponer reservas a otra fecha/hora

2. **Ver Todas las Reservas**
   - Historial completo de reservas

3. **Gestionar Canchas**
   - Inhabilitar canchas (total o por tiempo específico)
   - Habilitar canchas
   - Ver estado de disponibilidad

### Perfil de Usuario
- Ver información personal
- Editar nombre, teléfono y ciudad
- Ver estrellas/reputación
- Ver historial de reservas
- Ver estadísticas (total reservas, no asistencias)

## Cómo Usar

### Instalación
```bash
npm install
npm run dev
```

### Usuarios de Prueba

#### Usuario Admin
- **Email:** admin@test.com
- **Contraseña:** admin123

El usuario admin se crea automáticamente al iniciar la aplicación.

#### Crear Usuario Regular
1. Ir a la página de Registrarse
2. Llenar el formulario con email y contraseña
3. Iniciar sesión

### Flujo de Reserva

1. **Loguearse** como usuario regular
2. Ir a "Reservar"
3. Seleccionar una cancha
4. Elegir fecha y hora
5. Hacer la reserva (estado: pendiente)
6. Esperar aprobación del admin

### Flujo de Administrador

1. Loguearse como admin@test.com
2. Ir a "Admin"
3. En "Reservas Pendientes" ver las solicitudes
4. Acciones disponibles:
   - **Aprobar**: La reserva pasa a estado "aprobada"
   - **Rechazar**: Se rechaza la reserva
   - **Posponer**: Cambiar fecha/hora
5. En "Gestionar Canchas" puedes inhabilitar/habilitar canchas

## Estructura de Datos en Firebase

### Colecciones

#### `usuarios`
```
{
  email: string
  nombre: string
  telefono: string (opcional)
  ciudad: string (opcional)
  estrellas: number (1-5)
  totalReservas: number
  noAsistencias: number
  isAdmin: boolean
  createdAt: timestamp
}
```

#### `canchas`
```
{
  nombre: string
  deporte: string
  precio: number
  inhabilitada: boolean
  inhabilitadaEn: timestamp (opcional)
  inhabilitadaHasta: timestamp (opcional)
  createdAt: timestamp
}
```

#### `reservas`
```
{
  userId: string
  userName: string
  chanchaId: string
  chanchaName: string
  deporte: string
  fecha: string (YYYY-MM-DD)
  hora: string (HH:00)
  fechaHora: string (ISO)
  precio: number
  estado: string (pendiente, aprobada, rechazada, pospuesta, no-asistió)
  razon: string (opcional)
  createdAt: timestamp
  updatedAt: timestamp (opcional)
}
```

## Notas Importantes

1. **Sistema de No-Asistencia:**
   - Si un usuario no llega en los primeros 10 minutos después de la hora de su reserva aprobada, se marca como "no-asistió"
   - El usuario pierde una estrella automáticamente
   - Esto se verifica cuando se consulta la reserva

2. **Inhabilitación de Canchas:**
   - Se pueden inhabilitar de forma permanente
   - O por un tiempo específico (en minutos)
   - Si se especifica tiempo, se habilita automáticamente después

3. **Rutas Protegidas:**
   - `/reservar` y `/perfil` solo para usuarios logueados
   - `/admin` solo para usuarios con `isAdmin: true`

## Tecnologías

- React 19
- React Router DOM
- Firebase (Auth + Firestore)
- Tailwind CSS (CDN)
- Vite

## Próximas Mejoras (Opcional)

- Sistema de pagos
- Calificaciones entre usuarios
- Notificaciones por email
- Sistema de cancelación con penalización
- Búsqueda y filtros avanzados de canchas
