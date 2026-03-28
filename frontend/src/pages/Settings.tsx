import type React from 'react';
import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Bell, 
  ShieldCheck, 
  AlertTriangle, 
  Save, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Zap, 
  Database, 
  Trash2, 
  RefreshCw,
  Info,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

type Tab = 'general' | 'platforms' | 'alerts' | 'api' | 'danger';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [isVerified, setIsVerified] = useState<Record<string, boolean>>({});
  const [showTestModal, setShowTestModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<{ type: string; isOpen: boolean }>({ type: '', isOpen: false });
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const toggleVisibility = (key: string) => {
    setShowApiKey(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const verifyKey = (key: string) => {
    setIsVerified(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setIsVerified(prev => ({ ...prev, [key]: false }));
    }, 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Store Name</label>
                <input 
                  type="text" 
                  defaultValue="My Clothing Store"
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Default Currency</label>
                <select className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none">
                  <option value="INR">INR ₹ (Indian Rupee)</option>
                  <option value="USD">USD $ (US Dollar)</option>
                  <option value="EUR">EUR € (Euro)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Timezone</label>
                <select className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none">
                  <option value="IST">Asia/Kolkata (GMT+5:30)</option>
                  <option value="UTC">UTC (GMT+0:00)</option>
                  <option value="EST">America/New_York (GMT-5:00)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Auto-scan frequency</label>
                <select className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none">
                  <option value="manual">Manual</option>
                  <option value="6h">Every 6 hours</option>
                  <option value="12h">Every 12 hours</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
            <div className="pt-4 border-t border-outline-variant/10">
              <button className="px-8 py-3 primary-gradient text-on-primary-container rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </motion.div>
        );
      case 'platforms':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Amazon.in', 'Flipkart', 'Myntra'].map((platform) => (
                <div key={platform} className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center font-black text-primary border border-outline-variant/10">
                      {platform[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-on-surface">{platform}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-secondary-container/20 text-secondary font-bold uppercase tracking-tighter">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/5">
                    <span className="text-xs font-medium text-on-surface-variant">Active Status</span>
                    <button className="w-10 h-5 bg-secondary rounded-full relative transition-colors">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-on-secondary rounded-full shadow-sm"></div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/10 flex gap-3 items-start">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-on-surface-variant leading-relaxed">
                TinyFish Web Agent handles all platform connections automatically — no API keys required. We use advanced browser emulation to fetch real-time data directly from the source.
              </p>
            </div>
          </motion.div>
        );
      case 'alerts':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Price Drop Alert Threshold</label>
                  <span className="text-lg font-black text-primary">15%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  defaultValue="15"
                  className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-on-surface">Stock Alert</p>
                      <p className="text-xs text-on-surface-variant">Notify when competitor goes out of stock</p>
                    </div>
                    <button className="w-10 h-5 bg-secondary rounded-full relative transition-colors">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-on-secondary rounded-full shadow-sm"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-on-surface">Email Notifications</p>
                      <p className="text-xs text-on-surface-variant">Receive daily summary reports</p>
                    </div>
                    <button className="w-10 h-5 bg-secondary rounded-full relative transition-colors">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-on-secondary rounded-full shadow-sm"></div>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      defaultValue="jagmohanprajapat003@gmail.com"
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-on-surface">Alert Sound</p>
                      <p className="text-xs text-on-surface-variant">Play sound for critical price drops</p>
                    </div>
                    <button className="w-10 h-5 bg-surface-container rounded-full relative transition-colors">
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-on-surface-variant rounded-full shadow-sm"></div>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Notification Preview</label>
                  <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Zap className="w-5 h-5 fill-current" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-black text-on-surface uppercase tracking-tight">Price Drop Alert</p>
                          <span className="text-[9px] text-on-surface-variant">Just now</span>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          <span className="font-bold text-on-surface">Blue Cotton Kurta</span> dropped by <span className="text-secondary font-bold">₹120</span> on Amazon.in.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'api':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">TinyFish API Key</label>
                  {isVerified['tinyfish'] && (
                    <span className="text-[10px] font-bold text-secondary flex items-center gap-1">
                      <Check className="w-3 h-3" /> Connected ✓
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      type={showApiKey['tinyfish'] ? "text" : "password"} 
                      defaultValue="tf_live_9821_ind_ops_782"
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors pr-20"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <button onClick={() => toggleVisibility('tinyfish')} className="p-1.5 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant">
                        {showApiKey['tinyfish'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => copyToClipboard('tf_live_9821_ind_ops_782')} className="p-1.5 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => verifyKey('tinyfish')}
                    className="px-6 bg-surface-container border border-outline-variant/10 rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    Verify Key
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Fireworks.ai API Key</label>
                  {isVerified['fireworks'] && (
                    <span className="text-[10px] font-bold text-secondary flex items-center gap-1">
                      <Check className="w-3 h-3" /> Connected ✓
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      type={showApiKey['fireworks'] ? "text" : "password"} 
                      defaultValue="fw_9821_ai_model_ops"
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors pr-20"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <button onClick={() => toggleVisibility('fireworks')} className="p-1.5 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant">
                        {showApiKey['fireworks'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => copyToClipboard('fw_9821_ai_model_ops')} className="p-1.5 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => verifyKey('fireworks')}
                    className="px-6 bg-surface-container border border-outline-variant/10 rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    Verify Key
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Supabase URL</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      defaultValue="https://zorxe7xz2gexwryzw3oa.supabase.co"
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors pr-10"
                    />
                    <button onClick={() => copyToClipboard('https://zorxe7xz2gexwryzw3oa.supabase.co')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Supabase Anon Key</label>
                  <div className="relative">
                    <input 
                      type={showApiKey['supabase'] ? "text" : "password"} 
                      defaultValue="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors pr-20"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <button onClick={() => toggleVisibility('supabase')} className="p-1.5 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant">
                        {showApiKey['supabase'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => copyToClipboard('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')} className="p-1.5 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-outline-variant/10">
              <button 
                onClick={() => setShowTestModal(true)}
                className="w-full py-4 bg-surface-container border border-outline-variant/20 rounded-2xl font-bold text-on-surface hover:bg-surface-container-high transition-all flex items-center justify-center gap-2 group"
              >
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                Test All Connections
              </button>
            </div>
          </motion.div>
        );
      case 'danger':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="p-8 rounded-2xl border-2 border-tertiary-container/30 bg-tertiary-container/5 space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-tertiary-container/20 flex items-center justify-center text-tertiary-container shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Danger Zone</h3>
                  <p className="text-sm text-on-surface-variant">These actions are destructive and cannot be undone. Please proceed with extreme caution.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 rounded-xl bg-surface-container-low border border-outline-variant/10">
                  <div>
                    <p className="font-bold text-on-surface">Clear All Price History</p>
                    <p className="text-xs text-on-surface-variant">Permanently delete all historical price data points</p>
                  </div>
                  <button 
                    onClick={() => setShowDeleteModal({ type: 'Clear All Price History', isOpen: true })}
                    className="px-6 py-2.5 bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20 rounded-xl text-xs font-bold hover:bg-tertiary-container hover:text-on-tertiary-container transition-all"
                  >
                    Clear History
                  </button>
                </div>
                <div className="flex items-center justify-between p-6 rounded-xl bg-surface-container-low border border-outline-variant/10">
                  <div>
                    <p className="font-bold text-on-surface">Delete All Products</p>
                    <p className="text-xs text-on-surface-variant">Remove all tracked products and their configurations</p>
                  </div>
                  <button 
                    onClick={() => setShowDeleteModal({ type: 'Delete All Products', isOpen: true })}
                    className="px-6 py-2.5 bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20 rounded-xl text-xs font-bold hover:bg-tertiary-container hover:text-on-tertiary-container transition-all"
                  >
                    Delete Products
                  </button>
                </div>
                <div className="flex items-center justify-between p-6 rounded-xl bg-surface-container-low border border-outline-variant/10">
                  <div>
                    <p className="font-bold text-on-surface">Reset All Settings</p>
                    <p className="text-xs text-on-surface-variant">Restore all application settings to factory defaults</p>
                  </div>
                  <button 
                    onClick={() => setShowDeleteModal({ type: 'Reset All Settings', isOpen: true })}
                    className="px-6 py-2.5 bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20 rounded-xl text-xs font-bold hover:bg-tertiary-container hover:text-on-tertiary-container transition-all"
                  >
                    Reset Settings
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-12 gap-8">
        {/* Left Sidebar Navigation */}
        <div className="col-span-12 lg:col-span-3 space-y-2">
          {[
            { id: 'general', label: 'General', icon: Globe },
            { id: 'platforms', label: 'Platforms', icon: Zap },
            { id: 'alerts', label: 'Alerts & Notifications', icon: Bell },
            { id: 'api', label: 'API & Integrations', icon: Database },
            { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group",
                activeTab === tab.id 
                  ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
              )}
            >
              <tab.icon className={cn(
                "w-5 h-5 transition-transform group-hover:scale-110",
                activeTab === tab.id ? "text-on-primary" : "text-on-surface-variant"
              )} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="col-span-12 lg:col-span-9 bg-surface-container-low/30 rounded-3xl p-8 border border-outline-variant/10 min-h-[600px]">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-on-surface tracking-tighter capitalize">{activeTab.replace('-', ' ')}</h2>
            <p className="text-sm text-on-surface-variant">Configure your workspace and system preferences.</p>
          </div>
          {renderTabContent()}
        </div>
      </div>

      {/* Test Connections Modal */}
      <AnimatePresence>
        {showTestModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTestModal(false)}
              className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface-container-low border border-outline-variant/20 rounded-3xl p-8 z-[110] shadow-2xl"
            >
              <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-primary" />
                System Connectivity Test
              </h3>
              <div className="space-y-4 mb-8">
                {[
                  { name: 'TinyFish Web Agent', status: 'success' },
                  { name: 'Fireworks.ai Inference', status: 'success' },
                  { name: 'Supabase Database', status: 'success' },
                  { name: 'Platform Scrapers', status: 'success' },
                  { name: 'Email SMTP Server', status: 'error' },
                ].map((service, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-container/50 border border-outline-variant/5">
                    <span className="text-sm font-medium text-on-surface">{service.name}</span>
                    {service.status === 'success' ? (
                      <div className="flex items-center gap-1.5 text-secondary text-[10px] font-bold uppercase">
                        <Check className="w-4 h-4" /> Connected
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-tertiary-container text-[10px] font-bold uppercase">
                        <XCircle className="w-4 h-4" /> Failed
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setShowTestModal(false)}
                className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Close Report
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Danger Zone Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal.isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal({ type: '', isOpen: false })}
              className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface-container-low border border-tertiary-container/30 rounded-3xl p-8 z-[110] shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-tertiary-container/10 flex items-center justify-center text-tertiary-container mb-6 mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2 text-center">{showDeleteModal.type}</h3>
              <p className="text-sm text-on-surface-variant text-center mb-8">
                This action is irreversible. All associated data will be permanently removed from our servers.
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Type <span className="text-tertiary-container">DELETE</span> to confirm</label>
                  <input 
                    type="text" 
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    placeholder="DELETE"
                    className="w-full bg-surface-container-low border border-tertiary-container/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-tertiary-container transition-colors"
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowDeleteModal({ type: '', isOpen: false })}
                    className="flex-1 py-3 bg-surface-container text-on-surface rounded-xl font-bold text-sm hover:bg-surface-container-high transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={deleteConfirm !== 'DELETE'}
                    className="flex-1 py-3 bg-tertiary-container text-on-tertiary-container rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const XCircle: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
