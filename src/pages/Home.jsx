import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Search, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import StatsBar from '../components/home/StatsBar';
import ServiceCard from '../components/home/ServiceCard';
import UpcomingSessions from '../components/home/UpcomingSessions';

const services = [
{
  icon: '👩‍⚕️', iconBg: 'bg-blue-100', title: 'المتخصصون والجلسات',
  description: 'اطلب جلسة مع متخصصين معتمدين في مختلف المجالات العلاجية والتعليمية.',
  linkText: 'عرض المتخصصين', stat: '١٥ متخصص متصل', badge: 'featured', link: '/Specialists'
},
{
  icon: '🧠', iconBg: 'bg-green-100', title: 'الدعم النفسي والتربوي',
  description: 'موارد ونصائح للتعامل مع التحديات النفسية والسلوكية.',
  linkText: 'استكشف المحتوى', stat: '٢٤ مقال جديد', badge: 'new', link: '/ExploreContent'
},
{
  icon: '🏃‍♂️', iconBg: 'bg-orange-100', title: 'الأنشطة التفاعلية',
  description: 'تمارين وأنشطة مصممة خصيصاً لتنمية المهارات الحركية والمعرفية.',
  linkText: 'ابدأ النشاط', stat: '٣٢ نشاط متاح', link: '/Activities'
},
{
  icon: '🎨', iconBg: 'bg-purple-100', title: 'برامج تنمية المهارات',
  description: 'دروس تفاعلية وبرامج تعليمية مخصصة لتطوير القدرات المختلفة.',
  linkText: 'استعرض البرامج', stat: '١٢ برنامج نشط'
},
{
  icon: '❤️', iconBg: 'bg-pink-100', title: 'الدعم والتمويل',
  description: 'تبرع أو اطلب الدعم المالي أو العيني لتغطية تكاليف الرعاية والعلاج.',
  linkText: 'ساهم الآن', stat: '١٥ حملة نشطة', badge: 'popular'
},
{
  icon: '📚', iconBg: 'bg-teal-100', title: 'التوعية الصحية',
  description: 'معلومات عن الصحة العامة، التغذية، والأمراض الشائعة لدى أصحاب الهمم.',
  linkText: 'اقرأ المزيد', stat: '٤٨ مقال طبي'
},
{
  icon: '🧩', iconBg: 'bg-indigo-100', title: 'مركز المعرفة',
  description: 'تعرف على أنواع الإعاقات وطرق التعامل معها من خلال مصادر موثوقة.',
  linkText: 'ابدأ التعلم', stat: '٦٥ مصدر تعليمي'
},
{
  icon: '🗣️', iconBg: 'bg-cyan-100', title: 'مجتمع الدعم',
  description: 'تواصل مع عائلات أخرى وشارك تجاربك واستفد من خبرات الآخرين.',
  linkText: 'انضم للمجتمع', stat: '١٬٢٣٤ عضو'
},
{
  icon: '🛠️', iconBg: 'bg-gray-100', title: 'إعدادات الحساب',
  description: 'إدارة ملفك الشخصي، تفضيلاتك، وإعدادات الخصوصية والإشعارات.',
  linkText: 'التحكم بالإعدادات', stat: 'آخر تحديث: اليوم'
}];


export default function Home() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const filteredServices = searchQuery ?
  services.filter((s) => s.title.includes(searchQuery) || s.description.includes(searchQuery)) :
  services;

  return (
    <div>
      {/* Hero Banner */}
      <section className="text-[hsl(var(--sidebar-ring))] py-10 gradient-primary">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}>
              
              <h2 className="text-[hsl(var(--muted-foreground))] mb-2 text-3xl font-bold">
                مرحباً {user?.full_name ? `يا ${user.full_name}` : 'بك في منصة شادو'}
              </h2>
              <p className="text-[hsl(var(--sidebar-foreground))] text-lg opacity-90">منصة متكاملة لدعم أصحاب الهمم وعائلاتهم</p>
            </motion.div>
            <StatsBar />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="w-full md:w-1/3 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن خدمة، متخصص، أو مقال..."
              className="h-12 pr-11 rounded-xl border-gray-200" />
            
          </div>
          <div className="flex gap-3">
            <Link to="/NewServiceRequest">
            <Button className="bg-[#2C5F9B] hover:bg-[#1a4a7a] h-11 rounded-xl gap-2">
              <Plus className="w-4 h-4" />
              طلب خدمة جديدة
            </Button>
            </Link>
            <Link to="/ChildProfile">
              <Button variant="outline" className="h-11 rounded-xl gap-2 border-[#2C5F9B] text-[#2C5F9B] hover:bg-[#2C5F9B]/5">
                <Calendar className="w-4 h-4" />
                ملف الطفل
              </Button>
            </Link>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredServices.map((service, i) =>
          service.link ?
          <Link key={service.title} to={service.link}><ServiceCard {...service} delay={i * 0.05} /></Link> :
          <ServiceCard key={service.title} {...service} delay={i * 0.05} />
          )}
        </div>

        {/* Upcoming Sessions */}
        <UpcomingSessions />
      </main>
    </div>);

}