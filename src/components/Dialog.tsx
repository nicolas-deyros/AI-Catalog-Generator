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
    error: 'x-circle',
    warning: 'alert-triangle',
    info: 'info-circle',
    success: 'check-circle',
  };

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black backdrop:bg-opacity-50 bg-transparent border-none p-0 max-w-md w-full"
    >
      <div
        className={`relative p-6 rounded-lg border-2 bg-white shadow-xl ${typeStyles[type]}`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Close dialog"
        >
          <Icon icon="close" className="w-5 h-5 text-gray-500" />
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
    </dialog>
  );
};

export default Dialog;
