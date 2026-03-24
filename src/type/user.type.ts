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
    avatarUrl?: string;
    avatar?: string;
    phone: string;
    address: string;
    gender?: string;
    cardId: string;
    age?: number;
};

export type UserRole = UserProfile["role"];
