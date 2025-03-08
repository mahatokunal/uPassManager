import React from 'react';
import Image from 'next/image';
import logo from '../assets/virginia-tech-logo.png'; // Adjust the path to your logo

const Header = () => {
  return (
    <header className="bg-[#861F41] text-white py-4">
      <div className="container mx-auto flex items-center">
        <Image src={logo} alt="Virginia Tech Logo" width={120} height={120} />
        <h1 className="ml-4 text-xl font-bold" style={{ fontFamily: 'AcherusGrotesque-Bold' }}>U-Pass Manager</h1>
      </div>
    </header>
  );
};

export default Header;