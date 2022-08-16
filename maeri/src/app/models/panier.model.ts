import { Product } from './product.model';

export interface Panier {
  item: Product;
  price: number;
  qty: number;
}
