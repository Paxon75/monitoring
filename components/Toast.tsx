import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!message) return null;

  return (
    <div 
      className="fixed bottom-5 right-5 bg-green-500 text-white py-3 px-5 rounded-lg shadow-lg animate-fadeInOut"
      role="alert"
      aria-live="assertive"
    >
      {message}
    </div>
  );
};

// Add simple fadeInOut animation using CSS (could be in index.html or a global CSS file)
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(20px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(20px); }
  }
  .animate-fadeInOut {
    animation: fadeInOut 3s ease-in-out forwards;
  }
`;
document.head.appendChild(style);


export default Toast;
