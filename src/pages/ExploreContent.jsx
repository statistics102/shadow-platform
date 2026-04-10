import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, Tag, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const articleContent = {
  1: 'يعاني الأطفال ذوو التوحد من صعوبات في التواصل والتفاعل الاجتماعي. يمكنك دعم طفلك من خلال إنشاء روتين يومي ثابت، واستخدام الدعائم البصرية كالصور والجداول، وتخصيص وقت للعب الهادئ. تذكر أن الصبر والتفهم هما أساس النجاح في هذه الرحلة.',
  2: 'نوبات الغضب شائعة عند الأطفال وخاصة ذوي الاحتياجات الخاصة. حاول تحديد المحفزات وتجنبها مسبقاً، وعند حدوث النوبة ابقَ هادئاً وأبعد الطفل عن مثيرات الضوضاء والازدحام. استخدم أسلوب التعزيز الإيجابي للسلوك الجيد.',
  3: 'التغذية السليمة تلعب دوراً محورياً في صحة الأطفال ذوي الاحتياجات الخاصة. ركز على الخضروات والفواكه والبروتينات الطبيعية. بعض الأطفال قد يعانون من حساسية غذائية فاستشر طبيبك لوضع نظام غذائي مناسب.',
  4: 'الأسرة هي الركيزة الأساسية في رحلة تأهيل الطفل. شارك جميع أفراد العائلة في فهم احتياجات الطفل وكيفية التعامل معه. التواصل المستمر مع المتخصصين وتطبيق توصياتهم في البيت يُسرّع من تقدم الطفل بشكل ملحوظ.',
  5: 'قد يُظهر الأطفال علامات الاكتئاب بطرق مختلفة عن البالغين كالعصبية والانسحاب الاجتماعي. إذا لاحظت تغيرات مستمرة في سلوك طفلك، لا تتردد في استشارة متخصص نفسي. الدعم المبكر يُحدث فرقاً كبيراً.',
  6: 'التعلم المنظم يساعد الأطفال ذوي صعوبات التعلم على الاستيعاب بشكل أفضل. قسّم المهام إلى خطوات صغيرة، واستخدم الألوان والصور لتنظيم المعلومات. خصص أوقاتاً ثابتة للمذاكرة في بيئة خالية من المشتتات.',
  7: 'الاستعداد للمدرسة يبدأ قبل أسابيع من اليوم الأول. قم بزيارة المدرسة مسبقاً مع طفلك، وتحدث معه عن روتين اليوم الدراسي، وابدأ بتعديل ساعات النوم تدريجياً لتتناسب مع التوقيت المدرسي.',
  8: 'متلازمة داون حالة جينية تؤثر على التطور الجسدي والذهني. الأطفال ذوو متلازمة داون قادرون على التعلم وتحقيق إنجازات رائعة مع الدعم المناسب. برامج التدخل المبكر والعلاج الطبيعي والنطق تُحدث فرقاً كبيراً في حياتهم.',
};

function ArticleModal({ article, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6 relative max-h-[85vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        <div className={`w-14 h-14 ${article.color} rounded-2xl flex items-center justify-center text-2xl mb-4`}>
          {article.emoji}
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2 leading-snug">{article.title}</h2>
        <div className="flex items-center gap-3 mb-4 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{article.category}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
        </div>
        <p className="text-gray-600 leading-relaxed text-sm">{articleContent[article.id]}</p>
      </motion.div>
    </div>
  );
}

const categories = ['الكل', 'نفسي', 'تربوي', 'طبي', 'سلوكي', 'عائلي'];

const articles = [
  { id: 1, title: 'كيف تدعم طفلك ذو التوحد في المنزل؟', category: 'تربوي', readTime: '٥ دقائق', emoji: '🏠', color: 'bg-blue-50', badge: 'جديد' },
  { id: 2, title: 'فهم نوبات الغضب وكيفية التعامل معها', category: 'سلوكي', readTime: '٧ دقائق', emoji: '🧠', color: 'bg-orange-50', badge: null },
  { id: 3, title: 'التغذية السليمة لأطفال الاحتياجات الخاصة', category: 'طبي', readTime: '٦ دقائق', emoji: '🥗', color: 'bg-green-50', badge: 'شائع' },
  { id: 4, title: 'دور الأسرة في رحلة التأهيل والعلاج', category: 'عائلي', readTime: '٨ دقائق', emoji: '❤️', color: 'bg-pink-50', badge: null },
  { id: 5, title: 'علامات الاكتئاب لدى الأطفال وكيف نتعامل معها', category: 'نفسي', readTime: '٩ دقائق', emoji: '😔', color: 'bg-purple-50', badge: 'جديد' },
  { id: 6, title: 'تقنيات التعلم المنظم للأطفال ذوي صعوبات التعلم', category: 'تربوي', readTime: '١٠ دقائق', emoji: '📖', color: 'bg-teal-50', badge: null },
  { id: 7, title: 'الاستعداد للمدرسة: نصائح للعام الدراسي الجديد', category: 'تربوي', readTime: '٥ دقائق', emoji: '🎒', color: 'bg-yellow-50', badge: null },
  { id: 8, title: 'متلازمة داون: حقائق ونصائح للأهل', category: 'طبي', readTime: '١٢ دقيقة', emoji: '🌟', color: 'bg-indigo-50', badge: 'شائع' },
];

const badgeColor = { 'جديد': 'bg-yellow-400 text-gray-800', 'شائع': 'bg-red-500 text-white' };

export default function ExploreContent() {
  const [active, setActive] = useState('الكل');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const filtered = active === 'الكل' ? articles : articles.filter(a => a.category === active);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="flex items-center gap-2 text-[#2C5F9B] mb-6 hover:opacity-75 transition-opacity">
          <ArrowRight className="w-5 h-5" />
          <span className="font-medium">العودة</span>
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">استكشف المحتوى</h1>
          <p className="text-gray-500">٢٤ مقال جديد في مجالات الدعم النفسي والتربوي</p>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                active === c ? 'bg-[#2C5F9B] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#2C5F9B]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setSelectedArticle(article)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                <div className={`w-14 h-14 ${article.color} rounded-2xl flex items-center justify-center text-2xl shrink-0`}>
                  {article.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-gray-800 text-sm leading-snug">{article.title}</h3>
                    {article.badge && (
                      <span className={`${badgeColor[article.badge]} text-xs px-2 py-0.5 rounded-full font-medium shrink-0`}>
                        {article.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{article.category}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <span className="text-[#2C5F9B] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  <BookOpen className="w-4 h-4" />
                  قراءة المقال
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    {selectedArticle && <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
    </div>
  );
}