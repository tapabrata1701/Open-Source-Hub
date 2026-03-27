import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Terminal, MessageSquare, ArrowRight } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const Confirmation = () => {
  const location = useLocation();
  const count = location.state?.selectedCount || 1;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-cyan rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse-slow" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="glass-super p-6 md:p-10 rounded-3xl w-full max-w-2xl text-center relative z-10 mx-4"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 md:w-24 md:h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-[0_0_40px_rgba(74,222,128,0.3)]"
        >
          <CheckCircle size={40} className="md:w-12 md:h-12" />
        </motion.div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Registration Complete</h2>
        <p className="text-lg md:text-xl text-text-dim mb-8 md:mb-10">You've successfully secured your spot for <span className="text-accent-neon font-bold">{count} Project{count > 1 ? 's' : ''}</span>. The leaderboard is now active.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
          <a href="#" className="glass p-6 rounded-2xl flex flex-col items-center justify-center gap-4 group hover:-translate-y-2 transition-transform">
            <MessageSquare size={32} className="text-accent-cyan group-hover:scale-110 transition-transform" />
            <span className="font-bold">Join Discord Server</span>
          </a>
          <a href="#" className="glass p-6 rounded-2xl flex flex-col items-center justify-center gap-4 group hover:-translate-y-2 transition-transform">
            <Terminal size={32} className="text-accent-neon group-hover:scale-110 transition-transform" />
            <span className="font-bold">View GitHub Repos</span>
          </a>
        </div>
        
        <Link to="/leaderboard" className="mx-auto mt-4 px-8 py-4 bg-white text-primary font-bold rounded-full overflow-hidden flex items-center justify-center gap-2 group w-full md:w-auto hover:scale-105 transition-transform">
          Go to Leaderboard <ArrowRight size={18} />
        </Link>
      </motion.div>
    </div>
  );
};

export default Confirmation;
