import { Product } from './product.model';

export interface FichePointage {
  _id: string;
  list: any[];
  open: boolean;
  adminId: string;
  storeId: string;
  created: string;
}
