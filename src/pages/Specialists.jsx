import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Calendar, Search, X, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

function BookingModal({ specialist, onClose }) {
  const [form, setForm] = useState({ childName: '', date: '', time: 'morning', notes: '' });
  const [done, setDone] = useState(false);

  const timeOptions = [
    { value: 'morning', label: 'صباحاً (٩ص - ١٢م)' },
    { value: 'afternoon', label: 'ظهراً (١٢م - ٤م)' },
    { value: 'evening', label: 'مساءً (٤م - ٨م)' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 relative"
      >
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        {done ? (
          <div className="text-center py-6">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-gray-800 mb-1">تم الحجز بنجاح!</h3>
            <p className="text-gray-500 text-sm mb-4">سيتم تأكيد موعدك مع {specialist.name} قريباً.</p>
            <Button onClick={onClose} className="bg-[#2C5F9B] hover:bg-[#1a4a7a] rounded-xl px-8">حسناً</Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl">{specialist.avatar}</div>
              <div>
                <h3 className="font-bold text-gray-800">{specialist.name}</h3>
                <p className="text-sm text-gray-500">{specialist.specialty}</p>
              </div>
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">حجز جلسة</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">اسم الطفل</label>
                <Input value={form.childName} onChange={e => setForm({...form, childName: e.target.value})} placeholder="الاسم الكامل" required className="rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">التاريخ المفضل</label>
                <Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required className="rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الوقت المفضل</label>
                <div className="flex gap-2 flex-wrap">
                  {timeOptions.map(t => (
                    <button key={t.value} type="button" onClick={() => setForm({...form, time: t.value})}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        form.time === t.value ? 'border-[#2C5F9B] bg-[#2C5F9B]/5 text-[#2C5F9B]' : 'border-gray-200 text-gray-600'
                      }`}>{t.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">ملاحظات</label>
                <Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="أي معلومات إضافية..." rows={3} className="rounded-xl resize-none" />
              </div>
              <Button type="submit" className="w-full bg-[#2C5F9B] hover:bg-[#1a4a7a] rounded-xl h-11 gap-2">
                <Calendar className="w-4 h-4" />
                تأكيد الحجز
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

const specialists = [
  { id: 1, name: 'د. سارة الأحمدي', specialty: 'علاج نطق وتواصل', rating: 4.9, sessions: 320, available: true, avatar: '👩‍⚕️', experience: '١٢ سنة' },
  { id: 2, name: 'د. خالد المنصور', specialty: 'تحليل سلوك تطبيقي', rating: 4.8, sessions: 210, available: true, avatar: '👨‍⚕️', experience: '٩ سنوات' },
  { id: 3, name: 'أ. نورة السالم', specialty: 'دعم نفسي وتربوي', rating: 4.7, sessions: 180, available: false, avatar: '👩‍🏫', experience: '٧ سنوات' },
  { id: 4, name: 'د. فيصل العتيبي', specialty: 'علاج طبيعي وحركي', rating: 4.9, sessions: 450, available: true, avatar: '🧑‍⚕️', experience: '١٥ سنة' },
  { id: 5, name: 'أ. ريم الزهراني', specialty: 'تعليم خاص وتوحد', rating: 4.6, sessions: 160, available: true, avatar: '👩‍🏫', experience: '٦ سنوات' },
  { id: 6, name: 'د. أحمد القحطاني', specialty: 'طب أطفال النمو', rating: 4.8, sessions: 390, available: false, avatar: '👨‍⚕️', experience: '١١ سنة' },
];

const filters = ['الكل', 'نطق', 'سلوك', 'نفسي', 'حركي', 'تعليم'];

export default function Specialists() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('الكل');
  const [bookingSpecialist, setBookingSpecialist] = useState(null);

  const filtered = specialists.filter(s =>
    s.name.includes(search) || s.specialty.includes(search)
  );

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="flex items-center gap-2 text-[#2C5F9B] mb-6 hover:opacity-75 transition-opacity">
          <ArrowRight className="w-5 h-5" />
          <span className="font-medium">العودة</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">المتخصصون</h1>
          <p className="text-gray-500">١٥ متخصص معتمد متاح الآن</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث عن متخصص..."
              className="rounded-xl pr-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeFilter === f ? 'bg-[#2C5F9B] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#2C5F9B]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                  {s.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800">{s.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {s.available ? 'متاح' : 'مشغول'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{s.specialty}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      {s.rating}
                    </span>
                    <span>{s.sessions} جلسة</span>
                    <span>خبرة {s.experience}</span>
                  </div>
                </div>
              </div>
              <Button
                disabled={!s.available}
                onClick={() => s.available && setBookingSpecialist(s)}
                className="w-full mt-4 rounded-xl gap-2 bg-[#2C5F9B] hover:bg-[#1a4a7a] disabled:opacity-50"
                size="sm"
              >
                <Calendar className="w-4 h-4" />
                حجز جلسة
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    {bookingSpecialist && <BookingModal specialist={bookingSpecialist} onClose={() => setBookingSpecialist(null)} />}
    </div>
  );
}