export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
};

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  username?: string;
  role: string;
  avatarUrl: string;
  cccdImageUrl?: string;
  phone: string;
  address: string;
  cardId: string;
  gender?: string;
  age?: number;
  url?: string;
};

export type UserRole = UserProfile["role"];
