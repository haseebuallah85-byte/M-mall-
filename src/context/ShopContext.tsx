import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, OrderItem, CustomerInfo, PaymentMethod, Order, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

interface ShopContextType {
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => Product;
  updateProduct: (updated: Product) => void;
  deleteProduct: (id: string | number) => void;
  resetToDefaultProducts: () => void;

  cart: OrderItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string | number) => void;
  updateCartQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;
  deliveryFee: number;
  discountAmount: number;
  voucherCode: string;
  applyVoucher: (code: string) => { success: boolean; message: string };

  orders: Order[];
  placeOrder: (customer: CustomerInfo, paymentMethod: PaymentMethod, paymentRef?: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  activeTab: 'shop' | 'seller' | 'bioscience' | 'track';
  setActiveTab: (tab: 'shop' | 'seller' | 'bioscience' | 'track') => void;

  shopName: string;
  setShopName: (name: string) => void;
  shopTagline: string;
  setShopTagline: (tagline: string) => void;

  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (p: Product | null) => void;
  completedOrder: Order | null;
  setCompletedOrder: (o: Order | null) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = 'daraz_pk_products_v2';
const CART_STORAGE_KEY = 'daraz_pk_cart_v2';
const ORDERS_STORAGE_KEY = 'daraz_pk_orders_v2';
const SHOP_NAME_STORAGE_KEY = 'daraz_pk_shop_name_v2';
const SHOP_TAGLINE_STORAGE_KEY = 'daraz_pk_shop_tagline_v2';

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Customizable Shop Name ("New shop name rekhna")
  const [shopName, setShopNameState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(SHOP_NAME_STORAGE_KEY);
      if (saved) return saved;
    } catch (e) {
      console.warn('Storage error:', e);
    }
    return 'Mahaza Mall';
  });

  const [shopTagline, setShopTaglineState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(SHOP_TAGLINE_STORAGE_KEY);
      if (saved) return saved;
    } catch (e) {
      console.warn('Storage error:', e);
    }
    return 'Daraz.pk Verified Seller & Online Store';
  });

  const setShopName = (name: string) => {
    setShopNameState(name);
    try {
      localStorage.setItem(SHOP_NAME_STORAGE_KEY, name);
    } catch (e) {
      console.warn('Failed saving shop name', e);
    }
  };

  const setShopTagline = (tagline: string) => {
    setShopTaglineState(tagline);
    try {
      localStorage.setItem(SHOP_TAGLINE_STORAGE_KEY, tagline);
    } catch (e) {
      console.warn('Failed saving shop tagline', e);
    }
  };
  // Load products from localStorage or use INITIAL_PRODUCTS
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed reading products from storage', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Load cart
  const [cart, setCart] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed reading cart from storage', e);
    }
    return [];
  });

  // Load orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed reading orders from storage', e);
    }
    // Initial sample orders for seller preview
    return [
      {
        id: 'DZ-PK-89102',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        items: [
          {
            product: INITIAL_PRODUCTS[0],
            quantity: 1
          }
        ],
        customer: {
          fullName: 'Muhammad Usman Tariq',
          callPhone: '03001234567',
          whatsappNumber: '03001234567',
          province: 'Punjab',
          city: 'Lahore',
          area: 'Gulberg III, Block B',
          address: 'House # 42, Street 8, Near Ghalib Market',
          famousLandmark: 'Opposite Jamia Masjid Bilal, Gulberg 3',
          deliveryInstructions: 'Deliver after 3:00 PM please'
        },
        paymentMethod: 'cod',
        subtotal: 4000,
        deliveryFee: 0,
        discount: 0,
        total: 4000,
        status: 'Confirmed',
        trackingSteps: [
          { date: 'Order Placed', message: 'Order submitted by customer with Cash on Delivery', completed: true },
          { date: 'Seller Verification', message: 'Seller confirmed order via WhatsApp', completed: true },
          { date: 'Ready for Dispatch', message: 'Courier booking generated via Daraz Express Logistics', completed: false }
        ]
      }
    ];
  });

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'shop' | 'seller' | 'bioscience' | 'track'>('shop');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Voucher discount
  const [voucherCode, setVoucherCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Persist products
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [products]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [cart]);

  // Persist orders
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [orders]);

  // Add Product (Seller Feature: "product mein Dal sakun or sell bhi kar sko")
  const addProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviewsCount'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: Math.floor(7000000 + Math.random() * 900000),
      rating: 5.0,
      reviewsCount: 1,
      isDarazMall: productData.isDarazMall ?? false,
      freeDelivery: productData.freeDelivery ?? (productData.price >= 2500)
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProduct = (id: string | number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    removeFromCart(id);
  };

  const resetToDefaultProducts = () => {
    setProducts(INITIAL_PRODUCTS);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string | number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setVoucherCode('');
    setDiscountAmount(0);
  };

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  // Free delivery if subtotal >= 2500 PKR, else standard 199 PKR
  const deliveryFee = cartSubtotal > 0 && cartSubtotal < 2500 ? 199 : 0;

  const applyVoucher = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'DARAZ11' || clean === 'DARAZPK') {
      const discount = Math.min(500, Math.round(cartSubtotal * 0.15));
      setDiscountAmount(discount);
      setVoucherCode(clean);
      return { success: true, message: `Discount voucher ${clean} applied! You saved Rs. ${discount}` };
    } else if (clean === 'FREESHIP') {
      setVoucherCode(clean);
      setDiscountAmount(199);
      return { success: true, message: 'Free shipping voucher applied!' };
    }
    return { success: false, message: 'Invalid or expired voucher code. Try "DARAZ11"' };
  };

  // Place Order ("Si block order kar saken ... Jo order Karen unke do numberon se ek WhatsApp aur ek call number aur sari information Ho jaaiye adress mashhur jagah ka naam payment method")
  const placeOrder = (customer: CustomerInfo, paymentMethod: PaymentMethod, paymentRef?: string): Order => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderId = `DZ-PK-${randomDigits}`;
    const total = Math.max(0, cartSubtotal + deliveryFee - discountAmount);

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: [...cart],
      customer,
      paymentMethod,
      paymentRef,
      subtotal: cartSubtotal,
      deliveryFee,
      discount: discountAmount,
      total,
      status: 'Pending',
      trackingSteps: [
        {
          date: 'Order Placed',
          message: `Order #${orderId} received. Payment Method: ${paymentMethod.toUpperCase()}`,
          completed: true
        },
        {
          date: 'Phone & WhatsApp Verification',
          message: `Seller checking details for Call: ${customer.callPhone} & WhatsApp: ${customer.whatsappNumber}`,
          completed: false
        },
        {
          date: 'Dispatched to Hub',
          message: `Package booked for delivery near landmark: ${customer.famousLandmark}`,
          completed: false
        },
        {
          date: 'Out for Delivery',
          message: 'Rider on the way to your doorstep',
          completed: false
        },
        {
          date: 'Delivered',
          message: 'Order safely delivered',
          completed: false
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setCompletedOrder(newOrder);
    setIsCheckoutOpen(false);

    // Update stock levels for purchased items
    setProducts(prev =>
      prev.map(p => {
        const cartItem = cart.find(ci => ci.product.id === p.id);
        if (cartItem) {
          return {
            ...p,
            stock: Math.max(0, p.stock - cartItem.quantity)
          };
        }
        return p;
      })
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const updatedSteps = o.trackingSteps.map(step => {
            if (status === 'Confirmed' && step.date.includes('Verification')) return { ...step, completed: true };
            if (status === 'Dispatched' && (step.date.includes('Dispatched') || step.date.includes('Verification'))) return { ...step, completed: true };
            if (status === 'Out for Delivery' && !step.date.includes('Delivered')) return { ...step, completed: true };
            if (status === 'Delivered') return { ...step, completed: true };
            return step;
          });
          return { ...o, status, trackingSteps: updatedSteps };
        }
        return o;
      })
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToDefaultProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        deliveryFee,
        discountAmount,
        voucherCode,
        applyVoucher,
        orders,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        activeTab,
        setActiveTab,
        shopName,
        setShopName,
        shopTagline,
        setShopTagline,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProductForDetail,
        setSelectedProductForDetail,
        completedOrder,
        setCompletedOrder
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
