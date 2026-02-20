export interface HashRecordProps {
  id: string;
  hash: string;
  timestamp: string;
}

export class HashRecord {
  readonly id: string;
  readonly hash: string;
  readonly timestamp: string;

  constructor(props: HashRecordProps) {
    this.id = props.id;
    this.hash = props.hash;
    this.timestamp = props.timestamp;
  }

  equals(other: HashRecord): boolean {
    return this.id === other.id && this.hash === other.hash && this.timestamp === other.timestamp;
import { ValueObject } from '../base-classes.js';

export type HashAlgorithm = 'SHA-256' | 'SHA-512' | 'MD5';

export interface HashRecordProps {
  algorithm: HashAlgorithm;
  value: string;
  computedAt: Date;
}

export class HashRecord extends ValueObject<HashRecordProps> {
  constructor(algorithm: HashAlgorithm, value: string, computedAt: Date = new Date()) {
    if (!value || value.trim().length === 0) {
      throw new Error('Hash value cannot be empty');
    }
    super({ algorithm, value, computedAt });
  }

  get algorithm(): HashAlgorithm {
    return this._value.algorithm;
  }

  get hashValue(): string {
    return this._value.value;
  }

  get computedAt(): Date {
    return this._value.computedAt;
  }

  verify(other: HashRecord): boolean {
    return this._value.algorithm === other.algorithm && this._value.value === other.hashValue;
  }

  toString(): string {
    return `${this._value.algorithm}:${this._value.value}`;
  }
}
