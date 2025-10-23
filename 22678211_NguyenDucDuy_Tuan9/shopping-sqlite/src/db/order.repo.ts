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
