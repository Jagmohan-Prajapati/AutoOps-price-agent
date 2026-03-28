import React from 'react';
import { Plus, Search } from 'lucide-react';
import { Page } from '../types';

interface TopBarProps {
  title: string;
  onRunScan: () => void;
  onProfileClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ title, onRunScan, onProfileClick }) => {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-surface/80 backdrop-blur-xl flex items-center justify-between px-8 shadow-2xl shadow-black/50 border-b border-outline-variant/5">
      <div className="flex items-center gap-4">
        <h1 className="text-on-surface font-black text-lg tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center bg-surface-container px-4 py-1.5 rounded-full border border-outline-variant/10">
          <Search className="w-4 h-4 text-primary mr-2" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="bg-transparent border-none text-sm focus:ring-0 text-on-surface-variant w-48 outline-none"
          />
        </div>
        
        <button 
          onClick={onRunScan}
          className="primary-gradient text-on-primary-container px-5 py-2 rounded-xl text-sm font-bold tracking-tight hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer active:scale-95 transform"
        >
          <Plus className="w-4 h-4" />
          Run New Scan
        </button>

        <div className="h-8 w-px bg-outline-variant/20"></div>

        <div 
          onClick={onProfileClick}
          className="flex items-center gap-3 cursor-pointer hover:bg-surface-bright/50 p-1 rounded-xl transition-colors"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-on-surface">Alex Rivera</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Pro Account</p>
          </div>
          <img 
            className="w-9 h-9 rounded-full border border-primary/20 object-cover" 
            src="https://picsum.photos/seed/alex/100/100" 
            alt="User avatar"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
};
