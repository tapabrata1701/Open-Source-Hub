import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Terminal, Calendar, BookOpen, Hash, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const InputField = ({ icon: Icon, type, name, placeholder, value, onChange, error }) => {
  return (
    <div className="mb-4 relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-dim">
        <Icon size={18} className={error ? "text-red-400" : ""} />
      </div>
    <motion.input
        whileFocus={{ scale: 1.01 }}
        animate={error ? { x: [-5, 5, -5, 5, 0], borderColor: '#f87171' } : { borderColor: 'rgba(255, 255, 255, 0.1)' }}
        transition={{ duration: 0.4 }}
        className={`w-full bg-white/5 border rounded-xl py-3 pl-10 pr-4 min-h-[48px] text-white placeholder-text-dim focus:outline-none focus:ring-2 focus:ring-accent-neon outline-none transition-shadow ${error ? 'border-red-400 ring-1 ring-red-400/50' : 'border-white/10'}`}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', number: '', email: '', github: '', year: '', branch: '', section: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: false });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key].trim()) newErrors[key] = true;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Proceed to next step
    navigate('/projects');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-neon rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-float" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-super p-8 md:p-10 rounded-3xl w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Join <span className="text-gradient">OSHub</span></h2>
          <p className="text-text-dim">Create your developer profile to compete.</p>
        </div>

        <div className="mb-8">
          <a 
            href="http://localhost:5000/api/auth/github"
            className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-colors group"
          >
            <Hash size={20} className="text-accent-cyan group-hover:scale-110 transition-transform" />
            Continue with GitHub
          </a>
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="px-4 text-text-dim text-sm uppercase tracking-widest font-bold">or</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div className="col-span-1 md:col-span-2">
            <InputField icon={User} type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} error={errors.name} />
          </div>
          <div className="col-span-1 md:col-span-2">
            <InputField icon={Mail} type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} error={errors.email} />
          </div>
          <InputField icon={Phone} type="tel" name="number" placeholder="Phone Number" value={formData.number} onChange={handleChange} error={errors.number} />
          <InputField icon={Terminal} type="text" name="github" placeholder="GitHub Username" value={formData.github} onChange={handleChange} error={errors.github} />
          
          <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-4">
            <InputField icon={Calendar} type="text" name="year" placeholder="Year" value={formData.year} onChange={handleChange} error={errors.year} />
            <InputField icon={BookOpen} type="text" name="branch" placeholder="Branch" value={formData.branch} onChange={handleChange} error={errors.branch} />
            <InputField icon={Hash} type="text" name="section" placeholder="Section" value={formData.section} onChange={handleChange} error={errors.section} />
          </div>

          <div className="col-span-1 md:col-span-2 mt-4 text-center">
            <p className="text-sm text-text-dim mb-4">Already have an account? <Link to="/login" className="text-accent-cyan hover:underline">Log in</Link></p>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 bg-white text-primary font-bold rounded-xl flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <span className="relative z-10">Create Profile</span>
              <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} />
              <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-neon opacity-0 group-hover:opacity-20 transition-opacity" />
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
