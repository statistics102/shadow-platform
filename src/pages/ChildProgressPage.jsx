import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Award, Calendar, FileText, ChevronDown, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AddProgressModal from '../components/progress/AddProgressModal';
import moment from 'moment';

const SKILL_LABELS = {
  communication: 'التواصل',
  social: 'الاجتماعية',
  motor: 'الحركية',
  academic: 'الأكاديمية',
  life: 'الحياتية',
  emotional: 'العاطفية',
};

const SKILL_COLORS = {
  communication: '#2C5F9B',
  social: '#4CAF50',
  motor: '#FF9800',
  academic: '#9C27B0',
  life: '#0d9488',
  emotional: '#E91E63',
};

const RADAR_COLORS = ['#2C5F9B', '#4CAF50', '#FF9800'];

export default function ChildProgressPage() {
  const [selectedChild, setSelectedChild] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: profiles = [] } = useQuery({
    queryKey: ['childProfiles'],
    queryFn: () => base44.entities.ChildProfile.list('-created_date'),
  });

  const { data: progressRecords = [], refetch } = useQuery({
    queryKey: ['childProgress', selectedChild],
    queryFn: () => selectedChild
      ? base44.entities.ChildProgress.filter({ child_profile_id: selectedChild }, 'session_date')
      : base44.entities.ChildProgress.list('session_date'),
    enabled: true,
  });

  const activeChild = profiles.find(p => p.id === selectedChild) || profiles[0];

  const filteredRecords = selectedChild
    ? progressRecords.filter(r => r.child_profile_id === selectedChild)
    : progressRecords.filter(r => r.child_profile_id === activeChild?.id);

  // Line chart data — one point per session
  const lineData = filteredRecords.map(r => ({
    date: moment(r.session_date).format('DD/MM'),
    fullDate: r.session_date,
    overall: r.overall_score || 0,
    ...Object.fromEntries(
      Object.entries(r.skill_scores || {}).map(([k, v]) => [k, v])
    ),
  }));

  // Radar — latest session
  const latestRecord = filteredRecords[filteredRecords.length - 1];
  const radarData = Object.entries(SKILL_LABELS).map(([key, label]) => ({
    skill: label,
    value: latestRecord?.skill_scores?.[key] || 0,
    fullMark: 100,
  }));

  // Bar chart — average per skill across all sessions
  const barData = Object.entries(SKILL_LABELS).map(([key, label]) => {
    const values = filteredRecords.map(r => r.skill_scores?.[key] || 0).filter(v => v > 0);
    const avg = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
    return { skill: label, avg, color: SKILL_COLORS[key] };
  });

  // KPI cards
  const latestOverall = latestRecord?.overall_score || 0;
  const prevRecord = filteredRecords[filteredRecords.length - 2];
  const prevOverall = prevRecord?.overall_score || 0;
  const improvement = latestOverall - prevOverall;
  const topSkill = barData.sort((a, b) => b.avg - a.avg)[0];

  const childSkills = activeChild?.skill_development || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-bold text-gray-800">📈 تتبع تطور الطفل</h1>
          <p className="text-gray-500 text-sm mt-1">رصد التقدم في المهارات عبر جلسات العلاج والتدريب</p>
        </motion.div>
        <div className="flex gap-3 items-center">
          {profiles.length > 1 && (
            <Select value={selectedChild} onValueChange={setSelectedChild}>
              <SelectTrigger className="h-10 rounded-xl border-gray-200 w-44 text-sm">
                <SelectValue placeholder="اختر الطفل" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.child_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button
            onClick={() => setShowAddModal(true)}
            className="h-10 rounded-xl bg-[#2C5F9B] hover:bg-[#1a4a7a] gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            إضافة تقرير جلسة
          </Button>
        </div>
      </div>

      {/* Child info banner */}
      {activeChild && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-primary text-white rounded-2xl p-5 mb-8 flex flex-wrap items-center gap-4"
        >
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
            {activeChild.child_name?.[0]}
          </div>
          <div>
            <h2 className="font-bold text-lg">{activeChild.child_name}</h2>
            <p className="text-sm opacity-80">{activeChild.age} سنة · {filteredRecords.length} جلسة مسجلة</p>
          </div>
          <div className="flex flex-wrap gap-2 mr-auto">
            {childSkills.slice(0, 4).map(s => (
              <span key={s} className="bg-white/20 px-3 py-1 rounded-full text-xs">
                {SKILL_LABELS[s] || s}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {filteredRecords.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <FileText className="w-16 h-16 mx-auto text-gray-200 mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">لا توجد بيانات بعد</h3>
          <p className="text-gray-400 text-sm mb-6">أضف أول تقرير جلسة لبدء رصد التطور</p>
          <Button onClick={() => setShowAddModal(true)} className="bg-[#2C5F9B] rounded-xl gap-2">
            <Plus className="w-4 h-4" />
            إضافة تقرير جلسة
          </Button>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'التقييم الأخير', value: `${latestOverall}%`, icon: TrendingUp, color: 'bg-blue-50 text-blue-600' },
              { label: 'التحسن عن الجلسة السابقة', value: improvement > 0 ? `+${improvement}` : improvement === 0 ? 'ثابت' : `${improvement}`, icon: TrendingUp, color: improvement >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500' },
              { label: 'أقوى مهارة', value: topSkill?.skill || '—', icon: Award, color: 'bg-yellow-50 text-yellow-600' },
              { label: 'عدد الجلسات', value: filteredRecords.length, icon: Calendar, color: 'bg-purple-50 text-purple-600' },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
              >
                <div className={`w-9 h-9 ${card.color} rounded-xl flex items-center justify-center mb-3`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <p className="text-xs text-gray-500 mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Line chart — overall progress */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-700 mb-4">📉 التقدم العام عبر الجلسات</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Line type="monotone" dataKey="overall" stroke="#2C5F9B" strokeWidth={3} dot={{ r: 5 }} name="التقييم العام" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Radar chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-700 mb-4">🕸️ خريطة المهارات (آخر جلسة)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
                  <Radar name="المهارات" dataKey="value" stroke="#2C5F9B" fill="#2C5F9B" fillOpacity={0.25} />
                  <Tooltip formatter={(v) => `${v}%`} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar chart + Line per skill */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Bar — avg per skill */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-700 mb-4">📊 متوسط المهارات</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="skill" tick={{ fontSize: 11 }} width={65} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Bar dataKey="avg" radius={[0, 8, 8, 0]} name="المتوسط">
                    {barData.map((entry, i) => (
                      <rect key={i} fill={Object.values(SKILL_COLORS)[i % 6]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Multi-line chart per skill */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-700 mb-4">📈 تطور المهارات عبر الجلسات</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Legend formatter={(v) => SKILL_LABELS[v] || v} />
                  {(activeChild?.skill_development?.length ? activeChild.skill_development : Object.keys(SKILL_LABELS)).slice(0, 4).map(skill => (
                    <Line key={skill} type="monotone" dataKey={skill} stroke={SKILL_COLORS[skill]} strokeWidth={2} dot={{ r: 3 }} name={skill} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sessions log */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b">
              <h3 className="font-bold text-gray-800">📋 سجل الجلسات</h3>
            </div>
            <div className="divide-y">
              {[...filteredRecords].reverse().map((record, i) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-wrap justify-between items-start gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-[#2C5F9B]" />
                        <span className="font-semibold text-sm text-gray-800">
                          {moment(record.session_date).format('DD MMMM YYYY')}
                        </span>
                        {record.specialist_name && (
                          <span className="text-xs text-gray-400">· {record.specialist_name}</span>
                        )}
                      </div>
                      {record.notes && <p className="text-xs text-gray-500 mt-1">{record.notes}</p>}
                      {record.goals_achieved?.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {record.goals_achieved.map(g => (
                            <Badge key={g} className="bg-green-50 text-green-700 border-0 text-xs">✓ {g}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#2C5F9B]">{record.overall_score || 0}</div>
                        <div className="text-xs text-gray-400">/ 100</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {Object.entries(record.skill_scores || {}).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: SKILL_COLORS[key] }} />
                        <span className="text-xs text-gray-600">{SKILL_LABELS[key]}</span>
                        <span className="text-xs font-bold text-gray-800">{val}%</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}

      {showAddModal && (
        <AddProgressModal
          profiles={profiles}
          defaultChildId={activeChild?.id}
          onClose={() => setShowAddModal(false)}
          onSaved={() => { refetch(); setShowAddModal(false); }}
        />
      )}
    </div>
  );
}