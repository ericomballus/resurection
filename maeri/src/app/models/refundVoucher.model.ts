import { Gamme } from './gamme.model';
import { Product } from './product.model';

export interface BonDeRemboursement {
  adminId: string;
  billId: string;
  created: string;
  toRemove: (Product | Gamme)[]; //les produits qui reviennent
  price: number;
  managerSend: boolean;
  posConfirm: boolean;
  customerId: string;
  storeId: string;
  reste: number;
  repaymentWithCash: boolean;
  repaymentWithOtherProducts: boolean;
  returnProduct: boolean;
  _id: string;
  openCashDateId: string;
}
