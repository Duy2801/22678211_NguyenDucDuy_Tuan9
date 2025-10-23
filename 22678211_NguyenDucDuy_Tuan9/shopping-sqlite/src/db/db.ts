import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('shopping.db');

export const initDb = () => {
  db.execSync(`
    -- Bảng sản phẩm
    CREATE TABLE IF NOT EXISTS products (
      product_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL CHECK(price >= 0),
      stock INTEGER NOT NULL CHECK(stock >= 0)
    );

    -- Giỏ hàng
    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      qty INTEGER NOT NULL CHECK(qty > 0),
      UNIQUE(product_id),
      FOREIGN KEY (product_id) REFERENCES products (product_id)
    );

    -- Đơn hàng
    CREATE TABLE IF NOT EXISTS orders (
      order_id TEXT PRIMARY KEY,
      order_date TEXT NOT NULL,
      total REAL NOT NULL CHECK(total >= 0)
    );

    -- Chi tiết đơn hàng
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK(quantity > 0),
      price REAL NOT NULL CHECK(price >= 0),
      FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products (product_id)
    );
  `);

  const count = db.getFirstSync<{ c: number }>('SELECT COUNT(*) as c FROM products')?.c ?? 0;

  if (count === 0) {
    db.execSync(`
      INSERT INTO products (product_id, name, price, stock)
      VALUES
        ('P001', 'Áo thun', 120000, 50),
        ('P002', 'Quần jean', 250000, 30),
        ('P003', 'Giày sneaker', 500000, 20);
    `);
  }
};
