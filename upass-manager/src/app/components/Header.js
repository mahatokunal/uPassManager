import React from 'react';
import Image from 'next/image';
import logo from '../assets/images/virginia-tech-logo.png'; // Adjust the path to your logo

const Header = () => {
  return (
    <header className="bg-[#861F41] text-white py-4 shadow-lg">
      <div className="container mx-auto flex items-center px-4">
        <div className="flex items-center">
          <Image 
            src={logo} 
            alt="Virginia Tech Logo" 
            width={120} 
            height={120} 
            className="transition-transform hover:scale-105 duration-300"
          />
          <h1 
            className="ml-4 text-2xl font-bold tracking-wide" 
            style={{ fontFamily: 'AcherusGrotesque-Bold' }}
          >
            U-Pass Manager
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
