/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Upload, 
  Shield,
  FileText,
  Home,
  User,
  Phone,
  Search,
  Sparkles,
  Activity,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [isDark, setIsDark] = useState(true);
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const navItems = [
    { name: '', label: 'Home', icon: Home },
    { name: 'upload', label: 'Upload File', icon: Upload },
    { name: 'analysis', label: 'Analysis', icon: Activity },
    { name: 'upcoming', label: 'Upcoming Features ', icon: User },
    
   
  ];
  const navigate = useNavigate();

  const handleclick = (params) => {
    navigate('/upload');
    
  }
  
  
  // Custom button component with enhanced styling
  const Button = ({ children, className = '', onClick, variant = 'primary', ...props }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0";
    
    const variants = {
      primary: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white",
      secondary: "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white",
      ghost: "bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm text-gray-700 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-700/50 border border-white/20"
    };

    return (
      <button
        className={`${baseClasses} ${variants[variant]} ${className} relative overflow-hidden group`}
        onClick={onClick}
        {...props}
      >
        {/* Animated background shine */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <span className="relative z-10 flex items-center">
          {children}
        </span>
      </button>
    );
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? "bg-gradient-to-r from-slate-900/95 via-purple-900/90 to-blue-900/95 backdrop-blur-xl shadow-2xl shadow-blue-500/10 py-2 border-b border-white/10"
          : "bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 py-4"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full opacity-20">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full blur-sm"
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 5 + i * 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + i * 10}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center gap-5 ">
          
          {/* Enhanced Logo Section */}
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHoveringLogo(true)}
            onHoverEnd={() => setIsHoveringLogo(false)}
            onClick={() => setActiveLink('home')}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div 
              className="relative p-2 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl shadow-2xl"
              animate={{
                rotate: isHoveringLogo ? [0, -10, 10, 0] : 0,
                scale: isHoveringLogo ? 1.1 : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ 
                  rotate: isHoveringLogo ? 360 : 0,
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <Shield className="w-6 h-6 text-white" />
              </motion.div>
              
              {/* Pulsing glow effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 opacity-50 blur-md"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
            
            <div className="flex flex-col  w-30 ">
              <motion.h1 
                className="text-2xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent  "
                animate={{
                  backgroundPosition: isHoveringLogo ? ['0%', '100%'] : '0%',
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                style={{
                  backgroundSize: '200% 100%',
                }}
              >
                UFDR-AI
              </motion.h1>
              <div className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <p className="text-xs text-cyan-200/80 font-medium">
                  Advanced Forensic Analysis
                </p>
                <Zap className="w-3 h-3 text-cyan-400" />
              </div>
            </div>
          </motion.div>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 bg-black/20 backdrop-blur-md rounded-2xl p-1 border border-white/10">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeLink === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  className={`relative flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 group overflow-hidden ${
                    isActive
                      ? "text-white bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => {setActiveLink(item.id)
                    navigate(`/${item.name}`);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Background glow for active state */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-xl"
                      animate={{
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  )}
                  
                  <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-cyan-300' : 'group-hover:text-cyan-300'}`} />
                  <span className="relative z-10">{item.label}</span>
                  
                  {/* Animated underline */}
                  <motion.div
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    } group-hover:scale-x-100`}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Particle effect on hover */}
                  {!isActive && (
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      initial={false}
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                            x: [0, (i - 1) * 10],
                            y: [0, (i % 2 ? -1 : 1) * 8],
                          }}
                          transition={{
                            duration: 0.6,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Enhanced Right Section */}
          <div className="flex items-center space-x-3">
            
            {/* Enhanced Search Bar */}
           

            {/* Enhanced Theme Toggle */}
 

            {/* Enhanced CTA Button */}
            <motion.div
              className="relative"
              animate={{
                scale: [1, 1.02, 1],
                y: [0, -2, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Button
                onClick={() => setActiveLink('upload')}
                variant="secondary"
                className="relative overflow-hidden group"
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="mr-2"
                >
                  <Upload className="w-4 h-4" />
                </motion.div>
                <span onClick={handleclick}>Upload UFDR</span>
                
                {/* Sparkle effect */}
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                </motion.div>
              </Button>
            </motion.div>

            {/* Enhanced Mobile Menu Trigger */}
            <motion.button
              className="md:hidden p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-400/20 text-cyan-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden fixed top-20 left-4 right-4 bg-gradient-to-b from-slate-900/95 via-purple-900/95 to-blue-900/95 backdrop-blur-2xl rounded-2xl border border-cyan-500/20 shadow-2xl shadow-blue-500/20 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Mobile menu background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-transparent to-blue-500/20" />
            </div>

            <div className="relative z-10 px-4 py-6 space-y-3">
              {/* Mobile Search */}
             
              
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeLink === item.id;
                
                return (
                  <motion.button
                    key={item.id}
                    className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left transition-all duration-200 backdrop-blur-sm border ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-white border-cyan-400/30 shadow-lg shadow-cyan-500/20"
                        : "text-gray-300 border-white/5 hover:bg-white/5 hover:text-white hover:border-cyan-400/20"
                    }`}
                    onClick={() => {
                      setActiveLink(item.id);
                      setIsMobileMenuOpen(false);
                      navigate(`/${item.name}`)
                    }}
                    whileHover={{ x: 8 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-300' : ''}`} />
                    <span className="font-semibold">{item.label}</span>
                    
                    {isActive && (
                      <motion.div
                        className="ml-auto w-2 h-2 bg-cyan-400 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [1, 0.7, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
              
              <div className="pt-4 border-t border-cyan-500/20">
                <Button 
                  variant="secondary" 
                  className="w-full justify-center"
                  onClick={() => {
                    setActiveLink('upload');
                    
                    setIsMobileMenuOpen(false);
                    navigate('/analysis')
                  }}
                >
                  <Upload className="w-4 h-4 mr-2"/>
                  Start Analysis
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;