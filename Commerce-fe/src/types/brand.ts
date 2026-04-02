import { BaseEntity } from './common';

export interface Brand extends BaseEntity {
  name: string;
  image?: string;
  description?: string;
  tagLine?: string;
}
