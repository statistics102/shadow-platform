import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

import AdminStatsCards from '../components/admin/AdminStatsCards';
import ProfilesTable from '../components/admin/ProfilesTable';
import SessionsTable from '../components/admin/SessionsTable';

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: profiles = [], isLoading: profilesLoading } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: () => base44.entities.ChildProfile.list('-created_date'),
  });

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['admin-sessions'],
    queryFn: () => base44.entities.Session.list('-session_date'),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => base44.entities.User.list(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.ChildProfile.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
      toast.success('تم تحديث حالة الملف');
    },
  });

  const handleUpdateStatus = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  if (user && user.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">غير مصرح</h2>
        <p className="text-gray-500">هذه الصفحة متاحة للمسؤولين فقط</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#2C5F9B]/10 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#2C5F9B]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">لوحة الإدارة</h1>
            <p className="text-sm text-gray-500">إدارة المنصة والملفات والجلسات</p>
          </div>
        </div>

        {/* Stats */}
        <AdminStatsCards profiles={profiles} sessions={sessions} users={users} />

        {/* Tables */}
        <div className="grid grid-cols-1 gap-8">
          <ProfilesTable profiles={profiles} onUpdateStatus={handleUpdateStatus} />
          <SessionsTable sessions={sessions} />
        </div>
      </motion.div>
    </div>
  );
}