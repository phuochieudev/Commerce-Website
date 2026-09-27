import { BaseEntity } from './common';

export interface UserAddress extends BaseEntity {
  userId: string;
  title: string;
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  isDefault: boolean;
}
