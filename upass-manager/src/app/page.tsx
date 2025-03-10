"use client";

import { useRouter } from 'next/navigation';
import Header from '../app/components/Header';
import Footer from '../app/components/Footer';
import Login from '../app/views/Login';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <Login />
      </main>
      <Footer />
    </div>
  );
}