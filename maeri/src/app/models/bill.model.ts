import { Commande } from './commade.model';

export interface Bill {
  adminId: string;
  cancel: boolean;
  commandes: Commande[];
  created: string;
  customer: null;
  customerId: string;
  invoicesId: string;
  localId: string;
  montant: number;
  numFacture: number;
  openCashDate: string;
  openCashDateId: string;
  purchaseOrder: any[];
  refundVoucher: any[];
  invoices: any[];
  reimbursed: number;
  rembourse: number;
  storeId: string;
  trancheList: any[];
  userName: string;
  partiallyCancel: boolean;
  delivery: boolean;
  confirmPaie: boolean;
  purchaseOrderConfirm: boolean;
  __v: 0;
  _id: string;
  invoiceCancel: boolean;
  totalCancel: boolean;
  montantReduction: number;
  employeId: string;
  paiment_type: string;
  caisseConfirm?: boolean;
  phoneNumber?: number;
}
