import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, Calendar, TrendingUp } from 'lucide-react';

export default function AdminStatsCards({ profiles = [], sessions = [], users = [] }) {
  const cards = [
    {
      title: 'إجمالي المستفيدين',
      value: profiles.length,
      icon: Users,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'المتخصصون',
      value: users.filter(u => u.role === 'admin').length,
      icon: UserCheck,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'الجلسات',
      value: sessions.length,
      icon: Calendar,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'ملفات جديدة',
      value: profiles.filter(p => p.status === 'submitted').length,
      icon: TrendingUp,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden"
        >
          <div className={`absolute top-0 left-0 w-28 h-28 ${card.color} opacity-5 rounded-full -translate-x-10 -translate-y-10`} />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-gray-800">{card.value}</p>
            </div>
            <div className={`${card.lightColor} p-3 rounded-xl`}>
              <card.icon className={`w-5 h-5 ${card.textColor}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}