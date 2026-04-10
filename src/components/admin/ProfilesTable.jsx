import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle, Clock, FileText, AlertCircle } from 'lucide-react';
import moment from 'moment';

const specialNeedLabels = {
  autism: 'طيف التوحد',
  adhd: 'فرط الحركة',
  downsyndrome: 'متلازمة داون',
  cerebralpalsy: 'الشلل الدماغي',
  learningdisability: 'صعوبات التعلم',
  speechdelay: 'تأخر النطق',
  sensory: 'اضطراب حسي',
  other: 'أخرى',
};

const statusConfig = {
  draft: { label: 'مسودة', icon: FileText, className: 'bg-gray-100 text-gray-600' },
  submitted: { label: 'مقدم', icon: Clock, className: 'bg-yellow-100 text-yellow-700' },
  reviewed: { label: 'تمت المراجعة', icon: Eye, className: 'bg-blue-100 text-blue-700' },
  active: { label: 'نشط', icon: CheckCircle, className: 'bg-green-100 text-green-700' },
};

export default function ProfilesTable({ profiles = [], onUpdateStatus }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">ملفات الأطفال</h3>
        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
          {profiles.length} ملف
        </Badge>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="text-right">اسم الطفل</TableHead>
              <TableHead className="text-right">العمر</TableHead>
              <TableHead className="text-right">الاحتياج الخاص</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">تاريخ التسجيل</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  لا توجد ملفات بعد
                </TableCell>
              </TableRow>
            ) : (
              profiles.map(profile => {
                const status = statusConfig[profile.status] || statusConfig.draft;
                return (
                  <TableRow key={profile.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium">{profile.child_name}</TableCell>
                    <TableCell>{profile.age} سنة</TableCell>
                    <TableCell>{specialNeedLabels[profile.special_need] || profile.special_need}</TableCell>
                    <TableCell>
                      <Badge className={`${status.className} border-0 gap-1`}>
                        <status.icon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {moment(profile.created_date).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {profile.status === 'submitted' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs border-blue-300 text-blue-600"
                              onClick={() => onUpdateStatus(profile.id, 'reviewed')}
                            >
                              مراجعة
                            </Button>
                            <Button
                              size="sm"
                              className="h-8 text-xs bg-green-500 hover:bg-green-600"
                              onClick={() => onUpdateStatus(profile.id, 'active')}
                            >
                              تفعيل
                            </Button>
                          </>
                        )}
                        {profile.status === 'reviewed' && (
                          <Button
                            size="sm"
                            className="h-8 text-xs bg-green-500 hover:bg-green-600"
                            onClick={() => onUpdateStatus(profile.id, 'active')}
                          >
                            تفعيل
                          </Button>
                        )}
                        {profile.status === 'active' && (
                          <Badge className="bg-green-50 text-green-600 border-0">نشط ✓</Badge>
                        )}
                      </div>
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