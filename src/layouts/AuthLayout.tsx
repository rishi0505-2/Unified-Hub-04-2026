import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const floatingShapes = [
  { id: 1, size: 280, top: '5%', left: '5%', delay: 0, duration: 7 },
  { id: 2, size: 200, top: '60%', right: '8%', delay: -2, duration: 9 },
  { id: 3, size: 150, bottom: '10%', left: '20%', delay: -4, duration: 8 },
  { id: 4, size: 100, top: '30%', right: '25%', delay: -1, duration: 6 },
];

export function AuthLayout() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 30%, #9333ea 60%, #a855f7 100%)' }}
    >
      {/* Floating decorative shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingShapes.map((s) => (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-white/[0.06] border border-white/10"
            style={{
              width: s.size,
              height: s.size,
              top: s.top,
              left: (s as { left?: string }).left,
              right: (s as { right?: string }).right,
              bottom: (s as { bottom?: string }).bottom,
            }}
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
        {/* Gradient blobs */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-violet-400/15 rounded-full blur-2xl animate-float-slow" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <Outlet />
      </motion.div>
    </div>
  );
}
