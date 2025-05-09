/**
 * Masks a Personal Identifier (PID) for privacy and security purposes, showing
 * only specific portions while hiding others.
 * 
 * @function maskPid
 * @param {string|number} pid - The Personal Identifier to mask
 * @returns {string} A masked version of the PID with some digits replaced by asterisks
 * 
 * @example
 * // For PIDs 5 characters or longer - masks all except last 4 digits
 * maskPid("123456789"); // Returns "12345****"
 * 
 * @example
 * // For PIDs less than 5 characters - shows first character, masks the rest
 * maskPid("1234"); // Returns "1***"
 * 
 * @example
 * // Handles numeric input by converting to string
 * maskPid(123456); // Returns "12****"
 * 
 * @example
 * // Returns empty string for null/undefined input
 * maskPid(); // Returns ""
 */
export const maskPid = (pid) => {
  if (!pid) return '';
  
  // Convert to string in case it's a number
  const pidStr = String(pid);
  
  // If PID is less than 5 characters, mask all but the first character
  if (pidStr.length < 5) {
    return pidStr.charAt(0) + '*'.repeat(pidStr.length - 1);
  }
  
  // Otherwise, mask the last 4 digits
  return pidStr.slice(0, -4) + '****';
};
