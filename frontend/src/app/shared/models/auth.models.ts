export interface AppUser {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface DirectoryUser {
  id: number;
  name: string;
  email: string;
  avatar_url?: string | null;
}

export interface AuthMeResponse {
  user: AppUser;
  users: DirectoryUser[];
}
