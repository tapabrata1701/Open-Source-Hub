import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import { Toaster } from 'react-hot-toast';

const pageVariants = {
  initial: { opacity: 0, y: 15, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, scale: 0.99, transition: { duration: 0.3, ease: "easeIn" } }
};

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="overflow-x-hidden min-h-screen bg-transparent text-text-main font-body">
      <Toaster 
        position="bottom-right" 
        toastOptions={{ 
          style: { background: 'rgba(30, 41, 59, 0.8)', color: '#f8fafc', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' } 
        }} 
      />
      <Navigation />
      <main className="pt-20"> {/* Fixed nav padding */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Layout;
