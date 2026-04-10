import React from 'react';
import { motion } from 'framer-motion';

const stats = [
{ value: '1,247', label: 'مستفيد' },
{ value: '356', label: 'متخصص' },
{ value: '892', label: 'جلسة مكتملة' }];


export default function StatsBar() {
  return (
    <div className="text-[hsl(var(--chart-3))] flex gap-8">
      {stats.map((stat, i) =>
      <motion.div
        key={stat.label}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 + i * 0.1 }}
        className="text-center">
        
          <div className="text-2xl font-bold">{stat.value}</div>
          <div className="text-sm opacity-80">{stat.label}</div>
        </motion.div>
      )}
    </div>);

}