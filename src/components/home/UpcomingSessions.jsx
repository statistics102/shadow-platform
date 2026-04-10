import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';

const sessionTypeLabels = {
  speech_therapy: 'جلسة تخاطب',
  occupational_therapy: 'علاج وظيفي',
  behavioral_therapy: 'علاج سلوكي',
  physical_therapy: 'علاج طبيعي',
  psychological: 'جلسة نفسية',
  educational: 'جلسة تعليمية',
};

const statusConfig = {
  confirmed: { label: 'مؤكدة', className: 'bg-green-100 text-green-700', icon: CheckCircle },
  pending: { label: 'في انتظار التأكيد', className: 'bg-yellow-100 text-yellow-700', icon: Clock },
  completed: { label: 'مكتملة', className: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  cancelled: { label: 'ملغية', className: 'bg-red-100 text-red-700', icon: AlertCircle },
};

export default function UpcomingSessions() {
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => base44.entities.Session.list('-session_date', 5),
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#2C5F9B]/10 rounded-xl flex items-center justify-center">
          <Calendar className="w-5 h-5 text-[#2C5F9B]" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">جلساتي القادمة</h2>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse flex items-center gap-4 p-4 rounded-xl bg-gray-50">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>لا توجد جلسات قادمة</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map(session => {
            const status = statusConfig[session.status] || statusConfig.pending;
            return (
              <div key={session.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/80 hover:bg-gray-50 transition-colors">
                <img
                  src={session.specialist_image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop'}
                  alt={session.specialist_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{session.specialist_name}</p>
                  <p className="text-xs text-gray-500">
                    {sessionTypeLabels[session.session_type] || session.session_type}
                    {' · '}
                    {moment(session.session_date).format('DD MMM, hh:mm A')}
                  </p>
                </div>
                <Badge className={`${status.className} border-0 text-xs`}>
                  {status.label}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}