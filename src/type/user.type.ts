
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
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
};

export type UserRole = UserProfile['role']; 
