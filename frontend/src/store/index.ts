import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  subscription: 'free' | 'pro' | 'premium';
  subscription_expiry?: string;
}

interface BrandProfile {
  business_name: string;
  description: string;
  industry: string;
  tone: string;
  target_audience: string;
  brand_colors: string[];
}

interface Content {
  id: string;
  platform: string;
  content_type: string;
  body: string;
  image_url?: string;
  scheduled_date?: string;
  status: 'draft' | 'scheduled' | 'published';
  created_at: string;
}

interface AppState {
  user: User | null;
  brand: BrandProfile | null;
  contents: Content[];
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setBrand: (brand: BrandProfile | null) => void;
  setContents: (contents: Content[]) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  brand: null,
  contents: [],
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setBrand: (brand) => set({ brand }),
  setContents: (contents) => set({ contents }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  logout: () => set({ user: null, brand: null, contents: [], isAuthenticated: false }),
}));
