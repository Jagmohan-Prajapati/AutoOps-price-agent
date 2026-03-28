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
import { cn } from '../lib/utils';

export const Dashboard: React.FC<{ onProductClick: (id: string) => void }> = ({ onProductClick }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<string>('Never');
  const streamRef = useRef<any>(null);

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
    getAlerts().then(setAlerts).catch(console.error);
  }, []);

  const handleRunScan = async () => {
    if (products.length === 0 || scanning) return;
    setScanning(true);
    setLogs([]);
    try {
      const allIds = products.map((p: any) => p.id);
      const { scan_id } = await triggerScan(allIds, ['amazon', 'flipkart', 'myntra']);
      streamRef.current = createScanStream(scan_id, (event: any) => {
        const time = new Date().toLocaleTimeString('en-IN', { hour12: false });
        setLogs(prev => [...prev, {
          id: Date.now().toString(),
          timestamp: time,
          message: event.message,
          type: event.type === 'agent_error' ? 'error' : event.type === 'alert' ? 'warning' : 'info'
        }]);
        if (event.type === 'scan_complete') {
          setScanning(false);
          setLastScan('Just now');
          getProducts().then(setProducts);
          getAlerts().then(setAlerts);
          streamRef.current?.close();
        }
      });
    } catch (err) {
      console.error(err);
      setScanning(false);
    }
  };

  const alertsToday = alerts.filter((a: any) => {
    const created = new Date(a.created_at);
    const today = new Date();
    return created.toDateString() === today.toDateString();
  }).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-[1600px] mx-auto pb-20">
      {/* Hero Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container rounded-2xl p-5 border border-outline/10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Products Tracked</span>
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-on-surface">{products.length}</span>
          </div>
        </div>
        <div className="bg-surface-container rounded-2xl p-5 border border-outline/10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Platforms Monitored</span>
            <Network className="w-5 h-5 text-secondary" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {['AMAZON', 'FLIPKART', 'MYNTRA'].map(p => (
              <span key={p} className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full">{p}</span>
            ))}
          </div>
        </div>
        <div className="bg-surface-container rounded-2xl p-5 border border-outline/10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Price Alerts Today</span>
            <BellRing className="w-5 h-5 text-tertiary-container" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={cn("text-3xl font-black", alertsToday > 0 ? 'text-tertiary-container' : 'text-on-surface')}>{alertsToday}</span>
            {alertsToday > 0 && <span className="text-xs text-tertiary-container">critical</span>}
          </div>
        </div>
        <div className="bg-surface-container rounded-2xl p-5 border border-outline/10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Last Scan</span>
            <Clock className="w-5 h-5 text-on-surface-variant" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-on-surface">{lastScan}</span>
          </div>
        </div>
      </div>

      {/* Run Scan Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleRunScan}
          disabled={scanning}
          className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {scanning ? (
            <><span className="animate-spin">⚙</span> Scanning...</>
          ) : (
            <>Run New Scan</>
          )}
        </button>
      </div>

      {/* Dashboard Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Price Table */}
        <div className="lg:col-span-2 bg-surface-container rounded-2xl border border-outline/10 overflow-hidden">
          <div className="p-4 border-b border-outline/10 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Product Price Inventory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline/10">
                  {['Product Name', 'Your Price', 'AMZ', 'FK', 'MYN', 'GAP (%)', 'Recommendation'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-on-surface-variant">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-on-surface-variant text-sm">No products yet. Add products to start tracking.</td></tr>
                ) : products.map((product: any) => (
                  <tr key={product.id} onClick={() => onProductClick(product.id)} className="border-b border-outline/10 hover:bg-surface-bright/20 transition-colors group cursor-pointer">
                    <td className="px-4 py-3 font-semibold text-on-surface text-sm">{product.name}</td>
                    <td className="px-4 py-3 text-sm">₹{Number(product.your_price).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-on-surface-variant">—</td>
                    <td className="px-4 py-3 text-sm text-on-surface-variant">—</td>
                    <td className="px-4 py-3 text-sm text-on-surface-variant">—</td>
                    <td className="px-4 py-3 text-sm text-on-surface-variant">—</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">Run Scan</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          {/* Live Agent Activity Terminal */}
          <div className="bg-surface-container rounded-2xl border border-outline/10 overflow-hidden">
            <div className="p-4 border-b border-outline/10 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Live Agent Activity</h2>
              {scanning && <span className="px-2 py-0.5 bg-secondary/20 text-secondary text-xs font-bold rounded-full animate-pulse">Streaming</span>}
            </div>
            <div className="bg-[#0d1117] h-64 overflow-y-auto p-4 font-mono text-xs">
              {logs.length === 0 ? (
                <p className="text-gray-500">Waiting for scan to start...</p>
              ) : logs.map((log: any) => (
                <div key={log.id} className={cn('mb-1', log.type === 'error' ? 'text-red-400' : log.type === 'warning' ? 'text-yellow-400' : 'text-green-400')}>
                  <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-surface-container rounded-2xl border border-outline/10 overflow-hidden">
            <div className="p-4 border-b border-outline/10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Recent Alerts</h2>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {alerts.length === 0 ? (
                <p className="text-on-surface-variant text-xs">No alerts yet. Run a scan to detect price changes.</p>
              ) : alerts.slice(0, 5).map((alert: any) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 bg-surface rounded-xl border border-outline/10">
                  <AlertTriangle className="w-4 h-4 text-tertiary-container mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-on-surface">{alert.products?.name ?? 'Product'}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{alert.message}</p>
                    <p className="text-[10px] text-on-surface-variant mt-1">{new Date(alert.created_at).toLocaleTimeString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
