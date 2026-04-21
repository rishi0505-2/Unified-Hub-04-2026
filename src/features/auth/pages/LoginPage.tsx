import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, BarChart3, Shield, Cloud, TrendingUp } from 'lucide-react';
import { LoginForm } from '../components/LoginForm';
import { useAuth } from '@/shared/hooks/useAuth';

const features = [
  { icon: TrendingUp, label: 'Live Crypto Markets' },
  { icon: Cloud, label: 'Real-time Weather' },
  { icon: BarChart3, label: 'Analytics Dashboard' },
  { icon: Shield, label: 'Secure JWT Auth' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="bg-white rounded-3xl shadow-2xl shadow-black/25 overflow-hidden">
      {/* Brand header */}
      <div className="relative overflow-hidden px-8 py-9"
        style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 50%, #a855f7 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute -bottom-8 -left-4 w-36 h-36 bg-white/[0.07] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-12 w-16 h-16 bg-white/[0.05] rounded-full pointer-events-none" />

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="relative h-14 w-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-5 border border-white/30"
        >
          <Zap className="h-7 w-7 text-white" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-2xl font-bold text-white">
            Unified Data Hub
          </motion.h1>
          <motion.p variants={itemVariants} className="text-purple-200 text-sm mt-1">
            Your centralized analytics platform
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mt-5">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-xs text-white"
              >
                <Icon className="h-3 w-3" />
                {label}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Form section */}
      <div className="px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Sign in to your account
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Use <span className="font-medium text-primary-600">emilys</span> /{' '}
            <span className="font-medium text-primary-600">emilyspass</span> to demo
          </p>
        </motion.div>
        <LoginForm />
      </div>
    </div>
  );
}
