# Remaining Frontend Fixes

## Dashboard.tsx Price Display Fix

The backend now enriches products with `latest_prices` object. Update the product table row to display these.

**File**: `frontend/src/pages/Dashboard.tsx`

**Find the section** (around line 140):
```tsx
<td className="px-6 py-4 text-sm text-on-surface-variant text-center">—</td>
<td className="px-6 py-4 text-sm text-on-surface-variant text-center">—</td>
<td className="px-6 py-4 text-sm text-on-surface-variant text-center">—</td>
```

**Replace with**:
```tsx
<td className="px-6 py-4 text-sm text-center">
  {product.latest_prices?.amazon ? (
    <span className="text-on-surface font-medium">₹{Number(product.latest_prices.amazon.price).toLocaleString()}</span>
  ) : (
    <span className="text-on-surface-variant">—</span>
  )}
</td>
<td className="px-6 py-4 text-sm text-center">
  {product.latest_prices?.flipkart ? (
    <span className="text-on-surface font-medium">₹{Number(product.latest_prices.flipkart.price).toLocaleString()}</span>
  ) : (
    <span className="text-on-surface-variant">—</span>
  )}
</td>
<td className="px-6 py-4 text-sm text-center">
  {product.latest_prices?.myntra ? (
    <span className="text-on-surface font-medium">₹{Number(product.latest_prices.myntra.price).toLocaleString()}</span>
  ) : (
    <span className="text-on-surface-variant">—</span>
  )}
</td>
```

---

## ScanConfig.tsx Mock Data Fix (Optional)

The ScanConfig page uses hardcoded mock products. Replace with real API fetch.

**File**: `frontend/src/pages/ScanConfig.tsx`

**Add** at top (with other imports):
```tsx
import { useEffect } from 'react';
import { getProducts } from '../lib/api';
```

**Add** state and useEffect:
```tsx
const [products, setProducts] = useState([]);

useEffect(() => {
  getProducts().then(setProducts).catch(console.error);
}, []);
```

**Replace** the hardcoded product array map with:
```tsx
{products.map((p: any, i: number) => (
  <div key={p.id} className="... existing classes ...">
    <input type="checkbox" ... defaultChecked={i <= 2} />
    <div className="...">
      <div className="...">{p.name}</div>
      <div className="...">SKU: {p.id.slice(0, 8)}</div>
      <span className="...">Active Inventory</span>
    </div>
  </div>
))}
```

This fix is **lower priority** for the demo video.
