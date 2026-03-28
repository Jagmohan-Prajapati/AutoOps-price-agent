export type Page = 'dashboard' | 'products' | 'scan' | 'history' | 'settings' | 'product-detail' | 'login' | 'signup' | 'profile';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  yourPrice: number;
  marketAvg: number;
  platforms: {
    amazon: number;
    flipkart: number;
    myntra: number;
  };
  gap: number;
  recommendation: 'Lower Price' | 'You\'re Cheapest' | 'Match Price';
  status: 'In Stock' | 'Out of Stock' | 'Stock Low';
  lastScanned: string;
  image: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface ScanRun {
  id: string;
  dateTime: string;
  productsScanned: number;
  platforms: string[];
  duration: string;
  alertsFound: number;
  status: 'Completed' | 'Failed' | 'In Progress';
  startTime: string;
  endTime: string;
  productBreakdown: ScanProductBreakdown[];
  logs: ActivityLog[];
}

export interface ScanProductBreakdown {
  id: string;
  name: string;
  amazonPrice: number;
  flipkartPrice: number;
  myntraPrice: number;
  alertTriggered: boolean;
}

export interface Alert {
  id: string;
  productName: string;
  time: string;
  type: 'price_drop' | 'stock_low' | 'competitor';
  message: string;
  platform?: string;
  value?: string;
}
