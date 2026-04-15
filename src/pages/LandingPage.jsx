import React from 'react';
import { Wind, CloudRain, Eye } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import customLogo from '../assets/images/hero_image.png';
import Button from '../components/Button';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 12
      } 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-white px-4 py-12 overflow-hidden">
      
      {/* Top Logo Illustration */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="mb-8"
      >
        <img src={customLogo} alt="Weather Illustration" className="w-56 h-auto object-contain drop-shadow-xl" />
      </motion.div>

      {/* Main Heading Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center max-w-3xl flex flex-col items-center"
      >
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-tight mb-8">
          <span className="block text-[#2A3746]">Stay Ahead</span>
          <span className="block text-[#4A90E2]">of the Storm</span>
        </h1>
        
        <p className="text-xl md:text-2xl font-semibold text-black mb-10 leading-relaxed max-w-2xl mx-auto">
          Experience high-fidelity weather insights wrapped in a premium editorial interface. Precision data meets atmospheric elegance.
        </p>

        <Button to="/dashboard" className="mb-20">
          Explore Data
        </Button>
      </motion.div>

      {/* Feature Cards Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
      >
        
        {/* Card 1 */}
        <motion.div variants={cardVariants} className="bg-white border text-left border-blue-300 rounded-xl p-8 flex flex-col justify-start hover:shadow-lg transition-shadow duration-300">
          <div className="text-[#4A90E2] mb-6 transform transition-transform hover:scale-110 origin-left">
            <Wind size={36} strokeWidth={2} />
          </div>
          <h3 className="text-sm font-medium text-black mb-4">Wind Velocity</h3>
          <p className="text-xs text-black leading-relaxed font-medium">
            Real-time tracking of atmospheric pressure shifts and gust patterns across global meridians.
          </p>
        </motion.div>

        {/* Card 2 */}
        <motion.div variants={cardVariants} className="bg-white border text-left border-blue-300 rounded-xl p-8 flex flex-col justify-start hover:shadow-lg transition-shadow duration-300">
          <div className="text-[#4A90E2] mb-6 transform transition-transform hover:scale-110 origin-left">
            <CloudRain size={36} strokeWidth={2} />
          </div>
          <h3 className="text-sm font-medium text-black mb-4">Percipitation</h3>
          <p className="text-xs text-black leading-relaxed font-medium">
            Advanced algorithmic modeling for hyper-local rainfall forecasting with 98% accuracy.
          </p>
        </motion.div>

        {/* Card 3 */}
        <motion.div variants={cardVariants} className="bg-white border text-left border-blue-300 rounded-xl p-8 flex flex-col justify-start hover:shadow-lg transition-shadow duration-300">
          <div className="text-[#4A90E2] mb-6 transform transition-transform hover:scale-110 origin-left">
            <Eye size={36} strokeWidth={2} />
          </div>
          <h3 className="text-sm font-medium text-black mb-4">Visual Clarity</h3>
          <p className="text-xs text-black leading-relaxed font-medium">
            Atmospheric haze and particulate measurements designed for professional aviation standards.
          </p>
        </motion.div>

      </motion.div>

    </div>
  );
};

export default LandingPage;
