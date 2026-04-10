import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Clock, X, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const activitySteps = {
  1: ['قف على قدم واحدة لمدة ١٠ ثوانٍ', 'امشِ على خط مستقيم بخطوات بطيئة', 'ارمِ كرة واصطدها بكلتا اليدين', 'كرر كل تمرين ٥ مرات'],
  2: ['انظر إلى البطاقات الملونة', 'قل اسم كل لون بصوت عالٍ', 'رتب الأشكال حسب لونها', 'العب لعبة المطابقة مع أحد أفراد العائلة'],
  3: ['اجلس في مكان هادئ ومريح', 'خذ نفساً عميقاً وعدّ لـ ٤', 'احبس النفس لـ ٤ ثوانٍ', 'أخرج الهواء ببطء لـ ٦ ثوانٍ', 'كرر ٥ مرات'],
  4: ['ضع البطاقات مقلوبة على الطاولة', 'اقلب بطاقتين وحاول تذكر مكانهما', 'ابحث عن الأزواج المتطابقة', 'حاول إنهاء اللعبة في أقل عدد من المحاولات'],
  5: ['افردي أصابعك وضمّيها ببطء ١٠ مرات', 'التقطي حبوباً صغيرة بالإبهام والسبابة', 'مرري خيطاً في ثقوب الخرز', 'ارسمي دوائر وأشكال بالقلم'],
  6: ['استمع إلى القصة بتركيز', 'أجب عن سؤال: ما اسم الشخصية الرئيسية؟', 'أجب عن سؤال: ماذا حدث في البداية؟', 'ارسم مشهدك المفضل في القصة'],
  7: ['انظر في عيني شخص قريب منك لـ ٣ ثوانٍ', 'قل مرحباً وابتسم', 'اسأل سؤالاً بسيطاً واستمع للإجابة', 'شارك في نشاط جماعي صغير'],
  8: ['اختر ألوانك المفضلة', 'ارسم أو الوّن ما تشعر به الآن', 'أعطِ لوحتك عنواناً', 'أخبر شخصاً تحبه عن لوحتك'],
};

function ActivityModal({ activity, onClose }) {
  const [step, setStep] = useState(0);
  const steps = activitySteps[activity.id] || [];
  const done = step >= steps.length;

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
        <div className={`w-14 h-14 ${activity.color} rounded-2xl flex items-center justify-center text-2xl mb-3`}>
          {activity.emoji}
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">{activity.title}</h2>
        <div className="flex items-center gap-2 mb-4 text-xs text-gray-400">
          <Clock className="w-3 h-3" />{activity.duration}
        </div>
        {done ? (
          <div className="text-center py-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <p className="font-bold text-gray-800 mb-1">أحسنت! أتممت النشاط 🎉</p>
            <p className="text-sm text-gray-500 mb-4">استمر في ممارسة هذه التمارين يومياً.</p>
            <Button onClick={onClose} className="bg-[#2C5F9B] hover:bg-[#1a4a7a] rounded-xl px-8">إنهاء</Button>
          </div>
        ) : (
          <>
            <div className="mb-2 text-xs text-gray-400">الخطوة {step + 1} من {steps.length}</div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
              <div className="bg-[#2C5F9B] h-2 rounded-full transition-all" style={{ width: `${((step) / steps.length) * 100}%` }} />
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 mb-6 min-h-[60px] flex items-center">
              <p className="text-gray-800 font-medium text-sm">{steps[step]}</p>
            </div>
            <Button onClick={() => setStep(s => s + 1)} className="w-full bg-[#2C5F9B] hover:bg-[#1a4a7a] rounded-xl h-11 gap-2">
              <Play className="w-4 h-4" />
              {step === steps.length - 1 ? 'إنهاء النشاط' : 'الخطوة التالية'}
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
}

const levels = ['الكل', 'سهل', 'متوسط', 'متقدم'];

const activities = [
  { id: 1, title: 'تمارين التوازن والتنسيق', level: 'سهل', duration: '١٥ دقيقة', emoji: '🧘', color: 'bg-green-100', desc: 'تمارين بسيطة لتحسين التوازن الجسدي ومهارات التنسيق.' },
  { id: 2, title: 'لعبة تعرف على الألوان والأشكال', level: 'سهل', duration: '١٠ دقائق', emoji: '🎨', color: 'bg-yellow-100', desc: 'نشاط تفاعلي ممتع لتعليم الألوان والأشكال الأساسية.' },
  { id: 3, title: 'تمارين النفس العميق والاسترخاء', level: 'سهل', duration: '٨ دقائق', emoji: '🌬️', color: 'bg-blue-100', desc: 'تقنيات التنفس لتهدئة الأعصاب وتحسين التركيز.' },
  { id: 4, title: 'نشاط الذاكرة والمطابقة', level: 'متوسط', duration: '٢٠ دقيقة', emoji: '🧩', color: 'bg-purple-100', desc: 'ألعاب المطابقة لتطوير الذاكرة البصرية والتركيز.' },
  { id: 5, title: 'تمارين المهارات الحركية الدقيقة', level: 'متوسط', duration: '١٨ دقيقة', emoji: '✋', color: 'bg-orange-100', desc: 'أنشطة تقوية عضلات اليد والأصابع للكتابة والمسك.' },
  { id: 6, title: 'قصة تفاعلية مع الاستيعاب', level: 'متوسط', duration: '٢٥ دقيقة', emoji: '📖', color: 'bg-teal-100', desc: 'استمع إلى القصة وأجب عن الأسئلة لتطوير فهم اللغة.' },
  { id: 7, title: 'تمارين التواصل البصري والاجتماعي', level: 'متقدم', duration: '٣٠ دقيقة', emoji: '👀', color: 'bg-indigo-100', desc: 'تدريب مهارات التواصل البصري وبناء العلاقات الاجتماعية.' },
  { id: 8, title: 'برنامج التعبير الفني الحر', level: 'متقدم', duration: '٤٠ دقيقة', emoji: '🖌️', color: 'bg-pink-100', desc: 'التعبير عن المشاعر والأفكار من خلال الفن والإبداع.' },
];

const levelColors = { 'سهل': 'bg-green-100 text-green-700', 'متوسط': 'bg-yellow-100 text-yellow-700', 'متقدم': 'bg-red-100 text-red-700' };

export default function Activities() {
  const [active, setActive] = useState('الكل');
  const [selectedActivity, setSelectedActivity] = useState(null);

  const filtered = active === 'الكل' ? activities : activities.filter(a => a.level === active);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="flex items-center gap-2 text-[#2C5F9B] mb-6 hover:opacity-75 transition-opacity">
          <ArrowRight className="w-5 h-5" />
          <span className="font-medium">العودة</span>
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">الأنشطة التفاعلية</h1>
          <p className="text-gray-500">٣٢ نشاط مصمم لتنمية المهارات الحركية والمعرفية</p>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {levels.map(l => (
            <button
              key={l}
              onClick={() => setActive(l)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                active === l ? 'bg-[#2C5F9B] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#2C5F9B]'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex gap-4 mb-4">
                <div className={`w-14 h-14 ${activity.color} rounded-2xl flex items-center justify-center text-2xl shrink-0`}>
                  {activity.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-sm">{activity.title}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColors[activity.level]}`}>
                      {activity.level}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {activity.duration}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{activity.desc}</p>
              <Button onClick={() => setSelectedActivity(activity)} className="w-full bg-[#2C5F9B] hover:bg-[#1a4a7a] rounded-xl gap-2" size="sm">
                <Play className="w-4 h-4" />
                ابدأ النشاط
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    {selectedActivity && <ActivityModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />}
    </div>
  );
}