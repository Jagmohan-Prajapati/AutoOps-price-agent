import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  History, 
  Settings, 
  Waves,
  Circle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 border-r border-outline-variant/15 bg-surface flex flex-col py-6 px-4 z-50">
      <div className="mb-10 px-2 flex items-center gap-2 cursor-pointer" onClick={() => onPageChange('dashboard')}>
        <Waves className="text-primary w-8 h-8" />
        <span className="text-xl font-bold tracking-tighter text-primary">AutoOps</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || (item.id === 'products' && currentPage === 'product-detail');
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id as Page)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ease-in-out transform active:scale-95",
                isActive 
                  ? "bg-surface-container text-primary border-l-4 border-primary-container" 
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium tracking-tight text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">System Status</p>
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <Circle className="w-2 h-2 fill-secondary text-secondary animate-pulse" />
          </div>
          <span className="text-xs font-semibold text-secondary">All Agents Online</span>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-surface-container-high/30 rounded-xl border border-outline-variant/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-xs">
            JD
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-semibold text-on-surface truncate">John Doe</span>
            <span className="text-[10px] text-on-surface-variant">Admin Access</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
