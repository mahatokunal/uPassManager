import React from 'react';
import Header from '../app/components/Header';
import Footer from '../app/components/Footer';

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;