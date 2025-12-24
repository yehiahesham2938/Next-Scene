import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Toaster from '../components/Toaster';

const MainLayout = () => {
  const location = useLocation();
  const hideFooter = location.pathname === '/signin' || location.pathname === '/signup';

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1 sm:ml-20">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
      <Toaster />
    </div>
  );
};

export default MainLayout;
