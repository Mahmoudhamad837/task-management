export interface AuthUser {
  id: string;
  name: string;
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}