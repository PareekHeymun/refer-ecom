import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    setNotification({ message, type });
    if (duration > 0) {
      setTimeout(() => setNotification(null), duration);
    }
  }, []);

  const value = { notification, showNotification };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notification && (
        <div className={`notification-banner notification-${notification.type}`}>{notification.message}</div>
      )}
      <style>{`
        .notification-banner {
          position: fixed;
          top: 32px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          min-width: 240px;
          max-width: 90vw;
          padding: 1em 2em;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          box-shadow: 0 4px 24px rgba(0,0,0,0.13);
          text-align: center;
          animation: fadeInDown 0.3s;
        }
        .notification-success {
          background: #e6f9ed;
          color: #1a7f37;
          border: 1.5px solid #1a7f37;
        }
        .notification-error {
          background: #fdeaea;
          color: #b32b2b;
          border: 1.5px solid #b32b2b;
        }
        .notification-info {
          background: #eaf4fd;
          color: #22577a;
          border: 1.5px solid #22577a;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px) translateX(-50%); }
          to { opacity: 1; transform: translateY(0) translateX(-50%); }
        }
      `}</style>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
} 