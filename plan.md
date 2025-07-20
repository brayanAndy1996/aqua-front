# Plan: Sistema de Renderizado Condicional por Roles

## Análisis de la Situación Actual

Basándome en el código de NextAuth y la base de datos PostgreSQL:
- Los roles están disponibles en `session.user.roles` como un array de objetos
- La estructura del token muestra: `user: { id, email, nombre_completo, roles: [ [Object] ] }`
- Los roles son arquetipos fijos en el sistema: Administrador, Entrenador, Asistente, Padre y Estudiante
- Cada rol tiene un id, name, description e icon
- No se utilizará un sistema de permisos, solo roles

## Estrategia Propuesta: Sistema de Componentes Maestros con HOCs y Hooks

### Enfoque Principal
Crear un sistema modular que combine:
1. **Hook personalizado** para gestión de roles
2. **Higher-Order Component (HOC)** para protección de componentes
3. **Componente maestro** para renderizado condicional
4. **Utilidades** para verificación de roles

## Lista Desglosada de Tareas

### 📋 Fase 1: Análisis y Preparación
- [ ] **Tarea 1.1**: Examinar la estructura exacta de `roles` en la respuesta de la API
- [ ] **Tarea 1.2**: Definir los tipos TypeScript para roles
- [ ] **Tarea 1.3**: Crear interfaces para el sistema de autorización
- [ ] **Tarea 1.4**: Documentar los roles existentes en el sistema (Administrador, Entrenador, Asistente, Padre, Estudiante)

### 🔧 Fase 2: Infraestructura Base
- [ ] **Tarea 2.1**: Actualizar tipos de NextAuth para incluir roles
- [ ] **Tarea 2.2**: Crear hook `useAuth` mejorado con gestión de roles
- [ ] **Tarea 2.3**: Crear hook `useRoles` para verificación de roles
- [ ] **Tarea 2.4**: Crear utilidades helper para comparación de roles

### 🛡️ Fase 3: Componentes de Protección
- [ ] **Tarea 3.1**: Crear HOC `withRoleProtection` para proteger componentes
- [ ] **Tarea 3.2**: Crear componente `RoleGuard` para renderizado condicional
- [ ] **Tarea 3.3**: Crear componente `ConditionalRender` maestro

### 🎨 Fase 4: Componentes de UI
- [ ] **Tarea 4.1**: Crear componente `UnauthorizedAccess` para mostrar cuando no hay acceso
- [ ] **Tarea 4.2**: Crear componente `LoadingAuth` para estados de carga
- [ ] **Tarea 4.3**: Crear componente `RoleBasedNavigation` para menús dinámicos
- [ ] **Tarea 4.4**: Crear componente `ActionButton` con roles condicionales

### 🔄 Fase 5: Integración
- [ ] **Tarea 5.1**: Integrar el sistema con las páginas existentes
- [ ] **Tarea 5.2**: Actualizar la navegación principal con roles
- [ ] **Tarea 5.3**: Crear contexto global para gestión de roles

## Estructura de Archivos Propuesta

```
src/
├── hooks/
│   ├── useAuth.ts (mejorado)
│   └── useRoles.ts
├── components/
│   └── auth/
│       ├── RoleGuard.tsx
│       ├── ConditionalRender.tsx
│       ├── UnauthorizedAccess.tsx
│       ├── LoadingAuth.tsx
│       └── RoleBasedNavigation.tsx
├── hocs/
│   └── withRoleProtection.tsx
├── lib/
│   └── utils/
│       ├── roleUtils.ts
│       └── authHelpers.ts
├── types/
│   ├── auth.ts (actualizado)
│   └── roles.ts
└── contexts/
    └── RoleContext.tsx
```

## Ejemplos de Uso Planificados

### 1. Protección de Componentes
```tsx
// Con HOC
const ProtectedComponent = withRoleProtection(MyComponent, ['Administrador', 'Entrenador']);

// Con componente guard
<RoleGuard allowedRoles={['Administrador']}>
  <AdminPanel />
</RoleGuard>
```

### 2. Renderizado Condicional
```tsx
<ConditionalRender
  condition={{ roles: ['Administrador', 'Entrenador'] }}
  fallback={<UnauthorizedAccess />}
>
  <ReportsSection />
</ConditionalRender>
```

### 3. Navegación Dinámica
```tsx
<RoleBasedNavigation
  items={[
    { path: '/admin', roles: ['Administrador'], label: 'Panel de Administración' },
    { path: '/reportes', roles: ['Administrador', 'Entrenador'], label: 'Reportes' },
    { path: '/asistencia', roles: ['Administrador', 'Entrenador', 'Asistente'], label: 'Asistencia' },
  ]}
/>
```

## Consideraciones Técnicas

### Rendimiento
- Usar `useMemo` y `useCallback` para optimizar re-renders
- Implementar lazy loading para componentes protegidos
- Cache de roles en contexto global

### Seguridad
- Confiar en la validación del backend (API)
- No exponer información sensible en el cliente
- Mantener los roles como arquetipos fijos

### Escalabilidad
- Sistema modular y extensible
- Adaptable a los roles existentes (Administrador, Entrenador, Asistente, Padre, Estudiante)
- Configuración centralizada

## Roles del Sistema

| ID | Nombre | Descripción | Icono |
|----|--------|-------------|-------|
| 1 | Administrador | Acceso completo al sistema | shield |
| 2 | Entrenador | Administra rendimiento y visualiza información de estudiantes | user-cog |
| 9 | Asistente | Registra asistencia y gestiona materiales | clipboard-list |
| 4 | Padre | Ve datos de estudiantes, administra pagos | parent |
| 3 | Estudiante | Ve su propio perfil y rendimiento | graduation-cap |

## Próximos Pasos

1. **Confirmar el enfoque**: ¿Te parece adecuada esta estrategia?
2. **Priorizar fases**: ¿Qué fase quieres que implemente primero?
3. **Detalles específicos**: ¿Hay algún componente o página que necesite protección inmediata?
4. **Integración**: ¿Qué páginas existentes necesitan renderizado condicional por roles?

¿Estás de acuerdo con este plan actualizado? ¿Hay algo que quieras modificar o agregar antes de comenzar la implementación?