'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { moduleApi } from '@/apis/modules';
import { ModuleInterface } from '@/types/module';
import { 
  HomeIcon, ChevronDownIcon, MenuIcon, CloseIcon,
  getIconByName
} from '@/lib/icons/navigation';
import { RoleName, ROLE_ID_MAP } from '@/types/roles';
import { useRoles } from '@/hooks/useRoles';
import { filterNavigationByRoles } from '@/lib/utils/roleUtils';

const SidebarNavigation = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [modules, setModules] = useState<ModuleInterface[]>([]);
  // Ya no necesitamos el estado navigationItems porque usamos el filtrado directo
  const { isAuthenticated, userRoles } = useRoles();
  
  // Función para convertir IDs de roles a nombres de roles
  const convertRoleIdsToNames = (roleIds: number[]): RoleName[] => {
    return roleIds.map(id => ROLE_ID_MAP[id]).filter(Boolean) as RoleName[];
  };
  const router = useRouter();
  const [openIds, setOpenIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    primary: {
      light: 'bg-primary-50',
      main: 'bg-primary-500',
      dark: 'bg-primary-600',
      text: 'text-primary-600'
    },
    secondary: {
      light: 'bg-purple-50',
      main: 'bg-purple-500',
      text: 'text-purple-600'
    },
    success: {
      light: 'bg-green-50',
      main: 'bg-green-500',
      text: 'text-green-600'
    },
    warning: {
      light: 'bg-yellow-50',
      main: 'bg-yellow-500',
      text: 'text-yellow-600'
    },
    error: {
      light: 'bg-red-50',
      main: 'bg-red-500',
      text: 'text-red-600'
    },
    neutral: {
      light: 'bg-gray-50',
      main: 'bg-gray-100',
      dark: 'bg-gray-800',
      text: 'text-gray-600'
    }
  };

  // Función para renderizar iconos usando nuestros componentes locales
  const getIcon = (iconName: string | null) => {
    const IconComponent = getIconByName(iconName || 'home');
    return <IconComponent size={20} />;
  };

  // Cargar módulos al montar el componente
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const response = await moduleApi.fetchModuleTree();
        setModules(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching modules:', error);
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const toggleOpen = (id: number) => {
    setOpenIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Función recursiva para renderizar módulos y sus hijos
  const renderModuleItem = (module: ModuleInterface, level: number = 0) => {
    const isParent = level === 0;
    const hasChildren = module.children && module.children.length > 0;
    const isOpen = openIds.includes(module.id);
    const paddingLeft = level > 0 ? `pl-${4 + level * 4}` : '';

    const handleClick = () => {
      if (hasChildren && isParent) {
        toggleOpen(module.id);
      } else if (module.route) {
        router.push(module.route);
        if (isMobile) toggleSidebar();
      }
    };

    return (
      <div key={module.id}>
        <div 
          className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
            (isParent && isOpen)
              ? `${colors.primary.light} ${colors.primary.text} shadow-sm`
              : 'hover:bg-gray-50 text-gray-600'
          } ${!isSidebarOpen && !isMobile ? 'justify-center' : ''} ${paddingLeft}`}
          title={!isSidebarOpen && !isMobile ? module.name : module.description || ''}
          onClick={handleClick}
        >
          <span className="text-xl flex-shrink-0">{getIcon(module.icon)}</span>
          {(isSidebarOpen || isMobile) && (
            <>
              <span className="ml-3 font-medium">{module.name}</span>
              {hasChildren && (
                <ChevronDownIcon className={`ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} size={20} />
              )}
            </>
          )}
        </div>
        
        {hasChildren && isParent && (
          <div
            className={`ml-4 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
          >
            {isOpen &&
              module.children!.filter(c => c.is_active).map(child => renderModuleItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {isMobile && (
        <div className="p-4 border-b border-white/20">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MenuIcon className="text-xl text-gray-600" size={20} />
          </button>
        </div>
      )}
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 sm:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <div
        className={`
          fixed inset-y-0 left-0 z-30 bg-white/70 backdrop-blur-md shadow-md border-r border-white/30
          transition-all duration-300 sm:static
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full sm:translate-x-0 sm:w-20'}
        `}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 
              className={`text-2xl font-bold ${colors.primary.text} cursor-pointer select-none transition-all duration-200 flex items-center justify-center`}
              onClick={toggleSidebar}
            >
              {(isSidebarOpen || isMobile) ? 'H2GO' : <HomeIcon className="text-2xl" size={24} />}
            </h1>
            {isSidebarOpen && (
              <button
                onClick={toggleSidebar}
                className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <CloseIcon className="text-xl text-gray-600" size={20} />
              </button>
            )}
          </div>
          
          <div className="space-y-1">
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              // Filtrar módulos según roles del usuario usando filterNavigationByRoles
              (() => {
                // Función recursiva para procesar módulos y sus hijos
                const processModulesWithChildren = (modulesList: ModuleInterface[]): ModuleInterface[] => {
                  if (!isAuthenticated) return modulesList;
                  
                  // Convertir módulos a formato compatible con filterNavigationByRoles
                  const navigationItems = modulesList.map(module => ({
                    ...module,
                    roles: module.allowed_roles ? convertRoleIdsToNames(module.allowed_roles) : ['Administrador'] as RoleName[]
                  }));
                  
                  // Filtrar usando filterNavigationByRoles
                  const filteredItems = filterNavigationByRoles(navigationItems, userRoles || []);
                  
                  // Procesar los módulos filtrados y sus hijos
                  return filteredItems.map(item => {
                    // Encontrar el módulo original
                    const originalModule = modulesList.find(m => m.id === item.id);
                    if (!originalModule) return null;
                    
                    // Procesar hijos recursivamente si existen
                    if (originalModule.children && originalModule.children.length > 0) {
                      return {
                        ...originalModule,
                        children: processModulesWithChildren(originalModule.children)
                      };
                    }
                    
                    return originalModule;
                  }).filter(Boolean) as ModuleInterface[];
                };
                
                // Obtener módulos activos de nivel superior
                const activeModules = modules.filter(module => module.is_active && module.parent_id === null);
                
                // Si no está autenticado, mostrar todos los módulos
                if (!isAuthenticated) {
                  return activeModules.map(module => renderModuleItem(module));
                }
                
                // Procesar módulos y sus hijos con filtrado por roles
                const filteredModules = processModulesWithChildren(activeModules);
                
                // Renderizar los módulos filtrados
                return filteredModules.map(module => renderModuleItem(module));
              })()
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default SidebarNavigation