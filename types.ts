export type UserRole = 'admin' | 'user' | 'guest' | 'ai';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  isOnline?: boolean;
  friendIds: string[];
  blockedIds: string[];
}

export interface Group {
  id: string;
  name: string;
  avatar: string;
  memberIds: string[];
  adminId: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  timestamp: number;
  user: User;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  images?: string[];
  likes: number;
  timestamp: number;
  type: 'admin' | 'user'; // Admin posts (Home) vs User posts (Forum)
  user: User;
  commentsCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string; // Can be UserId or GroupId
  content: string;
  timestamp: number;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'error' | 'success' | 'warning';
}