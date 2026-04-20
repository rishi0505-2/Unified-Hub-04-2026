import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Shield, BarChart3, Cloud } from 'lucide-react';
import { LoginForm } from '../components/LoginForm';
import { useAuth } from '@/shared/hooks/useAuth';

const features = [
  { icon: BarChart3, text: 'Live crypto market data' },
  { icon: Shield, text: 'Secure JWT authentication' },
  { icon: Cloud, text: 'Real-time weather insights' },
];

export default function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-black/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-8 text-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4"
        >
          <Zap className="h-6 w-6" />
        </motion.div>
        <h1 className="text-2xl font-bold">Unified Data Hub</h1>
        <p className="text-primary-200 text-sm mt-1">
          Your centralized analytics platform
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-xs text-primary-100">
              <Icon className="h-3.5 w-3.5" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="px-8 py-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Sign in to your account
        </h2>
        <LoginForm />
      </div>
    </div>
  );
}
