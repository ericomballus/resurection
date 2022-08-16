export class Invoice {
  adminId: string;
  commande: any;
  commandes: [];
  ristourneProd: [];
  created: string;
  confirm: boolean;
  Posconfirm: boolean;
  products: Object;
  sale: boolean;
  userName: string;
  custumerName: string;
  custumerPhone: string;
  tableNumber: number;
  validUntil: string;
  openCashDate: string;
  openCashDateId: string;
  avance: number;
  reste: number;
  invoiceCancel: boolean;
  onAccount: boolean;
  partially: boolean;
  cash: boolean;
  isRetailer: boolean;
  scConfirm: boolean;
  swConfirm: boolean;
  saConfirm: boolean;
  caisseConfirm: boolean;
  returnProduct: boolean;
  phoneNumber?: number;
  motif: string;
  numFacture: Number;
  localId: string;
  senderId: string;
  resourceList: [];
  storeId: string;
  customerId: string;
  trancheList: [];
  delivered: boolean;
  purchaseOrder: any[]; //bon de commande
  refundVoucher: any[]; //bon de remboursement
  paiment_type: string;
  customer?: any;
  _id?: string;
  montant?: 0;
  montantReduction?: 0;
  constructor() {}
}
