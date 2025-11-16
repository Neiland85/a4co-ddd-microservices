/**
 * Artisan Aggregate Root
 * Represents an artisan with their profile and business information
 */

import { ArtisanId } from '../value-objects/ArtisanId';
import { Email } from '../value-objects/Email';
import { Location } from '../value-objects/Location';
import { SocialMedia } from '../value-objects/SocialMedia';
import { ArtisanStatus } from '../value-objects/ArtisanStatus';

export class Artisan {
  private constructor(
    private readonly id: ArtisanId,
    private name: string,
    private bio: string,
    private specialty: string,
    private location: Location,
    private email: Email,
    private phone: string,
    private website: string | null,
    private social: SocialMedia,
    private avatar: string | null,
    private status: ArtisanStatus,
    private isFeatured: boolean,
    private isPublished: boolean,
    private readonly createdAt: Date,
    private updatedAt: Date
  ) {}

  static create(params: {
    id: string;
    name: string;
    email: string;
    specialty: string;
    province: string;
    city: string;
    phone: string;
  }): Artisan {
    return new Artisan(
      new ArtisanId(params.id),
      params.name,
      '',
      params.specialty,
      Location.create(params.province, params.city, ''),
      new Email(params.email),
      params.phone,
      null,
      SocialMedia.empty(),
      null,
      ArtisanStatus.PENDING,
      false,
      false,
      new Date(),
      new Date()
    );
  }

  static reconstitute(params: {
    id: string;
    name: string;
    bio: string;
    specialty: string;
    location: { province: string; city: string; address: string };
    email: string;
    phone: string;
    website: string | null;
    social: { facebook?: string; instagram?: string };
    avatar: string | null;
    status: string;
    isFeatured: boolean;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Artisan {
    return new Artisan(
      new ArtisanId(params.id),
      params.name,
      params.bio,
      params.specialty,
      Location.create(params.location.province, params.location.city, params.location.address),
      new Email(params.email),
      params.phone,
      params.website,
      SocialMedia.create(params.social.facebook, params.social.instagram),
      params.avatar,
      ArtisanStatus.fromString(params.status),
      params.isFeatured,
      params.isPublished,
      params.createdAt,
      params.updatedAt
    );
  }

  // Getters
  getId(): string {
    return this.id.value;
  }

  getName(): string {
    return this.name;
  }

  getBio(): string {
    return this.bio;
  }

  getSpecialty(): string {
    return this.specialty;
  }

  getLocation(): Location {
    return this.location;
  }

  getEmail(): string {
    return this.email.value;
  }

  getPhone(): string {
    return this.phone;
  }

  getWebsite(): string | null {
    return this.website;
  }

  getSocial(): SocialMedia {
    return this.social;
  }

  getAvatar(): string | null {
    return this.avatar;
  }

  getStatus(): ArtisanStatus {
    return this.status;
  }

  getIsFeatured(): boolean {
    return this.isFeatured;
  }

  getIsPublished(): boolean {
    return this.isPublished;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business Methods
  updateProfile(params: {
    name?: string;
    bio?: string;
    specialty?: string;
    phone?: string;
    website?: string | null;
    location?: { province: string; city: string; address: string };
    social?: { facebook?: string; instagram?: string };
  }): void {
    if (params.name) this.name = params.name;
    if (params.bio !== undefined) this.bio = params.bio;
    if (params.specialty) this.specialty = params.specialty;
    if (params.phone) this.phone = params.phone;
    if (params.website !== undefined) this.website = params.website;
    if (params.location) {
      this.location = Location.create(
        params.location.province,
        params.location.city,
        params.location.address
      );
    }
    if (params.social) {
      this.social = SocialMedia.create(params.social.facebook, params.social.instagram);
    }
    this.updatedAt = new Date();
  }

  updateAvatar(avatarUrl: string): void {
    this.avatar = avatarUrl;
    this.updatedAt = new Date();
  }

  publish(): void {
    if (this.status.isPending()) {
      throw new Error('Cannot publish a pending artisan. Must be approved first.');
    }
    if (this.status.isBlocked()) {
      throw new Error('Cannot publish a blocked artisan.');
    }
    this.isPublished = true;
    this.updatedAt = new Date();
  }

  unpublish(): void {
    this.isPublished = false;
    this.updatedAt = new Date();
  }

  approve(): void {
    if (!this.status.isPending()) {
      throw new Error('Only pending artisans can be approved.');
    }
    this.status = ArtisanStatus.APPROVED;
    this.updatedAt = new Date();
  }

  block(reason: string): void {
    this.status = ArtisanStatus.BLOCKED;
    this.isPublished = false;
    this.updatedAt = new Date();
    // In a real implementation, you'd store the reason in an audit log
  }

  feature(): void {
    this.isFeatured = true;
    this.updatedAt = new Date();
  }

  unfeature(): void {
    this.isFeatured = false;
    this.updatedAt = new Date();
  }

  toDTO(): Record<string, unknown> {
    return {
      id: this.id.value,
      name: this.name,
      bio: this.bio,
      specialty: this.specialty,
      location: {
        province: this.location.getProvince(),
        city: this.location.getCity(),
        address: this.location.getAddress(),
      },
      contact: {
        email: this.email.value,
        phone: this.phone,
        website: this.website,
      },
      social: {
        facebook: this.social.getFacebook(),
        instagram: this.social.getInstagram(),
      },
      avatar: this.avatar,
      status: this.status.toString(),
      isFeatured: this.isFeatured,
      isPublished: this.isPublished,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
