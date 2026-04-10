import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const SERVICE_TYPES = [
  { value: 'speech_therapy', label: '🗣️ علاج النطق والتخاطب' },
  { value: 'occupational_therapy', label: '🤲 العلاج الوظيفي' },
  { value: 'behavioral_therapy', label: '🧠 العلاج السلوكي' },
  { value: 'physical_therapy', label: '⚽ العلاج الطبيعي' },
  { value: 'psychological', label: '💙 الدعم النفسي' },
  { value: 'educational', label: '📚 الجلسات التعليمية' },
];

const TIME_OPTIONS = [
  { value: 'morning', label: '🌅 صباحاً (8 - 12)' },
  { value: 'afternoon', label: '☀️ ظهراً (12 - 5)' },
  { value: 'evening', label: '🌙 مساءً (5 - 9)' },
];

export default function NewServiceRequestModal({ onClose }) {
  const [form, setForm] = useState({ service_type: '', description: '', preferred_date: '', preferred_time: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.service_type) { toast.error('يرجى اختيار نوع الخدمة'); return; }
    setLoading(true);
    await base44.entities.ServiceRequest.create({ ...form, status: 'pending' });
    setLoading(false);
    setDone(true);
    setTimeout(onClose, 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        >
          {/* Header */}
          <div className="gradient-primary text-white p-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">طلب خدمة جديدة</h2>
              <p className="text-sm opacity-80 mt-1">سيتم مراجعة طلبك والتواصل معك</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20">
              <X className="w-5 h-5" />
            </button>
          </div>

          {done ? (
            <div className="p-10 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">تم إرسال طلبك!</h3>
              <p className="text-gray-500">سيتواصل معك فريقنا قريباً لتأكيد الموعد.</p>
            </div>
          ) : (
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <Label className="font-semibold">نوع الخدمة <span className="text-red-500">*</span></Label>
                <Select value={form.service_type} onValueChange={v => update('service_type', v)}>
                  <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 bg-gray-50">
                    <SelectValue placeholder="اختر نوع الخدمة" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_TYPES.map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold">التاريخ المفضل</Label>
                  <Input
                    type="date"
                    value={form.preferred_date}
                    onChange={e => update('preferred_date', e.target.value)}
                    className="h-12 rounded-xl border-2 border-gray-200 bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">الوقت المفضل</Label>
                  <Select value={form.preferred_time} onValueChange={v => update('preferred_time', v)}>
                    <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 bg-gray-50">
                      <SelectValue placeholder="اختر الوقت" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">وصف الطلب (اختياري)</Label>
                <Textarea
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder="أخبرنا بمزيد من التفاصيل عن احتياجاتك..."
                  className="rounded-xl border-2 border-gray-200 bg-gray-50 min-h-[90px] resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={onClose} className="flex-1 h-12 rounded-xl">إلغاء</Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 h-12 rounded-xl bg-[#2C5F9B] hover:bg-[#1a4a7a] gap-2"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}