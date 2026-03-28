import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { 
  History, 
  Download, 
  Calendar, 
  ChevronRight, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight,
  X,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScanRun, ActivityLog } from '../types';
import { cn } from '../lib/utils';
import { getScanHistory, getScanDetail } from '../lib/api';

function toArray<T = any>(value: any): T[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.results)) return value.results;
  return [];
}

function formatDateTime(value?: string | null) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTime(value?: string | null) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatDuration(start?: string | null, end?: string | null, raw?: string | number | null) {
  if (typeof raw === 'string' && raw.trim()) return raw;
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    const mins = Math.floor(raw / 60);
    const secs = raw % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }

  if (!start) return '-';
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : null;

  if (Number.isNaN(startDate.getTime())) return '-';
  if (!endDate || Number.isNaN(endDate.getTime())) return 'Running';

  const totalSeconds = Math.max(0, Math.floor((endDate.getTime() - startDate.getTime()) / 1000));
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

function normalizeStatus(status?: string | null) {
  const s = (status || '').toLowerCase();
  if (s.includes('complete') || s === 'success' || s === 'finished') return 'Completed';
  if (s.includes('fail') || s === 'error') return 'Failed';
  if (s.includes('progress') || s === 'running' || s === 'queued' || s === 'started') return 'In Progress';
  return status || 'In Progress';
}

function normalizePlatforms(item: any): string[] {
  return (
    item?.platforms ||
    item?.platform_names ||
    item?.scan_platforms ||
    []
  ).map((p: any) => String(p));
}

function normalizeLogs(logs: any[]): ActivityLog[] {
  return logs.map((log: any, idx: number) => ({
    id: String(log?.id ?? idx + 1),
    timestamp: formatTime(log?.timestamp || log?.created_at || log?.time),
    message: log?.message || log?.event || log?.detail || 'Event recorded',
    type:
      log?.type ||
      (String(log?.level || '').toLowerCase().includes('error')
        ? 'error'
        : String(log?.level || '').toLowerCase().includes('success')
        ? 'success'
        : 'info'),
  }));
}

function normalizeProductBreakdown(items: any[]) {
  return items.map((p: any, idx: number) => ({
    id: String(p?.id ?? idx + 1),
    name: p?.name || p?.product_name || `Product ${idx + 1}`,
    amazonPrice: Number(p?.amazonPrice ?? p?.amazon_price ?? p?.amazon ?? 0),
    flipkartPrice: Number(p?.flipkartPrice ?? p?.flipkart_price ?? p?.flipkart ?? 0),
    myntraPrice: Number(p?.myntraPrice ?? p?.myntra_price ?? p?.myntra ?? 0),
    alertTriggered: Boolean(p?.alertTriggered ?? p?.alert_triggered ?? p?.has_alert ?? false),
  }));
}

function normalizeScan(item: any): ScanRun {
  const start = item?.startTime || item?.start_time || item?.started_at || item?.created_at || null;
  const end = item?.endTime || item?.end_time || item?.completed_at || item?.finished_at || null;
  const logs = normalizeLogs(toArray(item?.logs));
  const productBreakdown = normalizeProductBreakdown(
    toArray(item?.productBreakdown || item?.product_breakdown)
  );

  return {
    id: String(item?.id ?? item?.scan_id ?? item?.scanId ?? ''),
    dateTime: formatDateTime(item?.dateTime || item?.date_time || start || item?.created_at),
    productsScanned: Number(
      item?.productsScanned ??
        item?.products_scanned ??
        item?.product_count ??
        item?.total_products ??
        0
    ),
    platforms: normalizePlatforms(item),
    duration: formatDuration(
      start,
      end,
      item?.duration ?? item?.duration_seconds
    ),
    alertsFound: Number(item?.alertsFound ?? item?.alerts_found ?? item?.alert_count ?? 0),
    status: normalizeStatus(item?.status),
    startTime: formatTime(start),
    endTime: end ? formatTime(end) : '-',
    productBreakdown,
    logs,
  };
}

function durationToSeconds(duration: string) {
  if (!duration || duration === '-' || duration === 'Running') return 0;
  const minMatch = duration.match(/(\d+)m/);
  const secMatch = duration.match(/(\d+)s/);
  const mins = minMatch ? Number(minMatch[1]) : 0;
  const secs = secMatch ? Number(secMatch[1]) : 0;
  return mins * 60 + secs;
}

function averageDuration(scans: ScanRun[]) {
  const completed = scans.filter((s) => s.duration && s.duration !== '-' && s.duration !== 'Running');
  if (!completed.length) return '-';

  const total = completed.reduce((acc, s) => acc + durationToSeconds(s.duration), 0);
  const avg = Math.floor(total / completed.length);
  const mins = Math.floor(avg / 60);
  const secs = avg % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

export const ScanHistory: React.FC<{ onRunScan: () => void }> = ({ onRunScan }) => {
  const [selectedScan, setSelectedScan] = useState<ScanRun | null>(null);
  const [scans, setScans] = useState<ScanRun[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadScans() {
      try {
        const data = await getScanHistory();
        const normalized = toArray(data).map(normalizeScan);
        if (mounted) setScans(normalized);
      } catch (error) {
        console.error('Failed to load scan history:', error);
        if (mounted) setScans([]);
      }
    }

    loadScans();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    return {
      totalScans: scans.length,
      productsScanned: scans.reduce((acc, s) => acc + s.productsScanned, 0),
      alertsGenerated: scans.reduce((acc, s) => acc + s.alertsFound, 0),
      avgDuration: averageDuration(scans),
    };
  }, [scans]);

  const handleViewDetails = async (scan: ScanRun) => {
    try {
      const detail = await getScanDetail(scan.id);
      setSelectedScan(normalizeScan(detail));
    } catch (error) {
      console.error(`Failed to load scan detail for ${scan.id}:`, error);
      setSelectedScan(scan);
    }
  };

  if (scans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-center p-8">
        <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6 border border-outline-variant/20">
          <History className="w-10 h-10 text-on-surface-variant opacity-20" />
        </div>
        <h2 className="text-2xl font-bold text-on-surface mb-2">No scans yet</h2>
        <p className="text-on-surface-variant max-w-md mb-8">
          Run your first scan to see history here. Our agent will track price changes across all major platforms.
        </p>
        <button 
          onClick={onRunScan}
          className="px-8 py-3 primary-gradient text-on-primary-container rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Play className="w-4 h-4 fill-current" />
          Run Scan
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tighter">Scan History</h1>
          <p className="text-on-surface-variant text-sm">Review past agent operations and price intelligence logs.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-container-low rounded-xl border border-outline-variant/10 p-1">
            {['7D', '30D', '90D', 'Custom'].map((range) => (
              <button 
                key={range}
                className={cn(
                  "px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors",
                  range === '30D' ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-low border border-outline-variant/10 rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Scans Run', value: stats.totalScans, icon: History, color: 'text-primary' },
          { label: 'Products Scanned', value: stats.productsScanned.toLocaleString(), icon: Search, color: 'text-secondary' },
          { label: 'Alerts Generated', value: stats.alertsGenerated, icon: AlertCircle, color: 'text-tertiary-container', isAlert: true },
          { label: 'Avg Scan Duration', value: stats.avgDuration, icon: Clock, color: 'text-on-surface-variant' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{stat.label}</span>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <p className={cn(
              "text-3xl font-black tracking-tighter",
              stat.isAlert ? "text-tertiary-container" : "text-on-surface"
            )}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10">
          <h2 className="text-lg font-bold text-on-surface tracking-tight">All Scan Runs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container/50 text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Scan ID</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4 text-center">Products</th>
                <th className="px-6 py-4">Platforms</th>
                <th className="px-6 py-4 text-center">Duration</th>
                <th className="px-6 py-4 text-center">Alerts</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {scans.map((scan) => (
                <tr key={scan.id} className="hover:bg-surface-bright/20 transition-colors group">
                  <td className="px-6 py-5 font-mono text-xs text-primary font-bold">{scan.id}</td>
                  <td className="px-6 py-5 text-sm text-on-surface">{scan.dateTime}</td>
                  <td className="px-6 py-5 text-center text-sm font-bold">{scan.productsScanned}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1">
                      {scan.platforms.map(p => (
                        <span key={p} className="bg-surface-container px-2 py-0.5 rounded text-[9px] font-bold text-on-surface-variant uppercase border border-outline-variant/10">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center text-xs text-on-surface-variant font-medium">{scan.duration}</td>
                  <td className="px-6 py-5 text-center">
                    {scan.alertsFound > 0 ? (
                      <span className="bg-error-container/20 text-tertiary-container px-2 py-0.5 rounded text-[10px] font-black">
                        {scan.alertsFound}
                      </span>
                    ) : (
                      <span className="text-on-surface-variant opacity-30">—</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight flex items-center gap-1.5 w-fit",
                      scan.status === 'Completed' ? "bg-secondary-container/20 text-secondary" :
                      scan.status === 'Failed' ? "bg-error-container/20 text-tertiary-container" :
                      "bg-primary-container/20 text-primary-fixed"
                    )}>
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        scan.status === 'Completed' ? "bg-secondary" :
                        scan.status === 'Failed' ? "bg-tertiary-container" :
                        "bg-primary animate-pulse"
                      )}></span>
                      {scan.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => handleViewDetails(scan)}
                      className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-container transition-colors flex items-center gap-1 ml-auto"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Drawer */}
      <AnimatePresence>
        {selectedScan && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScan(null)}
              className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-2xl bg-surface-container-low border-l border-outline-variant/20 z-[70] shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-primary">{selectedScan.id}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                      selectedScan.status === 'Completed' ? "bg-secondary-container/20 text-secondary" : "bg-error-container/20 text-tertiary-container"
                    )}>{selectedScan.status}</span>
                  </div>
                  <h2 className="text-xl font-bold text-on-surface tracking-tight">Scan Run Details</h2>
                </div>
                <button 
                  onClick={() => setSelectedScan(null)}
                  className="p-2 hover:bg-surface-container rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-on-surface-variant" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                {/* Scan Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Start Time</p>
                    <p className="text-sm font-bold text-on-surface">{selectedScan.startTime}</p>
                  </div>
                  <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">End Time</p>
                    <p className="text-sm font-bold text-on-surface">{selectedScan.endTime}</p>
                  </div>
                  <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Duration</p>
                    <p className="text-sm font-bold text-on-surface">{selectedScan.duration}</p>
                  </div>
                  <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Total Products</p>
                    <p className="text-sm font-bold text-on-surface">{selectedScan.productsScanned}</p>
                  </div>
                </div>

                {/* Product Breakdown */}
                {selectedScan.productBreakdown.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Product Breakdown</h3>
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-surface-container/50 text-on-surface-variant font-bold">
                            <th className="px-4 py-3">Product</th>
                            <th className="px-2 py-3 text-center">AMZ</th>
                            <th className="px-2 py-3 text-center">FK</th>
                            <th className="px-2 py-3 text-center">MYN</th>
                            <th className="px-4 py-3 text-right">Alert</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/5">
                          {selectedScan.productBreakdown.map((p) => (
                            <tr key={p.id} className="hover:bg-surface-bright/10 transition-colors">
                              <td className="px-4 py-3 font-medium text-on-surface">{p.name}</td>
                              <td className="px-2 py-3 text-center text-on-surface-variant">₹{p.amazonPrice}</td>
                              <td className="px-2 py-3 text-center text-on-surface-variant">₹{p.flipkartPrice}</td>
                              <td className="px-2 py-3 text-center text-on-surface-variant">₹{p.myntraPrice}</td>
                              <td className="px-4 py-3 text-right">
                                {p.alertTriggered ? (
                                  <span className="text-tertiary-container font-bold">Yes</span>
                                ) : (
                                  <span className="text-on-surface-variant opacity-30">No</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Raw Agent Log */}
                <div className="space-y-4 pb-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Raw Agent Log</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-on-surface-variant uppercase">SSE Events</span>
                    </div>
                  </div>
                  <div className="bg-[#0d1117] rounded-xl border border-outline-variant/20 p-5 font-mono text-[11px] leading-relaxed h-[300px] overflow-y-auto shadow-inner no-scrollbar">
                    {selectedScan.logs.length > 0 ? (
                      selectedScan.logs.map((log) => (
                        <div key={log.id} className="mb-2 flex gap-3">
                          <span className="text-secondary opacity-50">[{log.timestamp}]</span>
                          <span className={cn(
                            "text-on-surface-variant",
                            log.type === 'success' && "text-secondary font-bold",
                            log.type === 'error' && "text-tertiary-container"
                          )}>
                            {log.message}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full text-on-surface-variant opacity-30 italic">
                        No logs available for this scan run.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
