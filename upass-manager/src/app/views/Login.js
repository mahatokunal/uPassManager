import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import loginImage from '../assets/images/login-page.png';
import Image from 'next/image';
import '../assets/colors/fonts.css'; // Import the CSS file

const Login = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login logic here
    // For now, we'll just navigate to the Dashboard
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold mb-6 text-center" style={{ fontFamily: 'AcherusGrotesque-Bold', fontSize: '40px', color: 'black' }}>Login to U-Pass Manager</h1>
      <main className="flex flex-col md:flex-row items-center justify-center w-full">
        <div className="flex w-full md:w-1/2 items-center justify-center p-8">
          <div className="w-full max-w-md">
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700" style={{ fontFamily: 'AcherusGrotesque-Regular', fontSize: '15px' }}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                  style={{ fontFamily: 'AcherusGrotesque-Regular' }}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700" style={{ fontFamily: 'AcherusGrotesque-Regular', fontSize: '15px' }}>
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                  style={{ fontFamily: 'AcherusGrotesque-Regular' }}
                />
                <div className="mt-2">
                  <input
                    type="checkbox"
                    id="show-password"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <label htmlFor="show-password" className="ml-2 text-sm text-gray-700" style={{ fontFamily: 'AcherusGrotesque-Regular', fontSize: '15px' }}>
                    Show Password
                  </label>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full text-white bg-[#861F41] hover:bg-[#6e1a34] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#861F41]"
                  style={{ fontFamily: 'AcherusGrotesque-Bold', width: '150px', height: '40px', fontSize: '20px', borderRadius: '15px' }}
                >
                  Login
                </button>
              </div>
              <div className="flex items-center justify-between">
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500" style={{ fontFamily: 'AcherusGrotesque-Regular', fontSize: '15px' }}>
                  Forgot Password?
                </a>
              </div>
            </form>
          </div>
        </div>
        {!isMobile && (
          <div className="w-full md:w-1/2 flex items-center justify-center p-8">
            <Image src={loginImage} alt="Login Image" width={700} height={543} className="object-cover" />
          </div>
        )}
      </main>
    </div>
  );
};

export default Login;