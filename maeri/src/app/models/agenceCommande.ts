import { Product } from './product.model';
import { productCart } from './productCart';

export interface AgenceCommande {
  avaible: Product;
  request: productCart;
  accept: number;
  reject: number;
}
