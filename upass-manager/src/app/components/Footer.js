/**
 * @file Footer component that displays copyright information
 * @description A simple footer component that appears at the bottom of the application
 * @module app/components/Footer
 */

import React from 'react';

/**
 * Renders a consistent footer element with copyright information
 * 
 * @component
 * @returns {React.ReactElement} The Footer component
 * 
 * @example
 * // Basic usage in a page layout
 * <div className="app-container">
 *   <Header />
 *   <main>{content}</main>
 *   <Footer />
 * </div>
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
