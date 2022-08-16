import { Store } from './store.model';
import { User } from './user';

export interface Admin {
  autorization: boolean;
  city: string;
  company: string;
  created: string;
  delete: false;
  displayType: string;
  email: string;
  employes: User[];
  firstName: string;
  lastName: string;
  lastRequest: string;
  maxemploye: number;
  multi_store: boolean;
  password: string;
  role: string;
  storeId: Store[];
  storeType: string[];
  telephone: number;
  userConnection: {};
  venderRole: false;
  vendor: [];
  _id: string;
}
