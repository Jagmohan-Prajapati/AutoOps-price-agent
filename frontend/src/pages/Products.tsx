import React from 'react';
import { 
  Search, 
  Upload, 
  Plus, 
  RefreshCw, 
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { cn } from '../lib/utils';

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Aura Pro Wireless',
    sku: 'SKU-8821',
    category: 'Audio',
    yourPrice: 299.00,
    marketAvg: 285.00,
    platforms: { amazon: 285, flipkart: 299, myntra: 310 },
    gap: 4.9,
    recommendation: 'Lower Price',
    status: 'In Stock',
    lastScanned: '4 hours ago',
    image: 'https://picsum.photos/seed/headphones/600/400'
  },
  {
    id: '2',
    name: 'Titan Gen 2 Smartwatch',
    sku: 'SKU-9940',
    category: 'Wearables',
    yourPrice: 449.50,
    marketAvg: 455.00,
    platforms: { amazon: 455, flipkart: 460, myntra: 449 },
    gap: -1.2,
    recommendation: "You're Cheapest",
    status: 'Stock Low',
    lastScanned: '12 hours ago',
    image: 'https://picsum.photos/seed/watch/600/400'
  },
  {
    id: '3',
    name: 'Nexus Mechanical Deck',
    sku: 'SKU-4412',
    category: 'Peripherals',
    yourPrice: 129.99,
    marketAvg: 129.99,
    platforms: { amazon: 129.99, flipkart: 135, myntra: 129.99 },
    gap: 0,
    recommendation: 'Match Price',
    status: 'In Stock',
    lastScanned: '2 hours ago',
    image: 'https://picsum.photos/seed/keyboard/600/400'
  },
  {
    id: '4',
    name: 'BrewMaster Smart-V',
    sku: 'SKU-7701',
    category: 'Appliances',
    yourPrice: 189.00,
    marketAvg: 175.00,
    platforms: { amazon: 175, flipkart: 189, myntra: 195 },
    gap: 8,
    recommendation: 'Lower Price',
    status: 'In Stock',
    lastScanned: '8 hours ago',
    image: 'https://picsum.photos/seed/coffee/600/400'
  },
  {
    id: '5',
    name: 'Z-Series Core Ultra',
    sku: 'SKU-2231',
    category: 'Computing',
    yourPrice: 1249.00,
    marketAvg: 1249.00,
    platforms: { amazon: 1249, flipkart: 1299, myntra: 1350 },
    gap: 0,
    recommendation: 'Match Price',
    status: 'In Stock',
    lastScanned: '1 hour ago',
    image: 'https://picsum.photos/seed/laptop/600/400'
  },
  {
    id: '6',
    name: 'Lume Smart Mesh Kit',
    sku: 'SKU-1025',
    category: 'Smart Home',
    yourPrice: 79.99,
    marketAvg: 75.00,
    platforms: { amazon: 75, flipkart: 79.99, myntra: 85 },
    gap: 6.6,
    recommendation: 'Lower Price',
    status: 'In Stock',
    lastScanned: '24 hours ago',
    image: 'https://picsum.photos/seed/light/600/400'
  }
];

export const Products: React.FC<{ onProductClick: (id: string) => void }> = ({ onProductClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-[1600px] mx-auto"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Product Catalog</h1>
          <p className="text-on-surface-variant text-sm max-w-lg">Manage your inventory benchmarks and real-time market positioning across all integrated retail channels.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-outline-variant/30 text-on-surface hover:bg-surface-bright transition-colors text-sm font-medium">
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg primary-gradient text-on-primary-container transition-all hover:opacity-90 text-sm font-semibold shadow-lg shadow-primary/10">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <section className="mb-8 p-1 rounded-xl bg-surface-container-low">
        <div className="flex flex-col lg:flex-row items-center gap-4 p-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search products, SKUs, or keywords..."
              className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-on-surface-variant/50"
            />
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <select className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-2 text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none cursor-pointer min-w-[160px]">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Home Appliances</option>
              <option>Accessories</option>
            </select>
            <div className="flex bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-1">
              <button className="px-3 py-1 text-xs font-semibold rounded bg-surface-bright text-primary">All</button>
              <button className="px-3 py-1 text-xs font-semibold rounded text-on-surface-variant hover:text-on-surface">Has Alerts</button>
              <button className="px-3 py-1 text-xs font-semibold rounded text-on-surface-variant hover:text-on-surface">Competitive</button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((product) => (
          <div 
            key={product.id}
            onClick={() => onProductClick(product.id)}
            className="group bg-surface-container-low rounded-xl overflow-hidden hover:bg-surface-container transition-all duration-300 border border-transparent hover:border-outline-variant/20 cursor-pointer"
          >
            <div className="relative h-48 bg-surface-container-lowest flex items-center justify-center overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
              
              <div className={cn(
                "absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border backdrop-blur-md",
                product.status === 'Stock Low' 
                  ? "bg-tertiary-container/20 text-tertiary border-tertiary/30" 
                  : "bg-secondary-container/20 text-secondary border-secondary/30"
              )}>
                {product.status === 'Stock Low' ? 'Has Alerts' : 'Competitive'}
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-on-surface leading-tight">{product.name}</h3>
                <span className="text-[10px] text-on-surface-variant font-mono">{product.sku}</span>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-surface-bright text-on-surface-variant text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                  {product.category}
                </span>
              </div>

              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-[10px] uppercase text-on-surface-variant font-bold tracking-tighter mb-1">Current Price</p>
                  <span className="text-3xl font-black text-on-surface tracking-tighter">${product.yourPrice.toFixed(2)}</span>
                </div>
                <div className="w-24 h-10 flex items-end gap-1 px-1">
                  {product.gap > 0 ? (
                    <TrendingUp className="w-full h-full text-tertiary" />
                  ) : (
                    <TrendingDown className="w-full h-full text-secondary" />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-on-surface-variant mb-6 pb-6 border-b border-outline-variant/10">
                <Clock className="w-3.5 h-3.5" />
                Last scanned: {product.lastScanned}
              </div>

              <div className="flex items-center gap-3">
                <button className="flex-1 py-2 rounded-lg bg-surface-bright text-on-surface text-sm font-semibold hover:bg-outline-variant/30 transition-colors">
                  View History
                </button>
                <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-container/20 text-primary hover:bg-primary-container hover:text-on-primary-container transition-all">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-12 flex justify-center">
        <button className="flex items-center gap-2 px-8 py-3 rounded-xl bg-surface-container text-on-surface hover:bg-surface-bright border border-outline-variant/20 transition-all font-medium">
          Load More Products
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
