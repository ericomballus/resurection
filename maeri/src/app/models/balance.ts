export interface Balance {
  customerId: string;
  created: string;
  recharge: boolean;
  withdrawal: boolean; //retrait d'argent
  amountRecharge: number;
  amount: number; //solde du client
  _id: string;
  amountWithdrawal: number;
}
