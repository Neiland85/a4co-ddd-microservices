export enum AccessAction {
  VIEW = 'VIEW',
  DOWNLOAD = 'DOWNLOAD',
  UPLOAD = 'UPLOAD',
  DELETE = 'DELETE',
  EXPORT = 'EXPORT',
}

export class AccessLog {
  constructor(
    public readonly id: string,
    public readonly resourceId: string,
    public readonly resourceType: string,
    public readonly userId: string,
    public readonly action: AccessAction,
    public readonly ipAddress: string | null,
    public readonly occurredAt: Date = new Date(),
  ) {
    if (!id || id.trim().length === 0) {
      throw new Error('AccessLog id cannot be empty');
    }
    if (!userId || userId.trim().length === 0) {
      throw new Error('userId cannot be empty');
    }
  }
}
