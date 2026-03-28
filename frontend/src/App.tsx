/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { ScanConfig } from './pages/ScanConfig';
import { ProductDetail } from './pages/ProductDetail';
import { ScanHistory } from './pages/ScanHistory';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { Page } from './types';
import { Bolt } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onLogin={() => setCurrentPage('dashboard')} onGoToSignup={() => setCurrentPage('signup')} />;
      case 'signup':
        return <Signup onSignup={() => setCurrentPage('dashboard')} onGoToLogin={() => setCurrentPage('login')} />;
      case 'dashboard':
        return <Dashboard onProductClick={() => setCurrentPage('product-detail')} />;
      case 'products':
        return <Products onProductClick={() => setCurrentPage('product-detail')} />;
      case 'scan':
        return <ScanConfig />;
      case 'product-detail':
        return <ProductDetail />;
      case 'history':
        return <ScanHistory onRunScan={() => setCurrentPage('scan')} />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile onSignOut={() => setCurrentPage('login')} />;
      default:
        return (
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-on-surface mb-2">Page Under Construction</h2>
              <p className="text-on-surface-variant">The {currentPage} module is currently being optimized.</p>
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className="mt-4 text-primary font-semibold hover:underline"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        );
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Dashboard Overview';
      case 'products': return 'Product Catalog';
      case 'scan': return 'Configure Scan';
      case 'product-detail': return 'Price Analysis';
      case 'history': return 'Scan History';
      case 'settings': return 'Settings';
      case 'profile': return 'My Profile';
      default: return 'AutoOps';
    }
  };

  // FAB is suppressed on Settings, Profile, Details, and Transactional screens.
  // We'll show it on Dashboard and Products.
  const showFAB = ['dashboard', 'products'].includes(currentPage);
  const isAuthPage = ['login', 'signup'].includes(currentPage);

  return (
    <div className="min-h-screen bg-surface selection:bg-primary-container selection:text-on-primary-container">
      {!isAuthPage && <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />}
      
      <main className={cn(
        "min-h-screen relative transition-all duration-300",
        !isAuthPage ? "ml-64" : "ml-0"
      )}>
        {!isAuthPage && (
          <TopBar 
            title={getPageTitle()} 
            onRunScan={() => setCurrentPage('scan')} 
            onProfileClick={() => setCurrentPage('profile')}
          />
        )}
        
        <div className={cn(!isAuthPage ? "pt-16" : "pt-0")}>
          {renderPage()}
        </div>

        {showFAB && (
          <button 
            onClick={() => setCurrentPage('scan')}
            className="fixed bottom-8 right-8 w-14 h-14 primary-gradient text-on-primary-container rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all z-50 group"
          >
            <Bolt className="w-6 h-6 fill-current group-hover:rotate-12 transition-transform" />
          </button>
        )}
      </main>

      {/* Floating Background Decoration */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]"></div>
      </div>
    </div>
  );
}
