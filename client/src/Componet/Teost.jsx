// src/Components/Toast.jsx
import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  const colors = {
    success: '#0F6E56',
    error: '#DC2626',
    warning: '#F59E0B',
    info: '#3B82F6'
  };

  const bgColors = {
    success: '#0F6E5615',
    error: '#DC262615',
    warning: '#F59E0B15',
    info: '#3B82F615'
  };

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
      <div 
        className="flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-sm min-w-[280px] max-w-[420px]"
        style={{
          background: bgColors[type],
          borderColor: colors[type] + '30',
          boxShadow: `0 10px 40px ${colors[type]}25`
        }}
      >
        <span className="text-2xl flex-shrink-0">{icons[type]}</span>
        <span className="text-sm font-medium flex-1" style={{ color: colors[type] }}>
          {message}
        </span>
        <button 
          onClick={onClose}
          className="ml-2 text-muted hover:text-primary transition-colors flex-shrink-0"
          style={{ color: colors[type] }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}