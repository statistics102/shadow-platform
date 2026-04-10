import { useState, useEffect } from 'react';

const DEFAULT_SECTIONS = [
  { id: 'services', label: 'بطاقات الخدمات', visible: true },
  { id: 'sessions', label: 'الجلسات القادمة', visible: true },
];

const DEFAULT_NOTIFICATIONS = {
  speech_therapy: false,
  occupational_therapy: false,
  behavioral_therapy: false,
  physical_therapy: false,
  psychological: false,
  educational: false,
};

const STORAGE_KEY = 'shadow_dashboard_settings';

export function useDashboardSettings() {
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.sections) setSections(parsed.sections);
        if (parsed.notifications) setNotifications(parsed.notifications);
      }
    } catch (e) {}
  }, []);

  const save = (newSections, newNotifications) => {
    const settings = { sections: newSections, notifications: newNotifications };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSections(newSections);
    setNotifications(newNotifications);
  };

  const isSectionVisible = (id) => sections.find(s => s.id === id)?.visible ?? true;

  return { sections, notifications, save, isSectionVisible };
}