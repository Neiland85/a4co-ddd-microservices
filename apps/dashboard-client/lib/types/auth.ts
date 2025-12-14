export interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export interface LoginRequest {
  email?: string;
  username?: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user: User;
  expiresIn?: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  access_token: string;
  user: User;
}

export interface AuthError {
  message: string;
  statusCode?: number;
  error?: string;
}
