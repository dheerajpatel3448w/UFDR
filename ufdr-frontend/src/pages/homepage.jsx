/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  ChartBarIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  DocumentChartBarIcon,
  EyeIcon,
  ArrowRightIcon,
  PlayIcon,
  UserGroupIcon,
  ClockIcon,
  CloudArrowUpIcon,
  SparklesIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

const Homepage = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const navigate = useNavigate();

  const { ref: heroRef, inView: heroInView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  const { ref: featuresRef, inView: featuresInView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const features = [
    {
      icon: MagnifyingGlassIcon,
      title: 'AI-Powered Search',
      description: 'Intelligent semantic search across all data types with hybrid search capabilities.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: ChartBarIcon,
      title: 'Advanced Analytics',
      description: 'Visualize patterns with interactive timelines, network graphs, and heatmaps.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: CpuChipIcon,
      title: 'Machine Learning',
      description: 'Automated risk scoring, fraud detection, and sentiment analysis.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Security Focused',
      description: 'Role-based access control, audit logs, and file integrity verification.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { number: '50x', label: 'Faster Analysis' },
    { number: '99.9%', label: 'Accuracy Rate' },
    { number: '24/7', label: 'AI Monitoring' },
    { number: '100+', label: 'Detection Patterns' }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Upload UFDR Files',
      description: 'Securely upload device forensic reports from multiple sources',
      icon: CloudArrowUpIcon
    },
    {
      step: '02',
      title: 'AI Processing',
      description: 'Our AI automatically extracts and categorizes all evidence',
      icon: CpuChipIcon
    },
    {
      step: '03',
      title: 'Interactive Analysis',
      description: 'Use intelligent search and visualization tools to investigate',
      icon: MagnifyingGlassIcon
    },
    {
      step: '04',
      title: 'Generate Reports',
      description: 'Create comprehensive case reports with AI-generated insights',
      icon: DocumentChartBarIcon
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, features.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent"></div>
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatePresence>
            {heroInView && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="text-center"
              >
                <motion.div variants={itemVariants} className="inline-flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl shadow-2xl">
                    <CpuChipIcon className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-lg text-gray-300 font-semibold">UFDR AI Tool Analyzer</span>
                </motion.div>

                <motion.h1 
                  variants={itemVariants}
                  className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight"
                >
                  Digital Forensics
                  <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Reimagined
                  </span>
                </motion.h1>

                <motion.p 
                  variants={itemVariants}
                  className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
                >
                  Advanced AI-powered platform for analyzing device forensic data. 
                  Extract actionable intelligence from UFDR files with unprecedented speed and accuracy.
                </motion.p>

                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold text-lg px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3"
                    onClick={()=>navigate('/analysis')}
                  >
                    Start Analysis
                    <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group border-2 border-white/20 text-white font-semibold text-lg px-8 py-4 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300 flex items-center gap-3"
                  >
                    <PlayIcon className="h-5 w-5" />
                    Watch Demo
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful Features for
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Modern Investigations
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Leverage cutting-edge AI and machine learning to transform raw device data into actionable intelligence.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Features List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
                    currentFeature === index
                      ? 'bg-white/10 border-white/20 shadow-2xl scale-105'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onMouseEnter={() => {
                    setIsPlaying(false);
                    setCurrentFeature(index);
                  }}
                  onMouseLeave={() => setIsPlaying(true)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Feature Visualization */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFeature}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <div className={`p-6 rounded-2xl bg-gradient-to-r ${features[currentFeature].color} w-20 h-20 mx-auto mb-6 shadow-2xl`}>
                      {React.createElement(features[currentFeature].icon, { className: "h-8 w-8 text-white" })}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {features[currentFeature].title}
                    </h3>
                    <p className="text-gray-300 text-lg">
                      {features[currentFeature].description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Animated Network Graph Background */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-10">
                  <div className="absolute w-32 h-32 border-2 border-cyan-400 rounded-full top-1/4 left-1/4 animate-ping"></div>
                  <div className="absolute w-24 h-24 border-2 border-blue-400 rounded-full bottom-1/3 right-1/3 animate-pulse"></div>
                  <div className="absolute w-16 h-16 border-2 border-cyan-400 rounded-full top-1/2 left-1/2 animate-bounce"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From raw device data to actionable intelligence in four simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl p-12 backdrop-blur-sm border border-white/10"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Investigations?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join leading investigative agencies using UFDR AI Tool Analyzer to solve cases faster and more effectively.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold text-lg px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300"
              onClick={(()=>navigate('/analysis'))}
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl">
              <CpuChipIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg text-white font-semibold">UFDR AI Tool Analyzer</span>
          </div>
          <p className="text-gray-400">
            Advanced Digital Forensics Platform • Powered by AI & Machine Learning
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;