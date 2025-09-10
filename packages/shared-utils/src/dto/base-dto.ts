export abstract class BaseDto {
  public toJSON(): Record<string, any> {
    return JSON.parse(JSON.stringify(this));
  }

  public static fromJSON<T extends BaseDto>(this: new () => T, json: Record<string, any>): T {
    const instance = new this();
    Object.assign(instance, json);
    return instance;
  }
}
