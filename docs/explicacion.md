# Sistema de Renderizado Condicional por Roles - AquaControl

## 🎯 Resumen

He implementado un sistema completo de renderizado condicional basado en roles para la aplicación AquaControl. Este sistema permite mostrar u ocultar componentes y funcionalidades según los roles del usuario autenticado.

## 🏗️ Arquitectura del Sistema

### Roles Disponibles
El sistema maneja 5 roles arquetipos fijos:

| ID | Nombre | Descripción | Acceso |
|----|--------|-------------|--------|
| 1 | **Administrador** | Acceso completo al sistema | 🟢 Todo el sistema |
| 2 | **Entrenador** | Administra rendimiento y estudiantes | 🟡 Módulo de reportes |
| 9 | **Asistente** | Registra asistencia y gestiona materiales | 🟡 Módulo de productos |
| 4 | **Padre** | Ve datos de estudiantes y pagos | 🔴 Vista limitada |
| 3 | **Estudiante** | Ve su propio perfil | 🔴 Vista personal |

### Permisos por Módulo
- **Administrador**: Acceso a todos los módulos
- **Asistente**: Solo módulo de productos (ventas, inventario)
- **Entrenador**: Solo módulo de reportes (estadísticas, análisis)

## 📁 Estructura de Archivos Implementada

```
src/
├── hooks/
│   ├── useAuth.ts          # Hook principal de autenticación
│   └── useRoles.ts         # Hook específico para gestión de roles
├── components/
│   └── auth/
│       ├── RoleGuard.tsx           # Componente guard para protección
│       ├── ConditionalRender.tsx   # Renderizado condicional maestro
│       ├── UnauthorizedAccess.tsx  # Componente de acceso denegado
│       ├── LoadingAuth.tsx         # Loading de autenticación
│       └── RoleBasedNavigation.tsx # Navegación dinámica
├── hocs/
│   └── withRoleProtection.tsx      # HOCs para proteger componentes
├── lib/utils/
│   ├── roleUtils.ts        # Utilidades para verificación de roles
│   └── authHelpers.ts      # Helpers de autenticación
├── types/
│   ├── auth.ts            # Tipos de autenticación (actualizado)
│   └── roles.ts           # Tipos específicos de roles
├── contexts/
│   └── RoleContext.tsx    # Contexto global de roles
└── examples/
    └── RoleExamples.tsx   # Componente de demostración
```

## 🚀 Cómo Usar el Sistema

### 1. Hook useRoles

```tsx
import { useRoles } from '@/hooks/useRoles';

function MyComponent() {
  const { 
    isAuthenticated, 
    userRoles, 
    checkRole 
  } = useRoles();

  // Verificar si es administrador
  if (checkRole.isAdmin()) {
    return <AdminContent />;
  }

  // Verificar acceso a productos
  if (checkRole.canAccessProducts()) {
    return <ProductsContent />;
  }

  return <LimitedContent />;
}
```

### 2. Componente RoleGuard

```tsx
import { RoleGuard } from '@/components/auth/RoleGuard';

// Proteger contenido para administradores y asistentes
<RoleGuard allowedRoles={['Administrador', 'Asistente']}>
  <ProductsModule />
</RoleGuard>

// Con mensaje personalizado de acceso denegado
<RoleGuard 
  allowedRoles={['Administrador']} 
  fallback={<div>Solo administradores</div>}
>
  <AdminPanel />
</RoleGuard>
```

### 3. Componente ConditionalRender

```tsx
import { ConditionalRender } from '@/components/auth/ConditionalRender';

// Mostrar contenido según roles
<ConditionalRender
  condition={{ roles: ['Administrador', 'Entrenador'] }}
  fallback={<div>Acceso restringido</div>}
>
  <ReportsSection />
</ConditionalRender>
```

### 4. Higher-Order Components (HOCs)

```tsx
import { 
  withRoleProtection, 
  withAdminOnly, 
  withProductsAccess, 
  withReportsAccess 
} from '@/hocs/withRoleProtection';

// Proteger componente específico
const ProtectedComponent = withRoleProtection(
  MyComponent, 
  ['Administrador', 'Entrenador']
);

// HOCs específicos
const AdminOnlyComponent = withAdminOnly(AdminPanel);
const ProductsComponent = withProductsAccess(ProductsPanel);
const ReportsComponent = withReportsAccess(ReportsPanel);
```

### 5. Navegación Dinámica

```tsx
import { RoleBasedNavigation } from '@/components/auth/RoleBasedNavigation';

const navigationItems = [
  {
    path: '/admin',
    roles: ['Administrador'],
    label: 'Panel de Administración',
    icon: '🛡️'
  },
  {
    path: '/productos',
    roles: ['Administrador', 'Asistente'],
    label: 'Productos',
    icon: '📦'
  },
  {
    path: '/reportes',
    roles: ['Administrador', 'Entrenador'],
    label: 'Reportes',
    icon: '📊'
  }
];

<RoleBasedNavigation items={navigationItems} />
```

## 💡 Ejemplos Prácticos Implementados

### Ejemplo 1: Página de Ventas Protegida

**Archivo**: `src/app/productos/ventas/protected-page.tsx`

```tsx
// Solo Administrador y Asistente pueden acceder
<RoleGuard allowedRoles={['Administrador', 'Asistente']}>
  <VentasContent />
</RoleGuard>
```

**Resultado**:
- ✅ **Administrador**: Ve todo el contenido + mensaje de acceso completo
- ✅ **Asistente**: Ve el contenido + mensaje de permisos limitados
- ❌ **Entrenador**: Ve mensaje de acceso denegado
- ❌ **Padre/Estudiante**: Ve mensaje de acceso denegado

### Ejemplo 2: Página de Reportes Protegida

**Archivo**: `src/app/reportes/productos/protected-page.tsx`

```tsx
// Solo Administrador y Entrenador pueden acceder
<RoleGuard allowedRoles={['Administrador', 'Entrenador']}>
  <ReportesContent />
  
  {/* Tab financiero solo para administradores */}
  {checkRole.isAdmin() && (
    <Tab key="financiero" title="Reporte Financiero">
      <FinancialReports />
    </Tab>
  )}
</RoleGuard>
```

**Resultado**:
- ✅ **Administrador**: Ve todos los reportes + tab financiero
- ✅ **Entrenador**: Ve reportes básicos (sin tab financiero)
- ❌ **Asistente**: Ve mensaje de acceso denegado
- ❌ **Padre/Estudiante**: Ve mensaje de acceso denegado

### Ejemplo 3: Componentes con HOCs

**Archivo**: `src/components/examples/RoleExamples.tsx`

```tsx
// Diferentes niveles de protección
const AdminPanel = withAdminOnly(AdminComponent);
const ProductsModule = withProductsAccess(ProductsComponent);
const ReportsModule = withReportsAccess(ReportsComponent);
```

**Resultado visual**:
- **Administrador**: Ve 4 componentes
- **Entrenador**: Ve 2 componentes (Reportes + Configuración)
- **Asistente**: Ve 2 componentes (Productos + Configuración)
- **Padre/Estudiante**: Ve 0 componentes administrativos

## 🔧 Funciones Utilitarias

### Verificación de Roles

```tsx
import { canAccessProducts, canAccessReports, isAdmin } from '@/lib/utils/roleUtils';

// Verificar acceso a módulos específicos
if (canAccessProducts(userRoles)) {
  // Mostrar módulo de productos
}

if (canAccessReports(userRoles)) {
  // Mostrar módulo de reportes
}

if (isAdmin(userRoles)) {
  // Mostrar funciones de administrador
}
```

### Filtrado de Navegación

```tsx
import { filterNavigationByRoles } from '@/lib/utils/roleUtils';

const allMenuItems = [
  { path: '/admin', roles: ['Administrador'], label: 'Admin' },
  { path: '/productos', roles: ['Administrador', 'Asistente'], label: 'Productos' },
  { path: '/reportes', roles: ['Administrador', 'Entrenador'], label: 'Reportes' }
];

// Filtrar según roles del usuario
const allowedMenuItems = filterNavigationByRoles(allMenuItems, userRoles);
```

## 🎨 Componentes de UI

### UnauthorizedAccess
Muestra un mensaje elegante cuando el usuario no tiene permisos:

```tsx
<UnauthorizedAccess 
  message="Solo administradores pueden acceder a esta sección"
/>
```

### LoadingAuth
Muestra un spinner mientras se verifican los permisos:

```tsx
<LoadingAuth message="Verificando permisos..." />
```

## 🔐 Seguridad

### Frontend (Este Sistema)
- ✅ Oculta/muestra componentes según roles
- ✅ Mejora la experiencia de usuario
- ✅ Reduce confusión al mostrar solo lo relevante

### Backend (Existente)
- ✅ Validación real de permisos en APIs
- ✅ Autenticación con JWT
- ✅ Middleware de autorización

> **Importante**: Este sistema frontend es para UX. La seguridad real está en el backend.

## 🚀 Cómo Integrar en Páginas Existentes

### Opción 1: Envolver toda la página

```tsx
// page.tsx
import { RoleGuard } from '@/components/auth/RoleGuard';

export default function ProductosPage() {
  return (
    <RoleGuard allowedRoles={['Administrador', 'Asistente']}>
      {/* Contenido existente */}
    </RoleGuard>
  );
}
```

### Opción 2: Proteger secciones específicas

```tsx
// page.tsx
import { ConditionalRender } from '@/components/auth/ConditionalRender';

export default function DashboardPage() {
  return (
    <div>
      {/* Contenido público */}
      <PublicSection />
      
      {/* Contenido para administradores */}
      <ConditionalRender condition={{ roles: ['Administrador'] }}>
        <AdminSection />
      </ConditionalRender>
      
      {/* Contenido para múltiples roles */}
      <ConditionalRender condition={{ roles: ['Administrador', 'Entrenador'] }}>
        <ReportsSection />
      </ConditionalRender>
    </div>
  );
}
```

### Opción 3: Usar HOCs

```tsx
// components/MyComponent.tsx
import { withProductsAccess } from '@/hocs/withRoleProtection';

function ProductsComponent() {
  return <div>Contenido de productos</div>;
}

export default withProductsAccess(ProductsComponent);
```

## 📋 Próximos Pasos Sugeridos

1. **Integrar en páginas existentes**: Aplicar protección a páginas sensibles
2. **Personalizar mensajes**: Adaptar mensajes de acceso denegado por contexto
3. **Añadir animaciones**: Mejorar transiciones entre estados de carga
4. **Logging**: Implementar logs de acceso para auditoría
5. **Testing**: Crear tests unitarios para verificación de roles

## 🎉 Beneficios del Sistema

- ✅ **Seguridad mejorada**: Control granular de acceso
- ✅ **UX optimizada**: Los usuarios solo ven lo relevante
- ✅ **Mantenible**: Código modular y reutilizable
- ✅ **Escalable**: Fácil agregar nuevos roles o permisos
- ✅ **TypeScript**: Tipado fuerte para prevenir errores
- ✅ **Consistente**: Diseño uniforme con glassmorphism

---

**¡El sistema está listo para usar!** 🚀

Puedes comenzar a integrar estos componentes en tus páginas existentes siguiendo los ejemplos proporcionados.