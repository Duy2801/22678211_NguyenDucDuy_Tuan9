export interface Product {
    product_id: string;
    name: string;
    price: number;
    stock: number;
  }
  
  export interface CartItem {
    id: number;
    product_id: string;
    qty: number;
  }

  export interface Order {
    order_id: number;
    order_date: string;
    total: number;
  }

  export interface OrderItem {
    id: number;
    order_id: number;
    product_id: string;
    qty: number;
    price: number;
    name: string;
  }
  
  