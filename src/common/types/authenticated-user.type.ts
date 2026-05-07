export type AuthenticatedUser = {
  id: string;
  email: string;
  role: 'CUSTOMER' | 'SUPER_ADMIN';
  storeId?: string;
  storeRole?: 'STORE_ADMIN';
};
