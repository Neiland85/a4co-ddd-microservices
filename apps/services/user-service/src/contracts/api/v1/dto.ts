// API CONTRACTS - Version 1

export interface CreateUserRequestV1 {
  username: string;
  email: string;
}

export interface UpdateUserRequestV1 {
  username?: string;
  email?: string;
}

export interface GetUserRequestV1 {
  userId?: string;
  username?: string;
  email?: string;
}

export interface UserResponseV1 {
  userId: string;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
