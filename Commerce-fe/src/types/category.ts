import { BaseEntity } from './common';

export interface Category extends BaseEntity {
  name: string;
  image?: string;
  description?: string;
  parentId?: string;
}
