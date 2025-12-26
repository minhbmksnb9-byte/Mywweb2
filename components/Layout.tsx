import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, MessageSquare, MessagesSquare, LogOut, Moon, Sun, Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, removeNotification } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  // Hide standard layout for login page to handle it separately or full screen
  if (location.pathname === '/login') {
    return <Outlet />;
  }

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <NavLink 
      to={to} 
      onClick={() => setIsMobileMenuOpen(false)}
      className={({ isActive }) => 
        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`
      }
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm animate-slide-up flex items-center space-x-2 ${
              n.type === 'error' ? 'bg-red-500' : 
              n.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
            }`}
          >
             <span>{n.message}</span>
             <button onClick={() => removeNotification(n.id)} className="opacity-80 hover:opacity-100"><X className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      {/* Mobile Header */}
      <div className="md:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sticky top-0 z-40">
         <div className="font-bold text-xl text-blue-600">Nexus</div>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 dark:text-slate-300">
           {isMobileMenuOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-16 md:top-0 left-0 w-full md:w-72 h-[calc(100vh-4rem)] md:h-screen 
        bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
        transition-transform duration-300 z-30
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-6 hidden md:block">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Nexus Social
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 md:mt-0">
          <NavItem to="/" icon={Home} label="Home (Admin)" />
          <NavItem to="/forum" icon={MessageSquare} label="Community Forum" />
          <NavItem to="/chat" icon={MessagesSquare} label="Messages" />
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-sm text-slate-500">Appearance</span>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          
          {user ? (
            <div className="flex items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
              <div className="ml-3 flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate capitalize">{user.role}</p>
              </div>
              <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="block w-full text-center py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              Sign In
            </NavLink>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-slate-50 dark:bg-black/20 overflow-y-auto h-[calc(100vh-4rem)] md:h-screen scrollbar-hide">
        <div className="max-w-2xl mx-auto py-6 px-4 md:px-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;