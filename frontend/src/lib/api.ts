const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Products
export async function getProducts() {
  const res = await fetch(`${BASE_URL}/api/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function createProduct(data: {
  name: string;
  category?: string;
  your_price: number;
  target_margin?: number;
  amazon_search_query?: string;
  flipkart_search_query?: string;
  myntra_search_query?: string;
}) {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function getProductHistory(productId: string) {
  const res = await fetch(`${BASE_URL}/api/products/${productId}/history`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

// Alerts
export async function getAlerts() {
  const res = await fetch(`${BASE_URL}/api/alerts`);
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}

// Scans
export async function triggerScan(productIds: string[], platforms: string[]) {
  const res = await fetch(`${BASE_URL}/api/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_ids: productIds, platforms }),
  });
  if (!res.ok) throw new Error('Failed to trigger scan');
  return res.json(); // { scan_id, status }
}

export async function getScanHistory() {
  const res = await fetch(`${BASE_URL}/api/scans`);
  if (!res.ok) throw new Error('Failed to fetch scan history');
  return res.json();
}

export async function getScanDetail(scanId: string) {
  const res = await fetch(`${BASE_URL}/api/scans/${scanId}`);
  if (!res.ok) throw new Error('Failed to fetch scan detail');
  return res.json();
}

// SSE Stream
export function createScanStream(scanId: string, onEvent: (event: any) => void) {
  const es = new EventSource(`${BASE_URL}/api/stream?scan_id=${scanId}`);
  es.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      onEvent(data);
    } catch {}
  };
  es.onerror = () => es.close();
  return es; // call es.close() to stop
}