import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  { num: 1, label: 'إعداد الحساب' },
  { num: 2, label: 'ملف الطفل' },
  { num: 3, label: 'التفضيلات' },
  { num: 4, label: 'اكتمال' },
];

export default function ProfileStepIndicator({ currentStep = 2 }) {
  return (
    <div className="flex gap-2 bg-gray-50 p-4 rounded-xl mb-8">
      {steps.map(step => {
        const isCompleted = step.num < currentStep;
        const isActive = step.num === currentStep;

        return (
          <div
            key={step.num}
            className={`flex-1 text-center py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
              isCompleted
                ? 'bg-green-500 text-white'
                : isActive
                ? 'bg-white text-[#2C5F9B] shadow-sm'
                : 'text-gray-400'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              {isCompleted && <Check className="w-4 h-4" />}
              {step.num}. {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}