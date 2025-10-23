import { db } from './db';
import { getCart, clearCart } from './cart.repo';

export const checkout = async () => {
  const cartItems = await getCart();
  if (cartItems.length === 0) return false;

  const total = cartItems.reduce((sum, i) => sum + i.qty * i.price, 0);
  const date = new Date().toISOString();

  await db.runAsync('INSERT INTO orders(order_date, total) VALUES (?, ?)', [date, total]);
  const order = await db.getFirstAsync<{ order_id: number }>('SELECT last_insert_rowid() as order_id');
  const orderId = order?.order_id;

  for (const item of cartItems) {
    await db.runAsync(
      'INSERT INTO order_items(order_id, product_id, qty, price) VALUES (?, ?, ?, ?)',
      [orderId, item.product_id, item.qty, item.price]
    );
    await db.runAsync(
      'UPDATE products SET stock = stock - ? WHERE product_id = ?',
      [item.qty, item.product_id]
    );
  }

  await clearCart();
  return true;
};

// Lấy danh sách tất cả đơn hàng
export const getAllOrders = async () => {
  const orders = await db.getAllAsync<{
    order_id: number;
    order_date: string;
    total: number;
  }>('SELECT * FROM orders ORDER BY order_date DESC');
  return orders;
};

// Lấy chi tiết đơn hàng theo order_id
export const getOrderDetails = async (orderId: number) => {
  const items = await db.getAllAsync<{
    id: number;
    order_id: number;
    product_id: string;
    qty: number;
    price: number;
    name: string;
  }>(
    `SELECT oi.*, p.name 
     FROM order_items oi
     JOIN products p ON oi.product_id = p.product_id
     WHERE oi.order_id = ?`,
    [orderId]
  );
  return items;
};
