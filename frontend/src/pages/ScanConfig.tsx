import type React from 'react';
import { useState } from 'react';
import { 
  Search, 
  Rocket, 
  ShoppingBag, 
  Store, 
  Shirt, 
  CheckCircle2,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const ScanConfig: React.FC = () => {
  const [threshold, setThreshold] = useState(15);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="pt-8 px-8 pb-12 w-full max-w-6xl mx-auto"
    >
      <div className="py-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Configure Intelligence Scan</h1>
        <p className="text-on-surface-variant text-lg">Define the scope and parameters for your real-time market analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Steps */}
        <div className="lg:col-span-8 space-y-8">
          {/* Step 1: Select Products */}
          <section className="bg-surface-container-low p-8 rounded-xl ring-1 ring-outline-variant/15">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                <h2 className="text-xl font-bold text-on-surface">Select Products</h2>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Filter catalog..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/10 overflow-hidden">
              <div className="flex items-center px-6 py-3 bg-surface-container-high/50 border-b border-outline-variant/10">
                <input type="checkbox" id="select-all" className="rounded border-outline-variant bg-surface-container-low text-primary focus:ring-primary h-4 w-4" defaultChecked />
                <label htmlFor="select-all" className="ml-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Select All Products (124)</label>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-outline-variant/10 no-scrollbar">
                {[
                  { name: 'Precision X1 Smartwatch', sku: 'PRE-X1-BLK', status: 'Active Inventory', img: 'watch' },
                  { name: 'Acoustic Pro Headphones', sku: 'AC-PRO-204', status: 'Active Inventory', img: 'headphones' },
                  { name: 'Lumina DSLR Case', sku: 'LUM-CS-09', status: 'Stock Low', img: 'camera' },
                ].map((p, i) => (
                  <div key={i} className="flex items-center px-6 py-4 hover:bg-surface-bright/20 transition-colors">
                    <input type="checkbox" className="rounded border-outline-variant bg-surface-container-low text-primary focus:ring-primary h-4 w-4" defaultChecked={i < 2} />
                    <div className="ml-4 flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded bg-surface-container overflow-hidden">
                        <img 
                          src={`https://picsum.photos/seed/${p.img}/100/100`} 
                          alt={p.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{p.name}</p>
                        <p className="text-xs text-on-surface-variant">SKU: {p.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded",
                        p.status === 'Stock Low' ? "text-on-surface-variant bg-surface-variant" : "text-primary bg-primary/10"
                      )}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Step 2: Select Platforms */}
          <section className="bg-surface-container-low p-8 rounded-xl ring-1 ring-outline-variant/15">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
              <h2 className="text-xl font-bold text-on-surface">Select Platforms</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Amazon.in', icon: ShoppingBag, color: '#FF9900', active: true },
                { name: 'Flipkart', icon: Store, color: '#2874F0', active: true, selected: true },
                { name: 'Myntra', icon: Shirt, color: '#FF3F6C', active: false },
              ].map((p, i) => (
                <div 
                  key={i}
                  className={cn(
                    "group relative p-6 bg-surface-container-lowest rounded-xl border transition-all cursor-pointer",
                    p.selected ? "border-primary bg-surface-container" : "border-outline-variant/20 hover:border-primary/50"
                  )}
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className={cn("w-12 h-12 flex items-center justify-center rounded-lg mb-2")} style={{ backgroundColor: `${p.color}10` }}>
                      <p.icon className="w-6 h-6" style={{ color: p.color }} />
                    </div>
                    <h3 className="font-bold text-on-surface">{p.name}</h3>
                    <div className="flex items-center justify-between w-full mt-2">
                      <span className={cn("text-xs font-semibold", p.active ? "text-primary" : "text-on-surface-variant")}>
                        {p.active ? 'Active' : 'Disabled'}
                      </span>
                      <div className={cn(
                        "w-10 h-5 rounded-full relative p-1 cursor-pointer transition-colors",
                        p.active ? "bg-primary" : "bg-surface-variant"
                      )}>
                        <div className={cn(
                          "w-3 h-3 rounded-full transition-all",
                          p.active ? "bg-on-primary ml-auto" : "bg-outline mr-auto"
                        )} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Settings & CTA */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <section className="bg-surface-container-low p-8 rounded-xl ring-1 ring-outline-variant/15">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
              <h2 className="text-xl font-bold text-on-surface">Scan Settings</h2>
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-on-surface">Price alert threshold</label>
                  <span className="text-primary font-bold bg-primary/10 px-2 py-1 rounded text-xs">{threshold}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-surface-container-lowest rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">
                  <span>0% (Conservative)</span>
                  <span>30% (Aggressive)</span>
                </div>
              </div>

              <div className="flex items-center justify-between group cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-on-surface">Enable repricing recommendations</p>
                  <p className="text-[11px] text-on-surface-variant">AI will suggest price adjustments based on scan data.</p>
                </div>
                <div className="w-10 h-5 bg-secondary-container rounded-full relative p-1">
                  <div className="w-3 h-3 bg-on-secondary-container rounded-full ml-auto"></div>
                </div>
              </div>

              <div className="flex items-center justify-between group cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-on-surface">Notify me when scan completes</p>
                  <p className="text-[11px] text-on-surface-variant">Push notifications and email alerts.</p>
                </div>
                <div className="w-10 h-5 bg-secondary-container rounded-full relative p-1">
                  <div className="w-3 h-3 bg-on-secondary-container rounded-full ml-auto"></div>
                </div>
              </div>
            </div>
          </section>

          <div className="p-6 bg-surface-bright/30 rounded-xl border border-primary/20 backdrop-blur-md">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Scan Preview</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Products:</span>
                <span className="text-on-surface font-semibold">86 Selected</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Platforms:</span>
                <span className="text-on-surface font-semibold">2 Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Est. Duration:</span>
                <span className="text-on-surface font-semibold">~4 minutes</span>
              </div>
            </div>
          </div>

          <button className="w-full py-5 rounded-xl bg-linear-to-r from-primary to-primary-container text-on-primary-container font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-3">
            <Rocket className="w-6 h-6 fill-current" />
            Start Intelligence Scan
          </button>
          
          <p className="text-center text-xs text-on-surface-variant px-4">
            By starting the scan, you agree to usage of 1.2 intelligence credits per product.
          </p>
        </div>
      </div>

      {/* Live Activity Mockup */}
      <div className="mt-20 opacity-40 select-none pointer-events-none">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-on-surface">Live Agent Activity</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
            <span className="text-xs font-semibold text-secondary">Real-time Stream Connected</span>
          </div>
        </div>
        <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/10 font-mono text-xs space-y-4">
          <div className="flex gap-4 items-start border-l-2 border-primary pl-4">
            <span className="text-on-surface-variant">[14:22:01]</span>
            <span className="text-primary font-bold">SCAN_INITIATED</span>
            <span className="text-on-surface">Job ID #882-QX. Crawlers dispatched to Amazon.in and Flipkart.</span>
          </div>
          <div className="flex gap-4 items-start border-l-2 border-secondary pl-4">
            <span className="text-on-surface-variant">[14:22:12]</span>
            <span className="text-tertiary font-bold">ANOMALY_DETECTED</span>
            <span className="text-on-surface">Price drop of -18% detected for SKU PRE-X1-BLK on Flipkart. Flagging...</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
