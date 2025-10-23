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
  
  