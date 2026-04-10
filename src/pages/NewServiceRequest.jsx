import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Send, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const serviceTypes = [
  { id: 'therapy', label: 'علاج طبيعي', icon: '🏥' },
  { id: 'speech', label: 'علاج نطق', icon: '🗣️' },
  { id: 'behavior', label: 'تحليل سلوك', icon: '🧠' },
  { id: 'education', label: 'دعم تعليمي', icon: '📚' },
  { id: 'psych', label: 'دعم نفسي', icon: '❤️' },
  { id: 'activity', label: 'أنشطة حركية', icon: '🏃' },
];

export default function NewServiceRequest() {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ childName: '', age: '', notes: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-lg p-10 text-center max-w-md w-full"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">تم إرسال طلبك!</h2>
          <p className="text-gray-500 mb-6">سيتواصل معك أحد المتخصصين خلال 24 ساعة.</p>
          <Link to="/">
            <Button className="bg-[#2C5F9B] hover:bg-[#1a4a7a] rounded-xl px-8">العودة للرئيسية</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link to="/" className="flex items-center gap-2 text-[#2C5F9B] mb-6 hover:opacity-75 transition-opacity">
          <ArrowRight className="w-5 h-5" />
          <span className="font-medium">العودة</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">طلب خدمة جديدة</h1>
          <p className="text-gray-500 mb-8">اختر نوع الخدمة التي تحتاجها وأكمل البيانات</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">نوع الخدمة</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {serviceTypes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelected(s.id)}
                    className={`p-4 rounded-2xl border-2 text-center transition-all ${
                      selected === s.id
                        ? 'border-[#2C5F9B] bg-[#2C5F9B]/5'
                        : 'border-gray-200 hover:border-[#2C5F9B]/40'
                    }`}
                  >
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="text-xs font-semibold text-gray-700">{s.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">اسم الطفل</label>
                <Input
                  value={form.childName}
                  onChange={(e) => setForm({ ...form, childName: e.target.value })}
                  placeholder="الاسم الكامل"
                  required
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">العمر</label>
                <Input
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  placeholder="سنوات"
                  required
                  className="rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ملاحظات إضافية</label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="أضف أي معلومات مفيدة..."
                rows={4}
                className="rounded-xl resize-none"
              />
            </div>

            <Button type="submit" className="w-full bg-[#2C5F9B] hover:bg-[#1a4a7a] h-12 rounded-xl gap-2 text-base">
              <Send className="w-4 h-4" />
              إرسال الطلب
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}