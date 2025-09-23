import { Outlet } from 'react-router';
import { Navigation, Footer } from '@/widgets';

export function Layout() {
  return (
    <div className='app'>
      <Navigation />
      <main className='main'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
