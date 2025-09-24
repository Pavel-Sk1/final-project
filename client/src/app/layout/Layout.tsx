import { Outlet } from 'react-router';
import { Navigation, Footer } from '@/widgets';
import { Toaster } from 'react-hot-toast';

export function Layout() {
  return (
    <div className='app'>
      <Navigation />
      <main className='main'>
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px' } }} />
    </div>
  );
}
