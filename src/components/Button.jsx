import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Button = ({ children, to, onClick, className = '' }) => {
  const baseStyles = 'inline-block bg-[#4A90E2] text-white font-semibold text-lg px-8 py-3 rounded-md hover:bg-blue-600 shadow-sm transition-colors text-center cursor-pointer';
  
  const content = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={`${baseStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );

  if (to) {
    return <Link to={to} className="inline-block">{content}</Link>;
  }

  return content;
};

export default Button;