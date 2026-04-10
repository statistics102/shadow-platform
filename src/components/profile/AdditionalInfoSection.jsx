import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AdditionalInfoSection({ formData, setFormData }) {
  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-7 bg-[#FF9800] rounded-full" />
        <h3 className="text-lg font-bold text-gray-800">الدعم الحالي ومعلومات إضافية</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">أنظمة الدعم الحالية</Label>
          <Textarea
            value={formData.current_support || ''}
            onChange={e => updateField('current_support', e.target.value)}
            placeholder="صف العلاجات الحالية، التدخلات، الدعم المدرسي، الرعاية الطبية..."
            className="min-h-[120px] rounded-xl bg-gray-50 border-2 border-gray-200 focus:bg-white resize-y"
          />
          <p className="text-xs text-gray-400 italic">يشمل: المعالجين، الأدوية، خطط التعليم، التسهيلات المدرسية</p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">معلومات واقتراحات إضافية</Label>
          <Textarea
            value={formData.suggestions || ''}
            onChange={e => updateField('suggestions', e.target.value)}
            placeholder="أي معلومات إضافية عن طفلك، أهداف محددة، تفضيلات، أو اقتراحات..."
            className="min-h-[120px] rounded-xl bg-gray-50 border-2 border-gray-200 focus:bg-white resize-y"
          />
          <p className="text-xs text-gray-400 italic">أخبرنا بأي شيء آخر يساعدنا في دعم طفلك بشكل أفضل</p>
        </div>
      </div>
    </div>
  );
}