/**
 * @file Loading Context Provider
 * @description Provides global loading state management for the application
 * @module context/LoadingContext
 */

"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Loading Context interface
 * @typedef {Object} LoadingContextType
 * @property {boolean} isLoading - Whether the application is in a loading state
 * @property {string} loadingText - Text to display during loading
 * @property {function} setLoading - Function to set the loading state with custom text
 * @property {function} clearLoading - Function to clear the loading state
 */

/**
 * Context for managing global loading state
 * @type {React.Context<LoadingContextType>}
 */
const LoadingContext = createContext({
  isLoading: false,
  loadingText: '',
  setLoading: () => {},
  clearLoading: () => {},
});

/**
 * Provider component for the loading context
 * Renders a loading overlay when isLoading is true
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} Provider with loading overlay
 */
export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const pathname = usePathname();

  /**
   * Effect to clear loading state on navigation
   */
  useEffect(() => {
    setIsLoading(false);
    setLoadingText('');
  }, [pathname]);

  /**
   * Set the application in a loading state with custom text
   * @param {string} [text] - Optional text to display during loading
   */
  const setLoading = (text) => {
    setIsLoading(true);
    setLoadingText(text || 'Loading...');
  };

  /**
   * Clear the loading state
   */
  const clearLoading = () => {
    setIsLoading(false);
    setLoadingText('');
  };

  return (
    <LoadingContext.Provider value={{ isLoading, loadingText, setLoading, clearLoading }}>
      {children}
      
      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#861F41] mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">{loadingText}</p>
            <p className="text-sm text-gray-500 mt-2">Please wait...</p>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

/**
 * Custom hook to use the loading context
 * @returns {LoadingContextType} The loading context value
 * 
 * @example
 * const { isLoading, setLoading, clearLoading } = useLoading();
 * // Use setLoading to start loading with a message
 * setLoading('Saving data...');
 * // Use clearLoading to stop loading
 * clearLoading();
 */
export function useLoading() {
  return useContext(LoadingContext);
}
