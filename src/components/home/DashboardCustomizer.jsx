import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GripVertical, Eye, EyeOff, Bell, BellOff, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const SESSION_TYPE_LABELS = {
  speech_therapy: '🗣️ علاج النطق',
  occupational_therapy: '🤲 العلاج الوظيفي',
  behavioral_therapy: '🧠 العلاج السلوكي',
  physical_therapy: '⚽ العلاج الطبيعي',
  psychological: '💙 الدعم النفسي',
  educational: '📚 الجلسات التعليمية',
};

export default function DashboardCustomizer({ sections, notifications, onSave, onClose }) {
  const [localSections, setLocalSections] = useState(sections);
  const [localNotifs, setLocalNotifs] = useState(notifications);
  const [dragging, setDragging] = useState(null);

  const toggleSection = (id) => {
    setLocalSections(prev =>
      prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s)
    );
  };

  const toggleNotif = (key) => {
    setLocalNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDragStart = (e, idx) => {
    setDragging(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (dragging === null || dragging === idx) return;
    const updated = [...localSections];
    const [moved] = updated.splice(dragging, 1);
    updated.splice(idx, 0, moved);
    setLocalSections(updated);
    setDragging(idx);
  };

  const handleSave = () => {
    onSave(localSections, localNotifs);
    toast.success('تم حفظ إعدادات لوحة التحكم');
    onClose();
  };

  const activeNotifCount = Object.values(localNotifs).filter(Boolean).length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50 flex justify-end"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="gradient-primary text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings2 className="w-5 h-5" />
              <div>
                <h2 className="font-bold text-lg">تخصيص لوحة التحكم</h2>
                <p className="text-sm opacity-80">اضبط الأقسام والإشعارات</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-8">
            {/* Sections */}
            <div>
              <h3 className="font-bold text-gray-700 mb-1">📌 الأقسام</h3>
              <p className="text-xs text-gray-400 mb-4">اسحب لإعادة الترتيب، أو أخفِ القسم</p>
              <div className="space-y-2">
                {localSections.map((section, idx) => (
                  <div
                    key={section.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnd={() => setDragging(null)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-grab active:cursor-grabbing select-none ${
                      dragging === idx
                        ? 'border-[#2C5F9B] bg-blue-50 scale-[1.02]'
                        : 'border-gray-200 bg-gray-50'
                    } ${!section.visible ? 'opacity-50' : ''}`}
                  >
                    <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="flex-1 text-sm font-medium text-gray-700">{section.label}</span>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        section.visible ? 'text-[#2C5F9B] hover:bg-blue-100' : 'text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-gray-700">🔔 إشعارات الجلسات</h3>
                {activeNotifCount > 0 && (
                  <span className="text-xs bg-[#2C5F9B] text-white px-2 py-0.5 rounded-full">
                    {activeNotifCount} نشط
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mb-4">فعّل التنبيهات لأنواع الجلسات التي تهمك</p>
              <div className="space-y-3">
                {Object.entries(SESSION_TYPE_LABELS).map(([key, label]) => (
                  <div
                    key={key}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      localNotifs[key] ? 'border-[#2C5F9B]/40 bg-blue-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <Label htmlFor={`notif-${key}`} className="text-sm font-medium cursor-pointer flex items-center gap-2">
                      {localNotifs[key]
                        ? <Bell className="w-4 h-4 text-[#2C5F9B]" />
                        : <BellOff className="w-4 h-4 text-gray-400" />
                      }
                      {label}
                    </Label>
                    <Switch
                      id={`notif-${key}`}
                      checked={localNotifs[key]}
                      onCheckedChange={() => toggleNotif(key)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">
              إلغاء
            </Button>
            <Button onClick={handleSave} className="flex-1 rounded-xl bg-[#2C5F9B] hover:bg-[#1a4a7a]">
              حفظ التغييرات
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}