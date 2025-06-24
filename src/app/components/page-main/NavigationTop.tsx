"use client";
import { FiBell, FiSearch, FiDroplet, FiLogOut, FiUser } from "react-icons/fi";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const NavigationTop = () => {
  const { data: session, status } = useSession();
  
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <header className="bg-white/70 backdrop-blur-md shadow-sm border-b border-white/30">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center">
          <FiDroplet className="text-blue-500 text-2xl mr-2" />
          <span className="text-xl font-bold text-gray-800">Aqua Control</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <FiSearch className="text-xl text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <FiBell className="text-xl text-gray-600" />
          </button>
          
          {status === "loading" ? (
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : session ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="text-sm font-medium text-gray-700">
                  {session.user?.username || session.user?.name || session.user?.email}
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                  <FiUser className="text-blue-500" />
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors flex items-center"
                title="Cerrar sesión"
              >
                <FiLogOut className="text-lg" />
              </button>
            </div>
          ) : (
            <Link 
              href="/auth/login"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default NavigationTop;
