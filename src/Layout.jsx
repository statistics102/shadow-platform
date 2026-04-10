import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Bell, Menu, X, Home, Users, Brain, Activity, Heart, BookOpen, Settings, LogOut, Shield } from 'lucide-react';

const navItems = [
  { name: 'الرئيسية', page: 'Home', icon: Home },
  { name: 'ملف الطفل', page: 'ChildProfile', icon: Users },
  { name: 'تطور الطفل', page: 'ChildProgressPage', icon: Activity },
];

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleLogout = () => {
    base44.auth.logout();
  };

  // Pages without layout
  if (currentPageName === 'ChildProfile') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#2C5F9B] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">ش</span>
              </div>
              <Link to={createPageUrl('Home')} className="text-xl font-bold text-[#2C5F9B]">
                منصة شادو
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <Link
                  key={item.page + item.name}
                  to={createPageUrl(item.page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPageName === item.page
                      ? 'bg-[#2C5F9B]/10 text-[#2C5F9B]'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link
                  to={createPageUrl('AdminDashboard')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    currentPageName === 'AdminDashboard'
                      ? 'bg-[#2C5F9B]/10 text-[#2C5F9B]'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  لوحة الإدارة
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 left-0 w-2.5 h-2.5 bg-red-500 rounded-full" />
            </button>

            <div className="hidden md:flex items-center gap-2">
              <div className="w-9 h-9 bg-[#2C5F9B]/10 rounded-full flex items-center justify-center">
                <span className="text-[#2C5F9B] text-sm font-bold">
                  {user?.full_name?.[0] || 'م'}
                </span>
              </div>
              <span className="text-sm text-gray-700 font-medium">{user?.full_name || 'مستخدم'}</span>
            </div>

            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t px-4 py-3 space-y-1">
            {navItems.map(item => (
              <Link
                key={item.page + item.name}
                to={createPageUrl(item.page)}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link
                to={createPageUrl('AdminDashboard')}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Shield className="w-5 h-5" />
                لوحة الإدارة
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              تسجيل الخروج
            </button>
          </div>
        )}
      </header>

      {children}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3">منصة شادو</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                منصة متكاملة تقدم الدعم لأصحاب الهمم وعائلاتهم من خلال خدمات رقمية مبتكرة.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3">الخدمات</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>الجلسات التخصصية</li>
                <li>الموارد التعليمية</li>
                <li>الأنشطة التفاعلية</li>
                <li>الدعم المجتمعي</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>عن المنصة</li>
                <li>الأسئلة الشائعة</li>
                <li>اتصل بنا</li>
                <li>الشروط والأحكام</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">تواصل معنا</h4>
              <p className="text-gray-400 text-sm">info@Shadow-platform.com</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
            © 2025 منصة شادو. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </div>
  );
}