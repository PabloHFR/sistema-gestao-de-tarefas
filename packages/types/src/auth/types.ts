export interface UserResponse {
  id: string;
  email: string;
  username: string;
}

export interface TokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends TokensResponse {
  user: UserResponse;
}

export interface RefreshResponse extends TokensResponse {}

export interface LogoutResponse {
  message: string;
}

export interface ValidateUserResponse extends UserResponse {}
