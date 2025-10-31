"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  const NavLink = ({ href, children }) => (
    <Link href={href} className={`block px-3 py-2 rounded-md ${path === href ? 'bg-yellow-300 text-gray-900' : 'text-white hover:text-yellow-300'}`}>
      {children}
    </Link>
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // also clear admin token for compatibility with rentalAdmin
    localStorage.removeItem('admin_token');
    // reload to update UI
    window.location.href = '/';
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-gradient-to-r from-purple-700 to-blue-600 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/images/modern-car-rental-logo-template-auto-service-and-ride-share-branding-vector.jpg" alt="logo" className="w-9 h-9 rounded-full bg-white p-1" />
              <span className="font-semibold text-base md:text-lg">Rental</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-5">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/all-vehicle">Rent a Vehicle</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            {!user ? (
              <>
                <Link href="/rentalRegister" className="px-3 py-1.5 bg-white text-purple-700 rounded-md font-semibold text-sm">Sign Up</Link>
                <Link href="/rentalLogin" className="px-3 py-1.5 border border-white rounded-md text-sm">Sign In</Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {user.role === 'admin' && (
                  <Link href="/admin/dashboard" className="px-3 py-1.5 bg-white/20 text-white rounded-md text-sm">Admin</Link>
                )}
                <span className="text-sm">Hello, {user.name.split(' ')[0]}</span>
                <button onClick={handleLogout} className="px-3 py-1.5 bg-white text-purple-700 rounded-md font-semibold text-sm">Logout</button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="p-2 rounded-md text-white hover:bg-white/10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {open && (
          <div className="md:hidden px-4 pb-4">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/all-vehicle">Rent a Vehicle</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <div className="mt-3 flex flex-col gap-2">
              {!user ? (
                <>
                  <Link href="/rentalRegister" className="px-4 py-2 bg-white text-purple-700 rounded-md font-semibold">Sign Up</Link>
                  <Link href="/rentalLogin" className="px-4 py-2 border border-white rounded-md text-white">Sign In</Link>
                </>
              ) : (
                <>
                  {user.role === 'admin' && (
                    <Link href="/admin/dashboard" className="px-4 py-2 bg-white/20 text-white rounded-md">Admin Dashboard</Link>
                  )}
                  <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded">
                    <span className="text-sm">{user.name}</span>
                    <button onClick={handleLogout} className="text-sm text-purple-700 bg-white px-3 py-1 rounded">Logout</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
