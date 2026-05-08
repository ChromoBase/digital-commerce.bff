export interface PublicUser {
  id: string;
  email: string;
  name: string | null;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerInput {
  email: string;
  password: string;
  name?: string;
}
