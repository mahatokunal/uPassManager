import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex">
        <div className="flex w-1/2 items-center justify-center p-8 bg-white rounded shadow-md">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-center">Login</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                  Forgot Password?
                </a>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="w-1/2">
          <img src="/path/to/your/image.jpg" alt="Login Image" className="object-cover w-full h-full" />
        </div>
      </main>
    </div>
  );
};

export default Login;