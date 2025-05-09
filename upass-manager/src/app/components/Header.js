import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '../assets/images/virginia-tech-logo.png'; // Adjust the path to your logo

/**
 * Header component for the UPass Manager application
 * 
 * This component displays the application header with the Virginia Tech logo,
 * application title, and a logout button when a user is logged in.
 * The component manages login state and handles the logout functionality.
 * 
 * @component
 * @returns {JSX.Element} The rendered Header component
 * 
 * @example
 * // Basic usage in a page or layout component
 * <Header />
 * 
 * @example
 * // Usage with a layout
 * <div className="flex flex-col min-h-screen">
 *   <Header />
 *   <main className="flex-grow">{children}</main>
 *   <Footer />
 * </div>
 */
const Header = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const userRole = localStorage.getItem('userRole');
    setIsLoggedIn(!!userRole);
  }, []);
  
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
