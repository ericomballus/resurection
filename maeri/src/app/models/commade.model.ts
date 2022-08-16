import { Panier } from './panier.model';

export interface Commande {
  cartdetails: {
    items: {};
    totalQty: number;
    totalPrice: number;
    totalPriceRandom: number;
  };
  localId: string;
  montantRecu: number;
  products: Panier[];
  reste: number;
  storeId: string;
  trancheList: any[];
}
