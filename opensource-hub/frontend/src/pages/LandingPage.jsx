import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, Code2, Users, Trophy, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="relative min-h-screen">
      {/* 3D-like Glowing Background Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-accent-neon rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse-slow" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-accent-cyan rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-float" />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-10">
        
        {/* Hero Section */}
        <motion.div 
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center mt-10 md:mt-20"
        >
          <motion.div variants={itemVariants} className="inline-flex glass-super px-4 py-2 rounded-full mb-8 items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-neon animate-pulse"></span>
            <span className="text-xs sm:text-sm font-medium text-text-dim">Welcome to the future of Open Source</span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants} 
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6"
          >
            Build together. <br className="hidden sm:block" />
            <span className="text-gradient">Rise the Ranks.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-2xl text-text-dim max-w-2xl mb-12 px-4">
            A premium community platform for developers to collaborate on massive open-source projects and compete on real-time leaderboards.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col w-full sm:w-auto sm:flex-row gap-4 sm:gap-6">
            <Link to="/signup" className="w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative w-full px-8 py-4 sm:py-5 min-h-[48px] bg-white text-primary font-bold rounded-full overflow-hidden flex items-center justify-center gap-2"
              >
                <span className="relative z-10">Join the Movement</span>
                <ChevronRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} />
                <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-neon opacity-0 group-hover:opacity-20 transition-opacity" />
              </motion.button>
            </Link>
            
            <Link to="/projects" className="w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full glass px-8 py-4 sm:py-5 min-h-[48px] rounded-full font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
              >
                <Terminal size={20} />
                Explore Projects
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Preview (Scroll Triggered) */}
        <div className="mt-40 grid md:grid-cols-3 gap-8">
          {[
            { icon: <Users size={32} className="text-accent-cyan" />, title: "Elite Community", desc: "Collaborate with top-tier developers and build portfolio-defining projects." },
            { icon: <Trophy size={32} className="text-accent-neon" />, title: "Real-time Leaderboard", desc: "Automated scoring via GitHub webhooks. Watch your rank soar as you push code." },
            { icon: <Code2 size={32} className="text-white" />, title: "Curated Projects", desc: "Hand-picked repositories tailored for skill acceleration and impact." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="glass-super p-8 rounded-3xl group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="mb-6 w-16 h-16 rounded-2xl glass flex items-center justify-center group-hover:rotate-12 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-text-dim leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default LandingPage;
