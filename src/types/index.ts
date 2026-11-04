export type CategoryType = 
  | 'All'
  | 'Electronics'
  | 'Men\'s Fashion'
  | 'Women\'s Fashion'
  | 'Shoes & Bags'
  | 'Bioscience & Lab Supplies'
  | 'Health & Beauty'
  | 'Home & Lifestyle';

export interface Product {
  id: string | number;
  name: string;
  price: number; // In PKR
  originalPrice?: number;
  category: CategoryType | string;
  subcategory?: string;
  image: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  brand?: string;
  sku?: string;
  description: string;
  specifications?: Record<string, string>;
  isBioscience?: boolean;
  pubchemCid?: number;
  molecularFormula?: string;
  isDarazMall?: boolean;
  freeDelivery?: boolean;
  sellerName?: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface CustomerInfo {
  fullName: string;
  callPhone: string; // Calling number
  whatsappNumber: string; // WhatsApp number
  province: string;
  city: string;
  area: string; // Sector/Mohalla/Area
  address: string; // House & Street
  famousLandmark: string; // Mashhur jagah ka naam
  deliveryInstructions?: string;
}

export type PaymentMethod = 
  | 'cod' 
  | 'easypaisa' 
  | 'jazzcash' 
  | 'bank_transfer' 
  | 'card';

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Dispatched' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled';

export interface TrackingStep {
  date: string;
  message: string;
  completed: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  customer: CustomerInfo;
  paymentMethod: PaymentMethod;
  paymentRef?: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  trackingSteps: TrackingStep[];
}

export interface CompoundDetail {
  cid: number;
  name: string;
  iupacName: string;
  molecularFormula: string;
  molecularWeight: string;
  canonicalSmiles: string;
  imageUrl: string;
  description?: string;
  safetySummary?: string;
  suggestedPricePkr?: number;
}
