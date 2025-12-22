import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Toaster from '../components/Toaster';

const MainLayout = () => {
  const location = useLocation();
  const hideFooter = location.pathname === '/signin' || location.pathname === '/signup';

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Header />
      <main className="flex-1 sm:ml-20">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
      <Toaster />
    </div>
  );
};

export default MainLayout;
