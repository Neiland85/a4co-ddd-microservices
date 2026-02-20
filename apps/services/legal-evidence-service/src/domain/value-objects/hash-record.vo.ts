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
  }
}
