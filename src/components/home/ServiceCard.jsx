import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const badgeStyles = {
  featured: 'bg-blue-500 text-white',
  new: 'bg-yellow-400 text-gray-800',
  popular: 'bg-red-500 text-white',
};

const badgeLabels = {
  featured: 'مميز',
  new: 'جديد',
  popular: 'شائع',
};

export default function ServiceCard({ icon, iconBg, title, description, linkText, stat, badge, onClick, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      onClick={onClick}
      className="card-hover bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center text-xl`}>
          {icon}
        </div>
        {badge && (
          <span className={`${badgeStyles[badge]} px-3 py-1 rounded-full text-xs font-semibold`}>
            {badgeLabels[badge]}
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-4 leading-relaxed">{description}</p>
      <div className="flex justify-between items-center">
        <span className="text-[#2C5F9B] font-medium text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
          {linkText}
          <ArrowLeft className="w-4 h-4" />
        </span>
        <span className="text-xs text-gray-400">{stat}</span>
      </div>
    </motion.div>
  );
}