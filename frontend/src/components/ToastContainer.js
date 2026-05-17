import React from 'react';
import { useApp } from '../context/AppContext';

const ToastContainer = () => {
  const { toasts } = useApp();

  return (
    <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{t.type === 'success' ? '✓' : '✕'}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
