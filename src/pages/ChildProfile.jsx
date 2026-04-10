import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Save, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

import ProfileStepIndicator from '../components/profile/ProfileStepIndicator';
import BasicInfoSection from '../components/profile/BasicInfoSection';
import SpecialNeedsSection from '../components/profile/SpecialNeedsSection';
import AdditionalInfoSection from '../components/profile/AdditionalInfoSection';

export default function ChildProfile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    child_name: '', age: '', gender: '', relationship: '',
    special_need: '', skill_development: [], daily_challenge: '',
    learning_preference: '', current_support: '', suggestions: '', status: 'draft',
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Load existing profile if any
  const { data: profiles = [] } = useQuery({
    queryKey: ['childProfiles'],
    queryFn: () => base44.entities.ChildProfile.list('-created_date', 1),
  });

  useEffect(() => {
    if (profiles.length > 0) {
      const p = profiles[0];
      setFormData({
        child_name: p.child_name || '',
        age: p.age || '',
        gender: p.gender || '',
        relationship: p.relationship || '',
        special_need: p.special_need || '',
        skill_development: p.skill_development || [],
        daily_challenge: p.daily_challenge || '',
        learning_preference: p.learning_preference || '',
        current_support: p.current_support || '',
        suggestions: p.suggestions || '',
        status: p.status || 'draft',
      });
    }
  }, [profiles]);

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (profiles.length > 0) {
        return base44.entities.ChildProfile.update(profiles[0].id, data);
      }
      return base44.entities.ChildProfile.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childProfiles'] });
    },
  });

  const validate = () => {
    const errs = {};
    if (!formData.child_name?.trim()) errs.child_name = 'يرجى إدخال اسم الطفل';
    if (!formData.age || formData.age < 0 || formData.age > 25) errs.age = 'يرجى إدخال عمر صحيح (0-25)';
    if (!formData.gender) errs.gender = 'يرجى اختيار الجنس';
    if (!formData.relationship) errs.relationship = 'يرجى اختيار العلاقة';
    if (!formData.special_need) errs.special_need = 'يرجى اختيار الاحتياج الخاص';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveDraft = async () => {
    await saveMutation.mutateAsync({ ...formData, status: 'draft' });
    toast.success('تم حفظ المسودة بنجاح');
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    await saveMutation.mutateAsync({ ...formData, status: 'submitted' });
    setShowSuccess(true);
    setTimeout(() => {
      navigate(createPageUrl('Home'));
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-blue-50 to-sky-100 flex items-start justify-center py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        {/* Header */}
        <div className="gradient-header text-white rounded-t-2xl p-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">إعداد ملف الطفل</h1>
          <p className="opacity-90">أنشئ ملفاً شاملاً لطفلك لتخصيص تجربته العلاجية</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-10">
          <ProfileStepIndicator currentStep={2} />

          <div className="space-y-10">
            <BasicInfoSection formData={formData} setFormData={setFormData} errors={errors} />
            <SpecialNeedsSection formData={formData} setFormData={setFormData} errors={errors} />
            <AdditionalInfoSection formData={formData} setFormData={setFormData} />
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 bg-green-500 text-white p-4 rounded-xl text-center flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                تم حفظ ملف الطفل بنجاح! جاري التوجيه...
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-10 pt-8 border-t">
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl('Home'))}
              className="h-12 rounded-xl gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              رجوع
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={saveMutation.isPending}
                className="h-12 rounded-xl gap-2 border-green-500 text-green-600 hover:bg-green-50"
              >
                <Save className="w-4 h-4" />
                حفظ مسودة
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={saveMutation.isPending || showSuccess}
                className="h-12 rounded-xl gap-2 bg-[#2C5F9B] hover:bg-[#1a4a7a]"
              >
                <Send className="w-4 h-4" />
                {saveMutation.isPending ? 'جاري الحفظ...' : 'إرسال الملف'}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}