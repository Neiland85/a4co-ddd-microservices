import { AggregateRoot } from '../base-classes.js';

export class Transportista extends AggregateRoot {
  private _name: string;
  private _email: string;
  private _phone: string;
  private _serviceAreas: string[];
  private _totalShipments: number;
  private _successfulShipments: number;
  private _averageDeliveryTime: number | null;
  private _rating: number;
  private _isActive: boolean;

  constructor(
    id: string,
    name: string,
    email: string,
    phone: string,
    serviceAreas: string[],
    totalShipments: number = 0,
    successfulShipments: number = 0,
    averageDeliveryTime: number | null = null,
    rating: number = 5.0,
    isActive: boolean = true,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this._name = name;
    this._email = email;
    this._phone = phone;
    this._serviceAreas = serviceAreas;
    this._totalShipments = totalShipments;
    this._successfulShipments = successfulShipments;
    this._averageDeliveryTime = averageDeliveryTime;
    this._rating = rating;
    this._isActive = isActive;
  }

  // Getters
  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get phone(): string {
    return this._phone;
  }

  get serviceAreas(): string[] {
    return [...this._serviceAreas];
  }

  get totalShipments(): number {
    return this._totalShipments;
  }

  get successfulShipments(): number {
    return this._successfulShipments;
  }

  get averageDeliveryTime(): number | null {
    return this._averageDeliveryTime;
  }

  get rating(): number {
    return this._rating;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  // Business methods

  /**
   * Increment the total shipments count
   */
  incrementShipments(): void {
    this._totalShipments++;
    this.touch();
  }

  /**
   * Record a successful shipment and update metrics
   */
  recordSuccessfulShipment(deliveryTimeHours: number): void {
    this._successfulShipments++;
    this._totalShipments++;

    // Update average delivery time
    if (this._averageDeliveryTime === null) {
      this._averageDeliveryTime = deliveryTimeHours;
    } else {
      this._averageDeliveryTime =
        (this._averageDeliveryTime * (this._successfulShipments - 1) +
          deliveryTimeHours) /
        this._successfulShipments;
    }

    this.touch();
  }

  /**
   * Update rating (0-5)
   */
  updateRating(newRating: number): void {
    if (newRating < 0 || newRating > 5) {
      throw new Error('Rating must be between 0 and 5');
    }
    this._rating = newRating;
    this.touch();
  }

  /**
   * Activate transportista
   */
  activate(): void {
    this._isActive = true;
    this.touch();
  }

  /**
   * Deactivate transportista
   */
  deactivate(): void {
    this._isActive = false;
    this.touch();
  }

  /**
   * Check if transportista serves a specific area
   */
  servesArea(area: string): boolean {
    return this._serviceAreas.includes(area);
  }

  /**
   * Add a service area
   */
  addServiceArea(area: string): void {
    if (!this._serviceAreas.includes(area)) {
      this._serviceAreas.push(area);
      this.touch();
    }
  }

  /**
   * Remove a service area
   */
  removeServiceArea(area: string): void {
    const index = this._serviceAreas.indexOf(area);
    if (index > -1) {
      this._serviceAreas.splice(index, 1);
      this.touch();
    }
  }

  /**
   * Get success rate as percentage
   */
  getSuccessRate(): number {
    if (this._totalShipments === 0) {
      return 100; // New transportista
    }
    return (this._successfulShipments / this._totalShipments) * 100;
  }
}
