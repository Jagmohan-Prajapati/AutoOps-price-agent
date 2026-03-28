import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  CreditCard, 
  LogOut, 
  Camera, 
  CheckCircle2, 
  Smartphone, 
  Monitor, 
  History, 
  Download,
  ChevronRight,
  Plus,
  ArrowUpRight,
  Lock,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

type Tab = 'personal' | 'security' | 'billing';

const usageData = [
  { name: 'Week 1', calls: 85 },
  { name: 'Week 2', calls: 120 },
  { name: 'Week 3', calls: 95 },
  { name: 'Week 4', calls: 40 },
];

export const Profile: React.FC<{ onSignOut: () => void }> = ({ onSignOut }) => {
  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const [showPassword, setShowPassword] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const stats = [
    { label: 'Products Tracked', value: 12 },
    { label: 'Total Scans Run', value: 47 },
    { label: 'Alerts Received', value: 23 },
  ];

  const sessions = [
    { device: 'MacBook Pro 16"', location: 'Mumbai, India', lastActive: 'Active now', icon: Monitor },
    { device: 'iPhone 15 Pro', location: 'Mumbai, India', lastActive: '2 hours ago', icon: Smartphone },
    { device: 'Windows Desktop', location: 'Delhi, India', lastActive: 'Yesterday', icon: Monitor },
  ];

  const paymentHistory = [
    { date: 'Mar 01, 2026', amount: '₹0', plan: 'Free Plan', status: 'Paid' },
    { date: 'Feb 01, 2026', amount: '₹0', plan: 'Free Plan', status: 'Paid' },
    { date: 'Jan 01, 2026', amount: '₹0', plan: 'Free Plan', status: 'Paid' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar Card */}
        <div className="lg:col-span-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 flex flex-col items-center text-center sticky top-24"
          >
            <div className="relative group">
              <div className="w-32 h-32 rounded-full primary-gradient flex items-center justify-center text-4xl font-black text-on-primary-container shadow-2xl shadow-primary/20">
                JP
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-surface-container-high rounded-full border border-outline-variant/20 flex items-center justify-center text-primary hover:scale-110 transition-transform shadow-lg">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-black text-on-surface tracking-tighter">Jagmohan Prajapati</h2>
              <p className="text-sm text-on-surface-variant flex items-center justify-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5" />
                jagmohanprajapat003@gmail.com
              </p>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">
                Store Owner
              </span>
              <span className="px-3 py-1 bg-surface-container text-on-surface-variant text-[10px] font-bold uppercase tracking-widest rounded-full border border-outline-variant/10">
                Member since March 2026
              </span>
            </div>

            <div className="w-full h-px bg-outline-variant/10 my-8"></div>

            <div className="w-full grid grid-cols-1 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-surface-container-low/50 rounded-xl border border-outline-variant/5">
                  <span className="text-xs text-on-surface-variant font-medium">{stat.label}</span>
                  <span className="text-sm font-black text-primary">{stat.value}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={onSignOut}
              className="w-full mt-8 py-3 border border-tertiary-container/30 text-tertiary-container rounded-xl text-sm font-bold hover:bg-tertiary-container/5 transition-colors flex items-center justify-center gap-2 group"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </motion.div>
        </div>

        {/* Right Main Content */}
        <div className="lg:col-span-8">
          <div className="glass-card overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-outline-variant/10 px-4">
              {[
                { id: 'personal', label: 'Personal Info', icon: User },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative",
                    activeTab === tab.id ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'personal' && (
                  <motion.div
                    key="personal"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
                        <input type="text" defaultValue="Jagmohan Prajapati" className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:border-primary outline-none transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
                        <div className="relative">
                          <input type="email" defaultValue="jagmohanprajapat003@gmail.com" className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:border-primary outline-none transition-all pr-24" />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 bg-secondary/10 text-secondary rounded text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Phone Number</label>
                        <input type="tel" defaultValue="+91 98765 43210" className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:border-primary outline-none transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Location</label>
                        <input type="text" defaultValue="Mumbai, India" className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:border-primary outline-none transition-all" />
                      </div>
                    </div>

                    <button className="primary-gradient text-on-primary-container px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                      Update Profile
                    </button>

                    <div className="pt-8 border-t border-outline-variant/10">
                      <h3 className="text-sm font-bold text-on-surface mb-4">Connected Accounts</h3>
                      <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27z" fill="#FBBC05"/>
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l2.85 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">Google Account</p>
                            <p className="text-xs text-secondary">Connected as jagmohanprajapat003@gmail.com</p>
                          </div>
                        </div>
                        <button className="text-xs font-bold text-tertiary-container hover:underline">Disconnect</button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="space-y-6">
                      <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                        <Lock className="w-4 h-4 text-primary" />
                        Change Password
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Current Password</label>
                          <input type="password" placeholder="••••••••" className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:border-primary outline-none transition-all" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">New Password</label>
                          <div className="relative">
                            <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:border-primary outline-none transition-all pr-12" />
                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          <div className="flex gap-1 mt-2">
                            <div className="h-1 flex-1 rounded-full bg-primary"></div>
                            <div className="h-1 flex-1 rounded-full bg-primary"></div>
                            <div className="h-1 flex-1 rounded-full bg-surface-container"></div>
                            <div className="h-1 flex-1 rounded-full bg-surface-container"></div>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Confirm New Password</label>
                          <input type="password" placeholder="••••••••" className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:border-primary outline-none transition-all" />
                        </div>
                      </div>
                      <button className="primary-gradient text-on-primary-container px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        Update Password
                      </button>
                    </div>

                    <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                            <Shield className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-on-surface">Two-Factor Authentication</h3>
                            <p className="text-xs text-on-surface-variant">Add an extra layer of security to your account</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                          className={cn(
                            "w-12 h-6 rounded-full transition-all relative",
                            is2FAEnabled ? "bg-secondary" : "bg-surface-container-high"
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                            is2FAEnabled ? "left-7" : "left-1"
                          )} />
                        </button>
                      </div>

                      {is2FAEnabled && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="flex flex-col md:flex-row items-center gap-8 pt-6 border-t border-outline-variant/10"
                        >
                          <div className="w-32 h-32 bg-white p-2 rounded-xl">
                            <div className="w-full h-full bg-surface-container flex items-center justify-center text-on-surface-variant text-[10px] font-bold text-center">
                              QR CODE<br/>PLACEHOLDER
                            </div>
                          </div>
                          <div className="space-y-3 flex-1">
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                              Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.) to enable 2FA.
                            </p>
                            <div className="flex gap-2">
                              <input type="text" placeholder="Enter 6-digit code" className="bg-surface-container border border-outline-variant/20 rounded-lg px-3 py-2 text-xs text-on-surface outline-none focus:border-secondary w-32" />
                              <button className="bg-secondary text-on-secondary-container px-4 py-2 rounded-lg text-xs font-bold">Verify</button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-on-surface">Active Sessions</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-outline-variant/10">
                              <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Device</th>
                              <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Location</th>
                              <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Last Active</th>
                              <th className="pb-4 text-right text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-outline-variant/5">
                            {sessions.map((session, i) => (
                              <tr key={i} className="group">
                                <td className="py-4">
                                  <div className="flex items-center gap-3">
                                    <session.icon className="w-4 h-4 text-on-surface-variant" />
                                    <span className="text-xs font-bold text-on-surface">{session.device}</span>
                                  </div>
                                </td>
                                <td className="py-4 text-xs text-on-surface-variant">{session.location}</td>
                                <td className="py-4">
                                  <span className={cn(
                                    "text-[10px] font-bold px-2 py-0.5 rounded",
                                    session.lastActive === 'Active now' ? "bg-secondary/10 text-secondary" : "bg-surface-container text-on-surface-variant"
                                  )}>
                                    {session.lastActive}
                                  </span>
                                </td>
                                <td className="py-4 text-right">
                                  <button className="text-[10px] font-bold text-tertiary-container hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Revoke</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'billing' && (
                  <motion.div
                    key="billing"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Current Plan */}
                      <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                          <span className="px-2 py-1 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest rounded">Current</span>
                        </div>
                        <h3 className="text-xl font-black text-on-surface tracking-tighter mb-1">Free Plan</h3>
                        <p className="text-xs text-on-surface-variant mb-6">Perfect for small stores starting out</p>
                        <ul className="space-y-3">
                          {['Up to 20 products', '100 scans per month', 'Basic email alerts', 'Standard support'].map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-on-surface-variant">
                              <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Upgrade CTA */}
                      <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20 relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all"></div>
                        <h3 className="text-xl font-black text-primary tracking-tighter mb-1">Pro Plan</h3>
                        <p className="text-xs text-on-surface-variant mb-6">₹999 <span className="text-[10px]">/ month</span></p>
                        <ul className="space-y-3 mb-8">
                          {['Unlimited products', 'Unlimited scans', 'Real-time SMS alerts', 'Priority 24/7 support', 'Advanced AI insights'].map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-on-surface">
                              <Sparkles className="w-3.5 h-3.5 text-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <button className="w-full py-3 primary-gradient text-on-primary-container rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                          Upgrade Now
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Usage Stats */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-on-surface">Usage Stats</h3>
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Resets in 12 days</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { label: 'API Calls', current: 340, max: 500, color: 'bg-primary' },
                          { label: 'Products Tracked', current: 12, max: 20, color: 'bg-secondary' },
                          { label: 'Scans this month', current: 47, max: 100, color: 'bg-tertiary-container' },
                        ].map((usage, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                              <span>{usage.label}</span>
                              <span>{usage.current} / {usage.max}</span>
                            </div>
                            <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(usage.current / usage.max) * 100}%` }}
                                className={cn("h-full rounded-full", usage.color)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Recharts Visualization */}
                      <div className="h-64 w-full bg-surface-container-low rounded-2xl border border-outline-variant/10 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">API Activity (Last 4 Weeks)</p>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={usageData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                            <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#9ca3af', fontSize: 10 }} 
                              dy={10}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#9ca3af', fontSize: 10 }}
                            />
                            <Tooltip 
                              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                              contentStyle={{ 
                                backgroundColor: '#111827', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                fontSize: '12px'
                              }}
                            />
                            <Bar dataKey="calls" radius={[4, 4, 0, 0]} barSize={40}>
                              {usageData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 3 ? '#3b82f6' : '#1f2937'} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Payment History */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-on-surface">Payment History</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-outline-variant/10">
                              <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Date</th>
                              <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Amount</th>
                              <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Plan</th>
                              <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
                              <th className="pb-4 text-right text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Invoice</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-outline-variant/5">
                            {paymentHistory.map((payment, i) => (
                              <tr key={i}>
                                <td className="py-4 text-xs text-on-surface">{payment.date}</td>
                                <td className="py-4 text-xs font-bold text-on-surface">{payment.amount}</td>
                                <td className="py-4 text-xs text-on-surface-variant">{payment.plan}</td>
                                <td className="py-4">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary/10 text-secondary">
                                    {payment.status}
                                  </span>
                                </td>
                                <td className="py-4 text-right">
                                  <button className="p-2 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant hover:text-primary">
                                    <Download className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
