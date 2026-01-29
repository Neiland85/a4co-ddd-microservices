import { v4 as uuidv4 } from 'uuid';

export type BaseEntityProps = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export abstract class BaseEntity {
  public readonly id: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props?: string | BaseEntityProps) {
    if (typeof props === 'string' || typeof props === 'undefined') {
      this.id = props || uuidv4();
      this.createdAt = new Date();
      this.updatedAt = new Date();
      return;
    }

    this.id = props.id ?? uuidv4();
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public equals(entity: BaseEntity): boolean {
    return this.id === entity.id;
  }

  protected touch(): void {
    this.updatedAt = new Date();
  }
}
