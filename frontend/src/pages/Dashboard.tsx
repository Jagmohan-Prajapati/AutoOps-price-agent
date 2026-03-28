import { useEffect, useState, useRef } from 'react';
import { getProducts, getAlerts, triggerScan, createScanStream } from '../lib/api';

import { 
  Package, 
  Network, 
  BellRing, 
  Clock, 
  Filter, 
  Download,
  ChevronRight,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Product, ActivityLog, Alert } from '../types';
import { cn } from '../lib/utils';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Blue Cotton Kurta',
    sku: 'PROD-7821-IND',
    category: 'Ethnic Wear',
    yourPrice: 899,
    marketAvg: 849,
    platforms: { amazon: 849, flipkart: 899, myntra: 920 },
    gap: 5.8,
    recommendation: 'Lower Price',
    status: 'In Stock',
    lastScanned: '14 mins ago',
    image: 'https://picsum.photos/seed/kurta/400/400'
  },
  {
    id: '2',
    name: "Women's Ethnic Dress",
    sku: 'PROD-7822-IND',
    category: 'Ethnic Wear',
    yourPrice: 1499,
    marketAvg: 1599,
    platforms: { amazon: 1599, flipkart: 1649, myntra: 1550 },
    gap: -6.2,
    recommendation: "You're Cheapest",
    status: 'In Stock',
    lastScanned: '22 mins ago',
    image: 'https://picsum.photos/seed/dress/400/400'
  },
  {
    id: '3',
    name: "Men's Polo T-Shirt",
    sku: 'PROD-7823-IND',
    category: 'Apparel',
    yourPrice: 599,
    marketAvg: 599,
    platforms: { amazon: 599, flipkart: 620, myntra: 599 },
    gap: 0,
    recommendation: 'Match Price',
    status: 'In Stock',
    lastScanned: '1 hour ago',
    image: 'https://picsum.photos/seed/polo/400/400'
  },
  {
    id: '4',
    name: 'Embroidered Silk Saree',
    sku: 'PROD-7824-IND',
    category: 'Ethnic Wear',
    yourPrice: 4200,
    marketAvg: 3800,
    platforms: { amazon: 3800, flipkart: 4100, myntra: 3950 },
    gap: 10.5,
    recommendation: 'Lower Price',
    status: 'Stock Low',
    lastScanned: '2 hours ago',
    image: 'https://picsum.photos/seed/saree/400/400'
  },
  {
    id: '5',
    name: 'Denim Jacket (Raw Blue)',
    sku: 'PROD-7825-IND',
    category: 'Apparel',
    yourPrice: 2899,
    marketAvg: 2899,
    platforms: { amazon: 2899, flipkart: 2999, myntra: 3100 },
    gap: 0,
    recommendation: 'Match Price',
    status: 'In Stock',
    lastScanned: '3 hours ago',
    image: 'https://picsum.photos/seed/jacket/400/400'
  }
];

const MOCK_LOGS: ActivityLog[] = [
  { id: '1', timestamp: '09:42:01', message: "Agent scanning Amazon.in for 'Blue Cotton Kurta'...", type: 'info' },
  { id: '2', timestamp: '09:42:14', message: "Found: ₹849 on Amazon.in (Price Drop Detected)", type: 'success' },
  { id: '3', timestamp: '09:42:25', message: "Agent navigating Flipkart product page...", type: 'info' },
  { id: '4', timestamp: '09:42:31', message: "Extracted: ₹899 on Flipkart. Match confirmed.", type: 'info' },
  { id: '5', timestamp: '09:42:45', message: "Agent scanning Myntra... Bypass challenge successful.", type: 'info' },
  { id: '6', timestamp: '09:42:58', message: "Extracted: ₹920 on Myntra.", type: 'info' },
  { id: '7', timestamp: '09:43:05', message: "Next task queued: \"Women's Ethnic Dress\" search...", type: 'info' },
];

const MOCK_ALERTS: Alert[] = [
  { id: '1', productName: 'Blue Cotton Kurta', time: '12m ago', type: 'price_drop', message: 'Amazon price dropped by ₹50', platform: 'Amazon', value: '₹50' },
  { id: '2', productName: 'Silk Saree (Festival Ed.)', time: '1h ago', type: 'stock_low', message: 'Stock level critical (2 left) on Myntra' },
  { id: '3', productName: 'Leather Laptop Bag', time: '3h ago', type: 'competitor', message: 'New competitor "StyleHub" launched same SKU' },
];

export const Dashboard = ({ onProductClick }: { onProductClick: (id: string) => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-[1600px] mx-auto space-y-8"
    >
      {/* Hero Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-low p-6 rounded-xl border-l-2 border-primary-container group hover:bg-surface-container transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Products Tracked</span>
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-on-surface tracking-tighter">1,284</span>
            <span className="text-xs font-medium text-secondary">+12%</span>
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-xl border-l-2 border-secondary group hover:bg-surface-container transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Platforms Monitored</span>
            <Network className="w-5 h-5 text-secondary" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['AMAZON', 'FLIPKART', 'MYNTRA'].map(p => (
              <span key={p} className="bg-surface-container-highest px-2 py-0.5 rounded text-[10px] font-bold text-on-surface border border-outline-variant/20">
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-xl border-l-2 border-tertiary-container group hover:bg-surface-container transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Price Alerts Today</span>
            <BellRing className="w-5 h-5 text-tertiary-container" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-tertiary-container tracking-tighter">42</span>
            <span className="text-xs font-medium text-on-surface-variant">critical</span>
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-xl border-l-2 border-outline-variant group hover:bg-surface-container transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Last Scan</span>
            <Clock className="w-5 h-5 text-on-surface-variant" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-on-surface tracking-tight">2 hours ago</span>
            <span className="text-[10px] font-medium text-on-surface-variant uppercase">Success</span>
          </div>
        </div>
      </div>

      {/* Dashboard Content Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Product Price Table */}
        <section className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10">
            <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight text-on-surface">Product Price Inventory</h2>
              <div className="flex gap-2">
                <button className="p-2 bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
                <button className="p-2 bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/50 text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-4 py-4 text-center">Your Price</th>
                    <th className="px-4 py-4 text-center">AMZ</th>
                    <th className="px-4 py-4 text-center">FK</th>
                    <th className="px-4 py-4 text-center">MYN</th>
                    <th className="px-4 py-4 text-center">GAP (%)</th>
                    <th className="px-6 py-4">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {MOCK_PRODUCTS.map((product) => (
                    <tr 
                      key={product.id} 
                      onClick={() => onProductClick(product.id)}
                      className="hover:bg-surface-bright/20 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-5 font-semibold text-sm text-on-surface">{product.name}</td>
                      <td className="px-4 py-5 text-center font-bold text-sm">₹{product.yourPrice.toLocaleString()}</td>
                      <td className="px-4 py-5 text-center text-on-surface-variant text-sm">₹{product.platforms.amazon.toLocaleString()}</td>
                      <td className="px-4 py-5 text-center text-on-surface-variant text-sm">₹{product.platforms.flipkart.toLocaleString()}</td>
                      <td className="px-4 py-5 text-center text-on-surface-variant text-sm">₹{product.platforms.myntra.toLocaleString()}</td>
                      <td className={cn(
                        "px-4 py-5 text-center font-bold text-sm",
                        product.gap > 0 ? "text-tertiary-container" : product.gap < 0 ? "text-secondary" : "text-primary-container"
                      )}>
                        {product.gap > 0 ? '+' : ''}{product.gap}%
                      </td>
                      <td className="px-6 py-5">
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight border",
                          product.recommendation === 'Lower Price' ? "bg-error-container/20 text-tertiary-container border-tertiary-container/30" :
                          product.recommendation === "You're Cheapest" ? "bg-secondary-container/20 text-secondary border-secondary-container/30" :
                          "bg-primary-container/20 text-primary-fixed border-primary-container/30"
                        )}>
                          {product.recommendation}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-surface-container/30 flex justify-center">
              <button className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-container flex items-center gap-2 transition-colors">
                View all 1,284 products
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Activity & Alerts */}
        <section className="col-span-12 lg:col-span-4 space-y-8">
          {/* Live Agent Activity Terminal */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Live Agent Activity</h2>
              <div className="flex items-center gap-2 px-2 py-0.5 bg-secondary/10 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span className="text-[9px] font-bold text-secondary uppercase">Streaming</span>
              </div>
            </div>
            <div className="bg-[#0d1117] rounded-xl border border-outline-variant/20 h-[320px] overflow-y-auto font-mono text-xs p-5 no-scrollbar flex flex-col gap-3 shadow-inner">
              {MOCK_LOGS.map((log) => (
                <div key={log.id} className="flex gap-3">
                  <span className="text-secondary opacity-50">[{log.timestamp}]</span>
                  <span className={cn(
                    "text-on-surface-variant",
                    log.type === 'success' && "text-secondary font-bold"
                  )}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Recent Alerts</h2>
            <div className="space-y-3">
              {MOCK_ALERTS.map((alert) => (
                <div key={alert.id} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-bold text-on-surface truncate pr-4">{alert.productName}</h3>
                    <span className="text-[9px] font-medium text-on-surface-variant">{alert.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.type === 'price_drop' ? (
                      <TrendingDown className="w-4 h-4 text-tertiary-container" />
                    ) : alert.type === 'stock_low' ? (
                      <Package className="w-4 h-4 text-secondary" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-tertiary-container" />
                    )}
                    <p className="text-xs text-on-surface-variant">
                      {alert.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};
