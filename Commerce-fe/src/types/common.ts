export enum ModelStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export interface BaseEntity {
  id: string;
  status: ModelStatus;
  createdAt: Date;
  updatedAt: Date;
}
