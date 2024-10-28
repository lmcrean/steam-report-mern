import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="py-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
      </div>
    </header>
  );
};

export default Header;