export class SKU {
  constructor(public readonly value: string) {}
}

export class Slug {
  constructor(public readonly value: string) {}

  static create(value: string): Slug {
    return new Slug(value);
  }

  static generateFromName(name: string): Slug {
    return new Slug(
      name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, ''),
    );
  }
}
