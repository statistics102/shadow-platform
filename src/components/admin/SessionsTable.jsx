import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
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
  pending: { label: 'معلقة', className: 'bg-yellow-100 text-yellow-700', icon: Clock },
  completed: { label: 'مكتملة', className: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  cancelled: { label: 'ملغية', className: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function SessionsTable({ sessions = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">الجلسات</h3>
        <Badge variant="secondary" className="bg-purple-50 text-purple-700">
          {sessions.length} جلسة
        </Badge>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="text-right">المتخصص</TableHead>
              <TableHead className="text-right">نوع الجلسة</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  لا توجد جلسات بعد
                </TableCell>
              </TableRow>
            ) : (
              sessions.map(session => {
                const status = statusConfig[session.status] || statusConfig.pending;
                return (
                  <TableRow key={session.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={session.specialist_image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=40&h=40&fit=crop'}
                          className="w-8 h-8 rounded-full object-cover"
                          alt=""
                        />
                        <span className="font-medium">{session.specialist_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{sessionTypeLabels[session.session_type] || session.session_type}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {moment(session.session_date).format('DD/MM/YYYY hh:mm A')}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${status.className} border-0 gap-1`}>
                        <status.icon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}