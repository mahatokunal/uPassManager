import React from 'react';

/**
 * Footer component for the UPass Manager application
 * 
 * This component displays a consistent footer across all pages of the application,
 * showing copyright information and Virginia Tech branding.
 * 
 * @component
 * @returns {JSX.Element} The rendered Footer component
 * 
 * @example
 * <Footer />
 */
const Footer = () => {
  return (
    <footer className="bg-[#861F41] text-white py-4 shadow-md">
      <div className="container mx-auto text-center">
        <p style={{ fontFamily: 'AcherusGrotesque-Regular' }}>&copy; {new Date().getFullYear()} Virginia Tech. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
