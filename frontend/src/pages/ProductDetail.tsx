
import type React from 'react';
import { 
  TrendingDown, 
  CheckCircle2, 
  BellRing, 
  ChevronRight,
  Clock,
  Sparkles,
  ArrowRight,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { cn } from '../lib/utils';

const CHART_DATA = [
  { name: 'Oct 01', you: 1499, amazon: 1520, flipkart: 1495, myntra: 1649 },
  { name: 'Oct 07', you: 1499, amazon: 1510, flipkart: 1480, myntra: 1620 },
  { name: 'Oct 14', you: 1499, amazon: 1530, flipkart: 1510, myntra: 1600 },
  { name: 'Oct 21', you: 1499, amazon: 1500, flipkart: 1490, myntra: 1630 },
  { name: 'Oct 28', you: 1499, amazon: 1520, flipkart: 1470, myntra: 1610 },
  { name: 'Oct 30', you: 1499, amazon: 1515, flipkart: 1485, myntra: 1625 },
];

export const ProductDetail: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-8 max-w-[1600px] mx-auto pb-20"
    >
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-on-surface-variant mb-6">
        <span className="hover:text-primary transition-colors cursor-pointer">Dashboard</span>
        <ChevronRight className="w-3 h-3" />
        <span className="hover:text-primary transition-colors cursor-pointer">Products</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-on-surface">Blue Cotton Kurta</span>
      </nav>

      {/* Product Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 rounded bg-secondary-container/20 text-secondary text-[10px] font-bold uppercase tracking-wider border border-secondary/20">Ethnic Wear</span>
            <span className="text-on-surface-variant text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Last scan: 14 mins ago
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface mb-2">Blue Cotton Kurta</h1>
          <p className="text-on-surface-variant max-w-xl text-sm">SKU: PROD-7821-IND. High-demand seasonal apparel with dynamic pricing enabled across 4 major platforms.</p>
        </div>
        
        <div className="flex items-center gap-8 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">Your Current Price</p>
            <p className="text-3xl font-black text-primary">₹1,499</p>
          </div>
          <div className="h-10 w-[1px] bg-outline-variant/20"></div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">Market Avg</p>
            <p className="text-3xl font-black text-on-surface">₹1,542</p>
          </div>
        </div>
      </section>

      {/* Main Chart Section */}
      <section className="mb-10">
        <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/10 overflow-hidden relative">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-on-surface tracking-tight">Price History Analysis</h2>
              <p className="text-sm text-on-surface-variant">Comparative trends over the last 30 days across major retail channels.</p>
            </div>
          </div>

          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#424754" vertical={false} opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  stroke="#c2c6d6" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#c2c6d6" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171f33', border: '1px solid #424754', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="you" stroke="#adc6ff" strokeWidth={3} dot={{ r: 4, fill: '#adc6ff' }} activeDot={{ r: 6 }} name="Your Store" />
                <Line type="monotone" dataKey="amazon" stroke="#fb923c" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Amazon" />
                <Line type="monotone" dataKey="flipkart" stroke="#3b82f6" strokeWidth={2} dot={false} name="Flipkart" />
                <Line type="monotone" dataKey="myntra" stroke="#ec4899" strokeWidth={2} dot={false} name="Myntra" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Prices */}
        <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-on-surface">Current Prices</h3>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Amazon', price: 1520, rating: '4.2 (12k)', status: 'In Stock', color: 'secondary' },
              { name: 'Flipkart', price: 1495, rating: '4.0 (8k)', status: 'In Stock', color: 'secondary' },
              { name: 'Myntra', price: 1649, rating: '4.5 (5k)', status: 'Out of Stock', color: 'tertiary' },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-bright flex items-center justify-center text-[10px] font-bold">
                    {p.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">{p.name}</p>
                    <p className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded inline-block",
                      p.status === 'In Stock' ? "bg-secondary-container/20 text-secondary" : "bg-error-container/10 text-tertiary-container"
                    )}>{p.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-on-surface">₹{p.price.toLocaleString()}</p>
                  <p className="text-[10px] text-on-surface-variant">⭐ {p.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Confidence: 94%</span>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <h3 className="font-bold text-lg text-on-surface">AI Recommendation</h3>
          </div>
          <div className="bg-surface-container-lowest/50 rounded-2xl p-5 mb-6 border border-secondary/20 border-dashed">
            <p className="text-sm italic text-on-surface-variant leading-relaxed">
              "Market trends indicate a shift towards holiday pricing. Flipkart has undercut your price by 0.3%. To maintain the Buy Box and maximize conversion, a slight adjustment is recommended."
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-outline-variant/10 pb-4">
              <span className="text-xs text-on-surface-variant">Suggested Price</span>
              <span className="text-2xl font-black text-secondary">₹1,485</span>
            </div>
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Reasoning</h4>
              <ul className="text-xs text-on-surface space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  Price sensitivity is high for 'Ethnic Wear' category.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  High inventory levels (400+ units) suggest aggressive pricing.
                </li>
              </ul>
            </div>
            <button className="w-full mt-2 bg-secondary text-on-secondary-container py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
              Apply Suggested Price
            </button>
          </div>
        </div>

        {/* Price Alerts History */}
        <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
              <BellRing className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-on-surface">Price Alerts History</h3>
          </div>
          <div className="space-y-0 relative">
            <div className="absolute left-[20px] top-4 bottom-4 w-[2px] bg-outline-variant/10"></div>
            {[
              { time: 'Oct 29, 09:45 AM', platform: 'Flipkart', type: 'Price Drop Detected', old: 1550, new: 1495, color: 'blue-400' },
              { time: 'Oct 25, 02:12 PM', platform: 'Amazon', type: 'Stock Level Warning', detail: 'Competitor stock running low (< 10 units).', color: 'orange-400' },
              { time: 'Oct 21, 11:30 AM', platform: 'Myntra', type: 'New Entry Detected', detail: 'Product listed at ₹1,649.', color: 'pink-400' },
            ].map((alert, i) => (
              <div key={i} className="relative flex gap-4 pb-6">
                <div className="z-10 bg-surface-container p-1 mt-1">
                  <div className={cn("w-2.5 h-2.5 rounded-full", i === 0 ? "bg-tertiary shadow-[0_0_8px_#ffb3ad]" : "bg-outline-variant")}></div>
                </div>
                <div className={cn("flex-1 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/5", i !== 0 && "opacity-70")}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">{alert.time}</span>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded font-bold uppercase", `bg-${alert.color}/20 text-${alert.color}`)}>{alert.platform}</span>
                  </div>
                  <p className="text-xs font-semibold text-on-surface">{alert.type}</p>
                  {alert.old ? (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-on-surface-variant line-through">₹{alert.old}</span>
                      <ArrowRight className="w-3 h-3 text-on-surface-variant" />
                      <span className="text-xs font-black text-tertiary">₹{alert.new}</span>
                    </div>
                  ) : (
                    <p className="text-[10px] text-on-surface-variant mt-1">{alert.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
