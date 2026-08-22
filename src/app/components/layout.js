'use client';

import { useEffect, useState } from 'react';
import EditorialSidebar from './editorial/EditorialSidebar';
import NavBar from './NavBar';

const Layout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen w-full relative flex">
      {!isMobile && <EditorialSidebar />}
      <div className="flex-1 w-full min-h-screen">
        {children}
      </div>
      {isMobile && <NavBar />}
    </div>
  );
};

export default Layout;

