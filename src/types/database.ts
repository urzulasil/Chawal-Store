export type Product = {
  id: string;
  name: string;
  slug: string;
  price_per_kg: number;
  image_url: string;
  created_at: string;
};

export type CartItem = {
  product_id: string;
  name: string;
  price: number;
  quantity?: number;
};

export type OrderStatus = 'pending' | 'payment_submitted' | 'verified' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  user_id: string;
  items: CartItem[];
  total_amount: number;
  status: OrderStatus;
  shipping_address: string;
  phone: string;
  payment_method: string;
  payment_screenshot_url: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};
