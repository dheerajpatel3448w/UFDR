/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { 
  Shield, 
  Upload, 
  Activity, 
  FileText, 
  Users, 
  Phone, 
  Mail, 
  MapPin,
  Twitter,

  
  Heart,
  Sparkles,
  Zap,
  Globe,
  Lock,
  Cpu
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', href: '#home', icon: Shield },
        { name: 'Upload UFDR', href: '#upload', icon: Upload },
        { name: 'Live Analysis', href: '#analysis', icon: Activity },
        { name: 'Documentation', href: '#docs', icon: FileText },
 { name: 'Login', href: '/Login', icon:Cpu },
        { name: 'Register', href: '/Register', icon:Cpu }       
      ],
    },
    {
      title: 'Features',
      links: [
        { name: 'AI Processing', href: '#ai', icon: Cpu },
        { name: 'Data Security', href: '#security', icon: Lock },
        { name: 'Real-time Results', href: '#realtime', icon: Zap },
        { name: 'Multi-format Support', href: '#formats', icon: FileText },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '#about', icon: Users },
        { name: 'Contact', href: '#contact', icon: Phone },
        { name: 'Privacy Policy', href: '#privacy', icon: Lock },
        { name: 'Terms of Service', href: '#terms', icon: FileText },
      ],
    },
  ];


  const contactInfo = [
    { icon: Mail, text: 'support@ufdr-ai.com', href: 'mailto:support@ufdr-ai.com' },
    { icon: Phone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: MapPin, text: 'San Francisco, CA', href: '#' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20"
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        
        {/* Gradient orbs */}
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="flex items-center space-x-3 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  UFDR-AI
                </h2>
                <p className="text-sm text-cyan-200/80 font-medium">
                  Forensic Intelligence
                </p>
              </div>
            </motion.div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Advanced AI-powered forensic analysis platform for digital evidence. 
              Fast, secure, and reliable UFDR processing with real-time insights.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={index}
                    href={item.href}
                    className="flex items-center space-x-3 text-gray-300 hover:text-cyan-300 transition-colors duration-300 group"
                    whileHover={{ x: 5 }}
                  >
                    <Icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">{item.text}</span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Links Sections */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                <Sparkles className="w-4 h-4 text-cyan-400 mr-2" />
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => {
                  const Icon = link.icon;
                  return (
                    <motion.li key={link.name}>
                      <motion.a
                        href={link.href}
                        className="flex items-center space-x-3 text-gray-300 hover:text-cyan-300 transition-all duration-300 group py-2"
                        whileHover={{ x: 8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-1.5 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                          <Icon className="w-3 h-3 text-cyan-400" />
                        </div>
                        <span className="text-sm font-medium">{link.name}</span>
                      </motion.a>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <motion.div 
          className="border-t border-cyan-500/20 my-12"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
          
          {/* Copyright */}
          <motion.div
            className="flex items-center space-x-2 text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="text-sm">
              © {currentYear} UFDR-AI. All rights reserved.
            </span>
            <div className="flex items-center space-x-1 text-pink-400">
              <span className="text-xs">Made with</span>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                <Heart className="w-3 h-3 fill-current" />
              </motion.div>
              <span className="text-xs">by Forensic Team</span>
            </div>
          </motion.div>

       

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.button
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Upload className="w-4 h-4" />
              <span>Start Free Analysis</span>
              <Zap className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>

        {/* Feature Badges */}
        <motion.div 
          className="flex flex-wrap justify-center items-center gap-4 mt-12 pt-8 border-t border-cyan-500/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            "🔒 SOC 2 Compliant",
            "⚡ Real-time Processing", 
            "🤖 AI-Powered Analysis",
            "🌐 Global Infrastructure",
            "📊 Advanced Analytics",
            "🛡️ Military-grade Security"
          ].map((badge, index) => (
            <motion.span
              key={badge}
              className="px-4 py-2 bg-cyan-500/10 border border-cyan-400/20 rounded-full text-cyan-300 text-xs font-medium backdrop-blur-sm"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(6, 182, 212, 0.2)",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {badge}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Floating CTA */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          delay: 2 
        }}
      >
        <motion.button
          className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 group"
          whileHover={{ 
            scale: 1.1,
            rotate: [0, -5, 5, 0],
          }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="relative">
            <Activity className="w-6 h-6" />
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>
        </motion.button>
      </motion.div>
    </footer>
  );
};

export default Footer;