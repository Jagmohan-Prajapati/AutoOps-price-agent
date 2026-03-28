import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Zap, 
  Sparkles, 
  Activity, 
  ArrowRight, 
  Loader2,
  Bolt,
  Check,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const Signup: React.FC<{ onSignup: () => void; onGoToLogin: () => void }> = ({ onSignup, onGoToLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    // Simple password strength logic
    let strength = 0;
    if (password.length > 6) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  }, [password]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName) newErrors.fullName = 'Full name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!agreeToTerms) newErrors.terms = 'You must agree to the terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    onSignup();
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-10 bg-surface relative overflow-hidden">
      {/* Animated Background Decoration */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* Left Side: Marketing (60%) */}
      <div className="hidden lg:flex lg:col-span-6 flex-col justify-center p-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 primary-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Bolt className="w-7 h-7 text-on-primary-container fill-current" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-on-surface">AutoOps</span>
          </div>
          
          <h1 className="text-6xl font-black tracking-tighter text-on-surface mb-6 leading-[0.9]">
            Monitor. Analyze. <br />
            <span className="text-primary">Reprice.</span>
          </h1>
          
          <p className="text-lg text-on-surface-variant mb-12 leading-relaxed">
            AutoOps AI agents watch competitor prices 24/7 so your store stays ahead — automatically. Scale your retail intelligence without the manual grind.
          </p>

          <div className="space-y-6">
            {[
              { icon: Zap, text: "Live price tracking across Amazon, Flipkart & Myntra", color: "text-primary" },
              { icon: Sparkles, text: "AI-powered repricing recommendations", color: "text-secondary" },
              { icon: Activity, text: "Real-time agent activity dashboard", color: "text-tertiary-container" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-4 group"
              >
                <div className={cn("w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center transition-transform group-hover:scale-110", feature.color)}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-on-surface tracking-tight">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Side: Auth Card (40%) */}
      <div className="lg:col-span-4 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-surface-container-low/30 backdrop-blur-xl border border-outline-variant/10 rounded-[2rem] p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <Bolt className="w-6 h-6 text-primary fill-current" />
              <span className="text-xl font-black tracking-tighter text-on-surface">AutoOps</span>
            </div>
            <h2 className="text-2xl font-black text-on-surface tracking-tighter mb-1">Start for free</h2>
            <p className="text-xs text-on-surface-variant">Create your intelligence account today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className={cn(
                  "w-full bg-surface-container-low border rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none transition-all",
                  errors.fullName ? "border-tertiary-container focus:border-tertiary-container" : "border-outline-variant/20 focus:border-primary"
                )}
              />
              {errors.fullName && <p className="text-[10px] font-bold text-tertiary-container ml-1">{errors.fullName}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className={cn(
                  "w-full bg-surface-container-low border rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none transition-all",
                  errors.email ? "border-tertiary-container focus:border-tertiary-container" : "border-outline-variant/20 focus:border-primary"
                )}
              />
              {errors.email && <p className="text-[10px] font-bold text-tertiary-container ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    "w-full bg-surface-container-low border rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none transition-all pr-12",
                    errors.password ? "border-tertiary-container focus:border-tertiary-container" : "border-outline-variant/20 focus:border-primary"
                  )}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength Indicator */}
              <div className="flex gap-1 mt-1 px-1">
                {[25, 50, 75, 100].map((step) => (
                  <div 
                    key={step} 
                    className={cn(
                      "h-1 flex-1 rounded-full transition-all duration-500",
                      passwordStrength >= step 
                        ? (passwordStrength <= 50 ? "bg-tertiary-container" : passwordStrength <= 75 ? "bg-primary" : "bg-secondary")
                        : "bg-surface-container"
                    )}
                  />
                ))}
              </div>
              {errors.password && <p className="text-[10px] font-bold text-tertiary-container ml-1">{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={cn(
                  "w-full bg-surface-container-low border rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none transition-all",
                  errors.confirmPassword ? "border-tertiary-container focus:border-tertiary-container" : "border-outline-variant/20 focus:border-primary"
                )}
              />
              {errors.confirmPassword && <p className="text-[10px] font-bold text-tertiary-container ml-1">{errors.confirmPassword}</p>}
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center mt-0.5">
                  <input 
                    type="checkbox" 
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={cn(
                    "w-4 h-4 rounded border transition-all flex items-center justify-center",
                    agreeToTerms ? "bg-primary border-primary" : "bg-surface-container border-outline-variant/20 group-hover:border-primary/50"
                  )}>
                    {agreeToTerms && <Check className="w-3 h-3 text-on-primary" />}
                  </div>
                </div>
                <span className="text-[10px] text-on-surface-variant leading-tight">
                  I agree to the <button type="button" className="text-primary font-bold hover:underline">Terms of Service</button> and <button type="button" className="text-primary font-bold hover:underline">Privacy Policy</button>
                </span>
              </label>
              {errors.terms && <p className="text-[10px] font-bold text-tertiary-container mt-1 ml-7">{errors.terms}</p>}
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-4 primary-gradient text-on-primary-container rounded-xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/10"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-surface-container-low px-4 text-on-surface-variant">or</span></div>
          </div>

          <button className="w-full py-3.5 bg-transparent border border-outline-variant/20 rounded-xl font-bold text-sm text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l2.85 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center mt-8 text-xs text-on-surface-variant">
            Already have an account? <button onClick={onGoToLogin} className="font-bold text-primary hover:underline">Sign In</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
