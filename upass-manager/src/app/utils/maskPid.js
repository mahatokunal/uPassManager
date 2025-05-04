/**
 * Masks a Student PID for privacy by showing only the last 4 digits
 * 
 * @param {string} pid - The student PID (9-digit number)
 * @returns {string} The masked PID with the first 5 digits replaced by asterisks
 * @throws {Error} If the PID is not a valid 9-digit number
 * @example
 * // Returns "*****1234"
 * maskPid("123451234");
 */
export function maskPid(pid) {
  if (!pid || typeof pid !== 'string' || !/^\d{9}$/.test(pid)) {
    // For invalid inputs, just return as is or throw an error based on your error handling strategy
    return pid;
  }
  
  // Replace first 5 digits with asterisks, keep last 4 digits
  return pid.replace(/^\d{5}/, '*****');
}
