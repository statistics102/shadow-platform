import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const relationships = [
  { value: 'parent', label: 'ولي أمر' },
  { value: 'mother', label: 'أم' },
  { value: 'father', label: 'أب' },
  { value: 'guardian', label: 'وصي قانوني' },
  { value: 'grandparent', label: 'جد/جدة' },
  { value: 'relative', label: 'قريب آخر' },
];

export default function BasicInfoSection({ formData, setFormData, errors }) {
  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-7 bg-[#2C5F9B] rounded-full" />
        <h3 className="text-lg font-bold text-gray-800">المعلومات الأساسية</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            اسم الطفل <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.child_name || ''}
            onChange={e => updateField('child_name', e.target.value)}
            placeholder="أدخل اسم الطفل الكامل"
            className={`h-12 rounded-xl bg-gray-50 border-2 focus:bg-white ${errors.child_name ? 'border-red-400' : 'border-gray-200'}`}
          />
          {errors.child_name && <p className="text-red-500 text-xs">{errors.child_name}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            العمر <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={0}
              max={25}
              value={formData.age || ''}
              onChange={e => updateField('age', parseInt(e.target.value) || '')}
              placeholder="العمر"
              className={`h-12 rounded-xl bg-gray-50 border-2 focus:bg-white ${errors.age ? 'border-red-400' : 'border-gray-200'}`}
            />
            <span className="text-gray-500 font-medium whitespace-nowrap">سنة</span>
          </div>
          {errors.age && <p className="text-red-500 text-xs">{errors.age}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            الجنس <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-3">
            {[
              { value: 'male', label: 'ذكر' },
              { value: 'female', label: 'أنثى' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateField('gender', opt.value)}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  formData.gender === opt.value
                    ? 'border-[#2C5F9B] bg-blue-50 text-[#2C5F9B]'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-[#2C5F9B]/40'
                } ${errors.gender ? 'border-red-400' : ''}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.gender === opt.value ? 'border-[#2C5F9B] bg-[#2C5F9B]' : 'border-gray-300'
                  }`}>
                    {formData.gender === opt.value && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  {opt.label}
                </div>
              </button>
            ))}
          </div>
          {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            علاقتك بالطفل <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.relationship || ''} onValueChange={v => updateField('relationship', v)}>
            <SelectTrigger className={`h-12 rounded-xl bg-gray-50 border-2 ${errors.relationship ? 'border-red-400' : 'border-gray-200'}`}>
              <SelectValue placeholder="اختر العلاقة" />
            </SelectTrigger>
            <SelectContent>
              {relationships.map(r => (
                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.relationship && <p className="text-red-500 text-xs">{errors.relationship}</p>}
        </div>
      </div>
    </div>
  );
}import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const SKILLS = [
  { key: 'communication', label: '💬 التواصل', color: '#2C5F9B' },
  { key: 'social', label: '🤝 الاجتماعية', color: '#4CAF50' },
  { key: 'motor', label: '⚽ الحركية', color: '#FF9800' },
  { key: 'academic', label: '📚 الأكاديمية', color: '#9C27B0' },
  { key: 'life', label: '🏠 الحياتية', color: '#0d9488' },
  { key: 'emotional', label: '😊 العاطفية', color: '#E91E63' },
];

export default function AddProgressModal({ profiles, defaultChildId, onClose, onSaved }) {
  const [form, setForm] = useState({
    child_profile_id: defaultChildId || '',
    session_date: new Date().toISOString().split('T')[0],
    specialist_name: '',
    overall_score: 70,
    notes: '',
    goals_achieved: '',
    skill_scores: Object.fromEntries(SKILLS.map(s => [s.key, 50])),
  });
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const updateSkill = (key, val) => setForm(p => ({ ...p, skill_scores: { ...p.skill_scores, [key]: val } }));

  const handleSave = async () => {
    if (!form.child_profile_id) { toast.error('يرجى اختيار ملف الطفل'); return; }
    setLoading(true);
    await base44.entities.ChildProgress.create({
      ...form,
      goals_achieved: form.goals_achieved ? form.goals_achieved.split('،').map(s => s.trim()).filter(Boolean) : [],
    });
    setLoading(false);
    toast.success('تم حفظ تقرير الجلسة');
    onSaved();
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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden"
        >
          <div className="gradient-primary text-white p-5 flex justify-between items-center flex-shrink-0">
            <div>
              <h2 className="font-bold text-lg">إضافة تقرير جلسة</h2>
              <p className="text-sm opacity-80">سجّل تقدم الطفل في كل مهارة</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20"><X className="w-5 h-5" /></button>
          </div>

          <div className="overflow-y-auto p-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {profiles.length > 1 && (
                <div className="space-y-1 col-span-2">
                  <Label className="text-sm font-semibold">ملف الطفل</Label>
                  <Select value={form.child_profile_id} onValueChange={v => update('child_profile_id', v)}>
                    <SelectTrigger className="h-11 rounded-xl border-2 border-gray-200 bg-gray-50">
                      <SelectValue placeholder="اختر الطفل" />
                    </SelectTrigger>
                    <SelectContent>
                      {profiles.map(p => <SelectItem key={p.id} value={p.id}>{p.child_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-1">
                <Label className="text-sm font-semibold">تاريخ الجلسة</Label>
                <Input type="date" value={form.session_date} onChange={e => update('session_date', e.target.value)} className="h-11 rounded-xl border-2 border-gray-200 bg-gray-50" />
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-semibold">اسم المتخصص</Label>
                <Input value={form.specialist_name} onChange={e => update('specialist_name', e.target.value)} placeholder="د. ..." className="h-11 rounded-xl border-2 border-gray-200 bg-gray-50" />
              </div>
            </div>

            {/* Overall score */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-sm font-semibold">التقييم العام</Label>
                <span className="text-lg font-bold text-[#2C5F9B]">{form.overall_score}%</span>
              </div>
              <Slider
                value={[form.overall_score]}
                onValueChange={([v]) => update('overall_score', v)}
                min={0} max={100} step={1}
                className="w-full"
              />
            </div>

            {/* Skills sliders */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">درجات المهارات</Label>
              <div className="space-y-4">
                {SKILLS.map(skill => (
                  <div key={skill.key} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{skill.label}</span>
                      <span className="text-sm font-bold" style={{ color: skill.color }}>{form.skill_scores[skill.key]}%</span>
                    </div>
                    <Slider
                      value={[form.skill_scores[skill.key]]}
                      onValueChange={([v]) => updateSkill(skill.key, v)}
                      min={0} max={100} step={1}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-semibold">الأهداف المحققة (افصل بـ ،)</Label>
              <Input value={form.goals_achieved} onChange={e => update('goals_achieved', e.target.value)} placeholder="مثال: نطق كلمة جديدة، التواصل البصري" className="h-11 rounded-xl border-2 border-gray-200 bg-gray-50" />
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-semibold">ملاحظات المتخصص</Label>
              <Textarea value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="ملاحظات حول الجلسة والتطور..." className="rounded-xl border-2 border-gray-200 bg-gray-50 min-h-[80px] resize-none" />
            </div>
          </div>

          <div className="p-4 border-t flex gap-3 flex-shrink-0">
            <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">إلغاء</Button>
            <Button onClick={handleSave} disabled={loading} className="flex-1 rounded-xl bg-[#2C5F9B] hover:bg-[#1a4a7a] gap-2">
              <Save className="w-4 h-4" />
              {loading ? 'جاري الحفظ...' : 'حفظ التقرير'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}