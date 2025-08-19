import React from 'react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="w-6 h-6 border-4 border-t-transparent border-current rounded-full animate-spin"></div>
      {message && <p className="text-lg font-semibold">{message}</p>}
    </div>
  );
};

export default Loader;