import React, { useEffect, useRef } from 'react';
import Icon from './Icon';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'error' | 'warning' | 'info' | 'success';
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const typeStyles = {
    error: 'border-red-500 bg-red-50',
    warning: 'border-yellow-500 bg-yellow-50',
    info: 'border-blue-500 bg-blue-50',
    success: 'border-green-500 bg-green-50',
  };

  const iconColors = {
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    success: 'text-green-600',
  };

  const iconNames = {
    error: 'x-circle' as const,
    warning: 'alert-triangle' as const,
    info: 'info-circle' as const,
    success: 'check-circle' as const,
  };

  return (
    <dialog
      ref={dialogRef}
      className="bg-transparent border-none outline-none p-0 m-0 max-w-none w-full h-full backdrop:bg-black backdrop:bg-opacity-20"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-message"
      aria-modal="true"
    >
      {/* Centered content container */}
      <div className="flex items-center justify-center min-h-full p-4">
        <div
          className={`relative p-6 rounded-lg border-2 bg-white shadow-xl max-w-md w-full ${typeStyles[type]}`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200 border border-gray-300 shadow-sm z-20 min-w-[10px] min-h-[10px] flex items-center justify-center"
            aria-label="Close dialog"
            title="Close"
          >
            <Icon icon="close" className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="flex items-start space-x-3 pr-8">
            <div className={`flex-shrink-0 ${iconColors[type]}`}>
              <Icon icon={iconNames[type]} className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3
                id="dialog-title"
                className="text-lg font-semibold text-gray-900 mb-2"
              >
                {title}
              </h3>
              <p
                id="dialog-message"
                className="text-gray-700 text-sm leading-relaxed"
              >
                {message}
              </p>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Dialog;
