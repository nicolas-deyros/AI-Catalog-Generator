
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-gray-200 p-4 shadow-sm">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          AI Catalog Creator
        </h1>
        <p className="text-gray-500 mt-1">
          Transform your product images into stunning, downloadable PDF catalogs.
        </p>
      </div>
    </header>
  );
};

export default Header;
