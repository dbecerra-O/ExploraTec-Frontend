export type User = {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  username: string;
  password: string;
};
