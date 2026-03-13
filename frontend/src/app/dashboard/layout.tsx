'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Sparkles, 
  LayoutDashboard, 
  PenTool, 
  Calendar, 
  Image, 
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { API_BASE_URL } from '@/lib/api';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/generate', label: 'Generate', icon: PenTool },
  { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
  { href: '/dashboard/images', label: 'Images', icon: Image },
  { href: '/dashboard/payment', label: 'Payment', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser, logout } = useAppStore();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // Fetch user data from API
        const url = `${API_BASE_URL}/api/auth/me`;
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          // Token invalid, redirect to login
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }

        const userData = await response.json();
        setUser({
          id: userData.id.toString(),
          email: userData.email,
          name: userData.name,
          subscription: userData.subscription || 'free'
        });
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, setUser]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-primary/10 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-primary/10">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-clash font-bold">SocialFlow</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-primary/20 text-primary' 
                      : 'text-text-secondary hover:bg-primary/10 hover:text-text-primary'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{user?.name || 'User'}</div>
                <div className="text-xs text-text-secondary capitalize">{user?.subscription || 'Free'} Plan</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-text-secondary hover:bg-error/10 hover:text-error transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-primary/10 lg:hidden">
          <div className="flex items-center justify-between px-4 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-text-secondary hover:text-text-primary"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-clash font-bold">SocialFlow</span>
            </div>
            <div className="w-10" />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
