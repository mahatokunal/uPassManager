import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '../assets/images/virginia-tech-logo.png'; // Adjust the path to your logo

/**
 * @typedef {Object} HeaderProps
 * No props required for this component
 */

/**
 * Header component for the UPass Manager application
 * 
 * This component displays the application header with the Virginia Tech logo,
 * UPass Manager title, and a logout button if the user is logged in.
 * 
 * @returns {JSX.Element} Header component
 * @example
 * // Usage in a page component
 * <Header />
 */
const Header = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  /**
   * Check if user is logged in on component mount
   */
  useEffect(() => {
    // Check if user is logged in
    const userRole = localStorage.getItem('userRole');
    setIsLoggedIn(!!userRole);
  }, []);
  
  /**
   * Handle user logout
   * Clears user data from localStorage and redirects to login page
   */
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userRole');
    
    // Redirect to login page
    router.push('/');
  };
  return (
    <header className="bg-[#861F41] text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-4">
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
        
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="bg-white text-[#861F41] px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
