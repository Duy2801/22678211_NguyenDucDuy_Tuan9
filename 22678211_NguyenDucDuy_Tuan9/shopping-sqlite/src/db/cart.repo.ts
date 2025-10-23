import { db } from './db';

export const getCart = () => {
    return db.getAllSync(`
    SELECT c.id, c.product_id, c.qty, p.name, p.price, p.stock
    FROM cart_items c
    JOIN products p ON p.product_id = c.product_id
  `);
};

export const addToCart = (product_id: string) => {
    const existing = db.getFirstSync(`SELECT * FROM cart_items WHERE product_id=?`, [product_id]) as { qty: number } | undefined;
    const product = db.getFirstSync(`SELECT * FROM products WHERE product_id=?`, [product_id]) as { stock: number } | undefined;

    if (!product) return;

    if (existing) {
        if (existing.qty < product.stock)
            db.runSync(`UPDATE cart_items SET qty = qty + 1 WHERE product_id=?`, [product_id]);
    } else {
        db.runSync(`INSERT INTO cart_items (product_id, qty) VALUES (?, 1)`, [product_id]);
    }
};

export const updateQty = (id: number, qty: number) => {
    if (qty > 0) db.runSync(`UPDATE cart_items SET qty=? WHERE id=?`, [qty, id]);
    else db.runSync(`DELETE FROM cart_items WHERE id=?`, [id]);
};

export function getCartItemById(productId: string) {
    const cart = getCart();
    return cart.find(item => item.product_id === productId);
}
export const deleteCartItem = (id: number) => {
    db.runSync(`DELETE FROM cart_items WHERE id=?`, [id]);
};

export const clearCart = () => db.runSync(`DELETE FROM cart_items`);
