import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Clock, CheckCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const SPECIALTY_LABELS = {
  speech_therapy: 'علاج النطق',
  occupational_therapy: 'العلاج الوظيفي',
  behavioral_therapy: 'العلاج السلوكي',
  physical_therapy: 'العلاج الطبيعي',
  psychological: 'الدعم النفسي',
  educational: 'التعليم الخاص',
};

const SPECIALTY_COLORS = {
  speech_therapy: 'bg-blue-100 text-blue-700',
  occupational_therapy: 'bg-green-100 text-green-700',
  behavioral_therapy: 'bg-purple-100 text-purple-700',
  physical_therapy: 'bg-orange-100 text-orange-700',
  psychological: 'bg-pink-100 text-pink-700',
  educational: 'bg-teal-100 text-teal-700',
};

// Fallback mock specialists if no DB records
const MOCK_SPECIALISTS = [
  { id: 'm1', name: 'د. أحمد محمود', specialty: 'speech_therapy', experience_years: 8, rating: 4.9, available: true, bio: 'متخصص في علاج اضطرابات النطق واللغة لدى الأطفال', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 'm2', name: 'د. سلمى عبدالله', specialty: 'occupational_therapy', experience_years: 6, rating: 4.8, available: true, bio: 'خبيرة في العلاج الوظيفي وتطوير المهارات الحياتية', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 'm3', name: 'د. محمد الرشيد', specialty: 'behavioral_therapy', experience_years: 10, rating: 4.7, available: false, bio: 'متخصص في تحليل وتعديل السلوك للأطفال', image: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { id: 'm4', name: 'د. نورا الأحمد', specialty: 'psychological', experience_years: 7, rating: 4.9, available: true, bio: 'معالجة نفسية متخصصة في دعم أصحاب الهمم وعائلاتهم', image: 'https://randomuser.me/api/portraits/women/56.jpg' },
  { id: 'm5', name: 'د. خالد العمر', specialty: 'physical_therapy', experience_years: 9, rating: 4.6, available: true, bio: 'متخصص في العلاج الطبيعي وتأهيل الحركة', image: 'https://randomuser.me/api/portraits/men/67.jpg' },
  { id: 'm6', name: 'أ. ريم السالم', specialty: 'educational', experience_years: 5, rating: 4.8, available: true, bio: 'معلمة تربية خاصة متخصصة في صعوبات التعلم', image: 'https://randomuser.me/api/portraits/women/78.jpg' },
];

export default function SpecialistsModal({ onClose, onRequestSession }) {
  const [search, setSearch] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');

  const { data: dbSpecialists = [] } = useQuery({
    queryKey: ['specialists'],
    queryFn: () => base44.entities.Specialist.list(),
  });

  const specialists = dbSpecialists.length > 0 ? dbSpecialists : MOCK_SPECIALISTS;

  const filtered = specialists.filter(s => {
    const matchSearch = !search || s.name.includes(search) || SPECIALTY_LABELS[s.specialty]?.includes(search);
    const matchSpecialty = !filterSpecialty || s.specialty === filterSpecialty;
    return matchSearch && matchSpecialty;
  });

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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="gradient-primary text-white p-6 flex justify-between items-center flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold">👩‍⚕️ المتخصصون</h2>
              <p className="text-sm opacity-80 mt-1">{filtered.length} متخصص متاح</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ابحث عن متخصص..."
                className="h-10 pr-9 rounded-xl border-gray-200 text-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterSpecialty('')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  !filterSpecialty ? 'bg-[#2C5F9B] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2C5F9B]'
                }`}
              >
                الكل
              </button>
              {Object.entries(SPECIALTY_LABELS).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setFilterSpecialty(filterSpecialty === val ? '' : val)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    filterSpecialty === val ? 'bg-[#2C5F9B] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2C5F9B]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="overflow-y-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map(specialist => (
                <motion.div
                  key={specialist.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src={specialist.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop'}
                        alt={specialist.name}
                        className="w-16 h-16 rounded-2xl object-cover"
                      />
                      {specialist.available && (
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 text-sm">{specialist.name}</h3>
                      <Badge className={`${SPECIALTY_COLORS[specialist.specialty]} border-0 text-xs mt-1`}>
                        {SPECIALTY_LABELS[specialist.specialty]}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{specialist.bio}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                          <Star className="w-3 h-3 fill-amber-500" />
                          {specialist.rating || '—'}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          {specialist.experience_years || '—'} سنوات
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      toast.success(`تم إضافة ${specialist.name} إلى طلبك`);
                      onRequestSession(specialist);
                    }}
                    disabled={!specialist.available}
                    className={`w-full mt-3 h-9 rounded-xl text-xs gap-1 ${
                      specialist.available
                        ? 'bg-[#2C5F9B] hover:bg-[#1a4a7a]'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {specialist.available ? (
                      <><CheckCircle className="w-3.5 h-3.5" /> طلب جلسة</>
                    ) : 'غير متاح حالياً'}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}