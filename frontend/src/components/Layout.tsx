import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Particles from './Particles';

export default function Layout() {
  return (
    <div className="min-h-screen relative">
      <Particles />
      <Navbar />
      <main className="relative z-10 pt-16">
        <Outlet />
      </main>
      <footer className="relative z-10 border-t border-white/5 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-white/30 text-sm font-body">
            Made with <span className="text-primary">♥</span> for us
          </p>
        </div>
      </footer>
    </div>
  );
}
