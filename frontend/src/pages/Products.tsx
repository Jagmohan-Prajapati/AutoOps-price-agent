import React, { useEffect, useMemo, useState } from 'react';
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
import { getProducts, getProductHistory, getAlerts } from '../lib/api';

function toArray<T = any>(value: any): T[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.results)) return value.results;
  return [];
}

function formatCurrency(value?: number | null) {
  return `₹${Number(value || 0).toLocaleString()}`;
}

function formatLastScan(value?: string | null) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatShortDate(value?: string | null) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
}

function normalizeProduct(item: any) {
  return {
    id: String(item?.id ?? item?.product_id ?? ''),
    name: item?.name || 'Blue Cotton Kurta',
    category: item?.category || 'Ethnic Wear',
    yourPrice: Number(item?.your_price ?? item?.yourPrice ?? 1499),
    sku: item?.sku || item?.product_code || 'PROD-7821-IND',
    updatedAt: item?.updated_at || item?.last_scan_at || item?.lastScanAt || null,
    targetMargin: item?.target_margin ?? item?.targetMargin,
  };
}

function normalizeHistory(items: any[], yourPrice: number) {
  return items.map((row: any, idx: number) => ({
    name: formatShortDate(row?.timestamp || row?.created_at || row?.date) || `Point ${idx + 1}`,
    you: Number(row?.your_price ?? row?.yourPrice ?? yourPrice),
    amazon: Number(row?.amazon_price ?? row?.amazonPrice ?? row?.amazon ?? 0),
    flipkart: Number(row?.flipkart_price ?? row?.flipkartPrice ?? row?.flipkart ?? 0),
    myntra: Number(row?.myntra_price ?? row?.myntraPrice ?? row?.myntra ?? 0),
    rawTs: row?.timestamp || row?.created_at || row?.date,
  }));
}

function latestMarketPrices(chartData: any[]) {
  const latest = chartData[chartData.length - 1];
  if (!latest) {
    return {
      amazon: 0,
      flipkart: 0,
      myntra: 0,
    };
  }
  return {
    amazon: latest.amazon || 0,
    flipkart: latest.flipkart || 0,
    myntra: latest.myntra || 0,
  };
}

function averageMarketPrice(prices: { amazon: number; flipkart: number; myntra: number }) {
  const vals = [prices.amazon, prices.flipkart, prices.myntra].filter((v) => Number(v) > 0);
  if (!vals.length) return 0;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function normalizeAlerts(items: any[]) {
  return items.map((alert: any, idx: number) => ({
    id: String(alert?.id ?? idx + 1),
    time: formatLastScan(alert?.created_at || alert?.timestamp || alert?.time),
    platform: alert?.platform || alert?.source || 'Platform',
    type: alert?.type || alert?.title || alert?.event || 'Alert',
    old: alert?.old_price ?? alert?.oldPrice,
    new: alert?.new_price ?? alert?.newPrice,
    detail: alert?.detail || alert?.message || '',
  }));
}

export const Products: React.FC = () => {
  const [product, setProduct] = useState(() =>
    normalizeProduct(null)
  );
  const [chartData, setChartData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const productsRes = await getProducts();
        const products = toArray(productsRes);
        const firstProduct = normalizeProduct(products[0] || null);

        if (!mounted) return;
        setProduct(firstProduct);

        if (!firstProduct.id) return;

        const [historyRes, alertsRes] = await Promise.all([
          getProductHistory(firstProduct.id),
          getAlerts(),
        ]);

        const normalizedHistory = normalizeHistory(
          toArray(historyRes),
          firstProduct.yourPrice
        );

        const normalizedAlerts = normalizeAlerts(
          toArray(alertsRes).filter((a: any) => {
            const alertProductId = a?.product_id ?? a?.productId;
            return !alertProductId || String(alertProductId) === firstProduct.id;
          })
        );

        if (mounted) {
          setChartData(normalizedHistory);
          setAlerts(normalizedAlerts);
        }
      } catch (error) {
        console.error('Failed to load product detail:', error);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const currentPrices = useMemo(() => latestMarketPrices(chartData), [chartData]);
  const marketAvg = useMemo(() => averageMarketPrice(currentPrices), [currentPrices]);

  const displayedAlerts = alerts.slice(0, 3);

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
        <span className="text-on-surface">{product.name}</span>
      </nav>

      {/* Product Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 rounded bg-secondary-container/20 text-secondary text-[10px] font-bold uppercase tracking-wider border border-secondary/20">{product.category}</span>
            <span className="text-on-surface-variant text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Last scan: {formatLastScan(product.updatedAt)}
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface mb-2">{product.name}</h1>
          <p className="text-on-surface-variant max-w-xl text-sm">SKU: {product.sku}. High-demand seasonal apparel with dynamic pricing enabled across 4 major platforms.</p>
        </div>
        
        <div className="flex items-center gap-8 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">Your Current Price</p>
            <p className="text-3xl font-black text-primary">{formatCurrency(product.yourPrice)}</p>
          </div>
          <div className="h-10 w-[1px] bg-outline-variant/20"></div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">Market Avg</p>
            <p className="text-3xl font-black text-on-surface">{formatCurrency(marketAvg)}</p>
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
              <LineChart data={chartData}>
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
              { name: 'Amazon', price: currentPrices.amazon, rating: '4.2 (12k)', status: currentPrices.amazon > 0 ? 'In Stock' : 'Out of Stock', color: 'secondary' },
              { name: 'Flipkart', price: currentPrices.flipkart, rating: '4.0 (8k)', status: currentPrices.flipkart > 0 ? 'In Stock' : 'Out of Stock', color: 'secondary' },
              { name: 'Myntra', price: currentPrices.myntra, rating: '4.5 (5k)', status: currentPrices.myntra > 0 ? 'In Stock' : 'Out of Stock', color: 'tertiary' },
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
              <span className="text-2xl font-black text-secondary">
                ₹{Math.max(0, Math.min(
                  currentPrices.flipkart || product.yourPrice,
                  product.yourPrice
                )).toLocaleString()}
              </span>
            </div>
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Reasoning</h4>
              <ul className="text-xs text-on-surface space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  Price sensitivity is high for '{product.category}' category.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  Competitive pricing is recommended when market average is near your current price.
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
            {displayedAlerts.map((alert, i) => (
              <div key={alert.id} className="relative flex gap-4 pb-6">
                <div className="z-10 bg-surface-container p-1 mt-1">
                  <div className={cn("w-2.5 h-2.5 rounded-full", i === 0 ? "bg-tertiary shadow-[0_0_8px_#ffb3ad]" : "bg-outline-variant")}></div>
                </div>
                <div className={cn("flex-1 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/5", i !== 0 && "opacity-70")}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">{alert.time}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-surface-bright text-on-surface-variant">{alert.platform}</span>
                  </div>
                  <p className="text-xs font-semibold text-on-surface">{alert.type}</p>
                  {alert.old != null && alert.new != null ? (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-on-surface-variant line-through">₹{Number(alert.old).toLocaleString()}</span>
                      <ArrowRight className="w-3 h-3 text-on-surface-variant" />
                      <span className="text-xs font-black text-tertiary">₹{Number(alert.new).toLocaleString()}</span>
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
