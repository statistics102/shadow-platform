import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const specialNeeds = [
  { value: 'autism', label: 'اضطراب طيف التوحد' },
  { value: 'adhd', label: 'فرط الحركة وتشتت الانتباه' },
  { value: 'downsyndrome', label: 'متلازمة داون' },
  { value: 'cerebralpalsy', label: 'الشلل الدماغي' },
  { value: 'learningdisability', label: 'صعوبات التعلم' },
  { value: 'speechdelay', label: 'تأخر النطق واللغة' },
  { value: 'sensory', label: 'اضطراب المعالجة الحسية' },
  { value: 'other', label: 'أخرى' },
];

const skills = [
  { value: 'communication', label: '💬 التواصل', emoji: '💬' },
  { value: 'social', label: '🤝 المهارات الاجتماعية', emoji: '🤝' },
  { value: 'motor', label: '⚽ المهارات الحركية', emoji: '⚽' },
  { value: 'academic', label: '📚 المهارات الأكاديمية', emoji: '📚' },
  { value: 'life', label: '🏠 المهارات الحياتية', emoji: '🏠' },
  { value: 'emotional', label: '😊 التنظيم العاطفي', emoji: '😊' },
];

const learningPrefs = [
  { value: 'visual', label: 'متعلم بصري (صور، رسوم)' },
  { value: 'auditory', label: 'متعلم سمعي (استماع، موسيقى)' },
  { value: 'kinesthetic', label: 'متعلم حركي (حركة، لمس)' },
  { value: 'mixed', label: 'أسلوب مختلط' },
  { value: 'unknown', label: 'غير متأكد بعد' },
];

export default function SpecialNeedsSection({ formData, setFormData, errors }) {
  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const toggleSkill = (skill) => {
    const current = formData.skill_development || [];
    const updated = current.includes(skill)
      ? current.filter(s => s !== skill)
      : [...current, skill];
    updateField('skill_development', updated);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-7 bg-[#4CAF50] rounded-full" />
        <h3 className="text-lg font-bold text-gray-800">الاحتياجات الخاصة والتطور</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            الاحتياج الخاص الرئيسي <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.special_need || ''} onValueChange={v => updateField('special_need', v)}>
            <SelectTrigger className={`h-12 rounded-xl bg-gray-50 border-2 ${errors.special_need ? 'border-red-400' : 'border-gray-200'}`}>
              <SelectValue placeholder="اختر الاحتياج الخاص" />
            </SelectTrigger>
            <SelectContent>
              {specialNeeds.map(n => (
                <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.special_need && <p className="text-red-500 text-xs">{errors.special_need}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">أسلوب التعلم المفضل</Label>
          <Select value={formData.learning_preference || ''} onValueChange={v => updateField('learning_preference', v)}>
            <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-2 border-gray-200">
              <SelectValue placeholder="اختر أسلوب التعلم" />
            </SelectTrigger>
            <SelectContent>
              {learningPrefs.map(p => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-sm font-semibold">مجالات تطوير المهارات</Label>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <button
                key={skill.value}
                type="button"
                onClick={() => toggleSkill(skill.value)}
                className={`chip-option px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                  (formData.skill_development || []).includes(skill.value)
                    ? 'bg-[#2C5F9B] text-white border-[#2C5F9B]'
                    : 'bg-blue-50 text-[#2C5F9B] border-blue-100 hover:border-[#2C5F9B]'
                }`}
              >
                {skill.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-sm font-semibold">التحديات اليومية</Label>
          <Textarea
            value={formData.daily_challenge || ''}
            onChange={e => updateField('daily_challenge', e.target.value)}
            placeholder="صف التحديات اليومية التي يواجهها طفلك..."
            className="min-h-[100px] rounded-xl bg-gray-50 border-2 border-gray-200 focus:bg-white resize-y"
          />
          <p className="text-xs text-gray-400 italic">اذكر التحديات المحددة التي يواجهها طفلك يومياً</p>
        </div>
      </div>
    </div>
  );
}