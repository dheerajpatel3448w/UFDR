/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  ChartBarIcon,
  CogIcon,
  CpuChipIcon,
  DocumentChartBarIcon,
  EyeIcon,
  ShieldCheckIcon,
  BellAlertIcon,
  UserGroupIcon,
  CloudArrowUpIcon,
  SparklesIcon,
  ClockIcon,
  CubeIcon,
  LinkIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  MicrophoneIcon
} from '@heroicons/react/24/outline';

const UpcomingFeatures = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      id: 1,
      category: 'search',
      title: 'Normal & Semantic Search',
      description: 'Perform fast keyword-based searches or semantic searches that understand the meaning of queries.',
      icon: MagnifyingGlassIcon,
      status: 'in-development',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      category: 'search',
      title: 'Hybrid Search',
      description: 'Combines keyword and semantic search for more accurate results.',
      icon: CubeIcon,
      status: 'planned',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      category: 'search',
      title: 'AI Query Classifier',
      description: 'Automatically identifies the type of user query for optimal processing.',
      icon: CpuChipIcon,
      status: 'in-development',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 4,
      category: 'search',
      title: 'Cross-Modal Search',
      description: 'Search across chats, calls, contacts, and media in a single query.',
      icon: LinkIcon,
      status: 'planned',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 5,
      category: 'search',
      title: 'Suspicious Pattern Detection',
      description: 'Detect spam, bulk messaging, and unusual call patterns like repeated midnight calls.',
      icon: ShieldCheckIcon,
      status: 'planned',
      color: 'from-red-500 to-rose-500'
    },
    {
      id: 6,
      category: 'search',
      title: 'Smart Filters',
      description: 'Filter data by date, application, contact, keywords, or risk score.',
      icon: CogIcon,
      status: 'in-development',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 7,
      category: 'visualization',
      title: 'Interactive Timeline',
      description: 'View chat and call history with customizable time filters.',
      icon: ClockIcon,
      status: 'planned',
      color: 'from-amber-500 to-yellow-500'
    },
    {
      id: 8,
      category: 'visualization',
      title: 'Network Graph',
      description: 'Represent contacts as nodes and communications as edges to detect relationships.',
      icon: UserGroupIcon,
      status: 'planned',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 9,
      category: 'visualization',
      title: 'Heatmaps',
      description: 'Visualize activity by hour or day to identify unusual patterns.',
      icon: ChartBarIcon,
      status: 'planned',
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 10,
      category: 'visualization',
      title: 'Keyword Cloud',
      description: 'Highlight frequent or suspicious words in conversations.',
      icon: CloudArrowUpIcon,
      status: 'planned',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 11,
      category: 'visualization',
      title: 'Media Gallery',
      description: 'Organize all images, videos, and audio for easy access.',
      icon: VideoCameraIcon,
      status: 'planned',
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 12,
      category: 'visualization',
      title: 'Investigator Dashboard',
      description: 'Provides an overview of total chats, calls, contacts, media, and top-risk contacts.',
      icon: EyeIcon,
      status: 'in-development',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 13,
      category: 'case-management',
      title: 'Case Linking',
      description: 'Automatically connect related UFDR reports for cross-case intelligence.',
      icon: LinkIcon,
      status: 'planned',
      color: 'from-emerald-500 to-green-500'
    },
    {
      id: 14,
      category: 'case-management',
      title: 'Role-Based Access Control',
      description: 'Assign roles like Investigator, Supervisor, or Admin for secure access.',
      icon: UserGroupIcon,
      status: 'planned',
      color: 'from-slate-500 to-gray-500'
    },
    {
      id: 15,
      category: 'case-management',
      title: 'Audit Logs',
      description: 'Track who accessed or modified data for accountability.',
      icon: DocumentTextIcon,
      status: 'planned',
      color: 'from-orange-500 to-amber-500'
    },
    {
      id: 16,
      category: 'case-management',
      title: 'File Re-Generation',
      description: 'Generate new reports based on filtered criteria.',
      icon: CogIcon,
      status: 'planned',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 17,
      category: 'case-management',
      title: 'Multi-Device Merge',
      description: 'Consolidate multiple UFDR files from the same suspect across devices.',
      icon: CubeIcon,
      status: 'planned',
      color: 'from-purple-500 to-fuchsia-500'
    },
    {
      id: 18,
      category: 'case-management',
      title: 'Notifications & Alerts',
      description: 'Receive real-time alerts on risky patterns or suspicious activity.',
      icon: BellAlertIcon,
      status: 'planned',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 19,
      category: 'ai-intelligence',
      title: 'Search Type Decider',
      description: 'AI determines the best search method for each query.',
      icon: CpuChipIcon,
      status: 'in-development',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 20,
      category: 'ai-intelligence',
      title: 'Query-to-DB Converter',
      description: 'Automatically generates database queries from user input.',
      icon: SparklesIcon,
      status: 'planned',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 21,
      category: 'ai-intelligence',
      title: 'Risk Scoring AI',
      description: 'Assigns a suspiciousness score to chats, calls, and contacts.',
      icon: ChartBarIcon,
      status: 'planned',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 22,
      category: 'ai-intelligence',
      title: 'Fraud & Scam Detection',
      description: 'Automatically flags cryptocurrency addresses, scam keywords, and fraudulent activity.',
      icon: ShieldCheckIcon,
      status: 'planned',
      color: 'from-red-500 to-rose-500'
    },
    {
      id: 23,
      category: 'ai-intelligence',
      title: 'Voice-to-Text & Sentiment Analysis',
      description: 'Converts audio to text and detects emotions like anger, threat, or urgency.',
      icon: MicrophoneIcon,
      status: 'planned',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 24,
      category: 'ai-intelligence',
      title: 'Case Summary Generator',
      description: 'Produces concise AI-generated case reports for investigators.',
      icon: DocumentChartBarIcon,
      status: 'in-development',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 25,
      category: 'data-intelligence',
      title: 'Metadata Extraction',
      description: 'Extract device and file information, including hash values.',
      icon: DocumentTextIcon,
      status: 'planned',
      color: 'from-gray-500 to-slate-500'
    },
    {
      id: 26,
      category: 'data-intelligence',
      title: 'File Integrity Check',
      description: 'Verify file authenticity to prevent tampering.',
      icon: ShieldCheckIcon,
      status: 'planned',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 27,
      category: 'data-intelligence',
      title: 'Smart File Search',
      description: 'Search files by name, type, size, or extension.',
      icon: MagnifyingGlassIcon,
      status: 'planned',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 28,
      category: 'data-intelligence',
      title: 'Sensitive Media Detection',
      description: 'Automatically flag adult or illegal media using AI vision.',
      icon: EyeIcon,
      status: 'planned',
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 29,
      category: 'data-intelligence',
      title: 'File Export to Officers',
      description: 'Generate only requested files or data for secure distribution.',
      icon: CloudArrowUpIcon,
      status: 'planned',
      color: 'from-cyan-500 to-teal-500'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Features', count: features.length, icon: SparklesIcon },
    { id: 'search', name: 'Search & Intelligence', count: features.filter(f => f.category === 'search').length, icon: MagnifyingGlassIcon },
    { id: 'visualization', name: 'Visualization & Analytics', count: features.filter(f => f.category === 'visualization').length, icon: ChartBarIcon },
    { id: 'case-management', name: 'Case Management', count: features.filter(f => f.category === 'case-management').length, icon: CogIcon },
    { id: 'ai-intelligence', name: 'AI Intelligence', count: features.filter(f => f.category === 'ai-intelligence').length, icon: CpuChipIcon },
    { id: 'data-intelligence', name: 'Data Intelligence', count: features.filter(f => f.category === 'data-intelligence').length, icon: DocumentChartBarIcon }
  ];

  const filteredFeatures = activeCategory === 'all' 
    ? features 
    : features.filter(feature => feature.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const hoverVariants = {
    initial: { scale: 1, y: 0 },
    hover: { 
      scale: 1.02, 
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white">
              Upcoming Features
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover the next generation of digital forensics intelligence. 
            We're building powerful AI-driven tools to revolutionize your investigative workflow.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-white text-gray-900 shadow-2xl'
                    : 'bg-white/10 text-white backdrop-blur-sm hover:bg-white/20'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{category.name}</span>
                <span className={`px-2 py-1 text-sm rounded-full ${
                  activeCategory === category.id
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-white/20 text-white'
                }`}>
                  {category.count}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Progress Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { label: 'Total Features', value: features.length, color: 'from-blue-500 to-cyan-500' },
            { label: 'In Development', value: features.filter(f => f.status === 'in-development').length, color: 'from-green-500 to-emerald-500' },
            { label: 'Planned', value: features.filter(f => f.status === 'planned').length, color: 'from-purple-500 to-pink-500' },
            { label: 'Categories', value: categories.length - 1, color: 'from-orange-500 to-red-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className={`bg-gradient-to-r ${stat.color} rounded-2xl p-6 text-white shadow-2xl`}
            >
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-white/80 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  variants={hoverVariants}
                  layout
                  initial="initial"
                  whileHover="hover"
                  onHoverStart={() => setHoveredFeature(feature.id)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  className={`bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-6 cursor-pointer transition-all duration-300 hover:bg-white/10 group relative overflow-hidden`}
                >
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      feature.status === 'in-development' 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {feature.status === 'in-development' ? 'In Development' : 'Planned'}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${feature.color} w-fit shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Hover Effect Line */}
                  <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${feature.color} group-hover:w-full transition-all duration-500 ease-out`} />
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Coming Soon Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16 pt-8 border-t border-white/10"
        >
          <div className="inline-flex items-center gap-2 text-white/60">
            <SparklesIcon className="h-5 w-5" />
            <span className="text-lg">More revolutionary features coming soon</span>
            <SparklesIcon className="h-5 w-5" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UpcomingFeatures;