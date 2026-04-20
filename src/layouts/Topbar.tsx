import { Menu, Sun, Moon, LogOut, Bell } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function Topbar() {
  const { theme, toggleTheme, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
    toast.success('Logged out successfully');
  }

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back,{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {user?.firstName ?? 'User'}
            </span>
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notification bell (decorative) */}
        <button
          className="relative flex items-center justify-center h-9 w-9 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center h-9 w-9 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        {/* User avatar + logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-100 dark:border-gray-800">
          {user?.image && (
            <img
              src={user.image}
              alt={user.username}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-primary-100"
            />
          )}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center h-9 w-9 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950 transition-colors"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
