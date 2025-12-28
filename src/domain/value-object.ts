export abstract class ValueObject<T = any> {
  constructor(public readonly value: T) {}
}

