import { db } from './db';
import { Product } from '../models/types';

export const getAllProducts = (): Product[] => {
  return db.getAllSync<Product>('SELECT * FROM products');
};
