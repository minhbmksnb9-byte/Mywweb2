import { User, Post, Message } from './types';

export const AI_BOT: User = {
  id: 'ai-natch',
  name: 'Natch(minhbmksnb9)',
  email: 'ai@binhminhwl.com',
  avatar: 'https://ui-avatars.com/api/?name=AI&background=0D8ABC&color=fff',
  role: 'ai',
  isOnline: true,
  friendIds: [],
  blockedIds: []
};

export const MOCK_ADMIN: User = {
  id: 'admin-1',
  name: 'BinhMinhWL Admin',
  email: 'admin123@gmail.com',
  avatar: 'https://picsum.photos/seed/admin/200/200',
  role: 'admin',
  isOnline: true,
  friendIds: ['user-1', 'user-2', 'user-3'],
  blockedIds: []
};

export const MOCK_USER: User = {
  id: 'user-1',
  name: 'Alex Developer',
  email: 'alex@nexus.com',
  avatar: 'https://picsum.photos/seed/alex/200/200',
  role: 'user',
  isOnline: true,
  friendIds: ['admin-1'],
  blockedIds: []
};

export const MOCK_USERS: User[] = [
  MOCK_ADMIN,
  MOCK_USER,
  {
    id: 'user-2',
    name: 'Sarah Designer',
    email: 'sarah@nexus.com',
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    role: 'user',
    isOnline: false,
    friendIds: ['admin-1'],
    blockedIds: []
  },
  {
    id: 'user-3',
    name: 'John Product',
    email: 'john@nexus.com',
    avatar: 'https://picsum.photos/seed/john/200/200',
    role: 'user',
    isOnline: true,
    friendIds: ['admin-1'],
    blockedIds: []
  },
  AI_BOT
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'p-1',
    userId: 'admin-1',
    content: 'Chào mừng đến với BinhMinhWL! Chúng tôi đã cập nhật hệ thống chat AI mới tên là Natch.',
    images: ['https://picsum.photos/seed/update/800/400'],
    likes: 1240,
    timestamp: Date.now() - 10000000,
    type: 'admin',
    user: MOCK_ADMIN,
    commentsCount: 0,
  },
  {
    id: 'p-2',
    userId: 'user-2',
    content: 'Mọi người đã thử chat với Natch chưa? Nó thông minh lắm!',
    likes: 45,
    timestamp: Date.now() - 3600000,
    type: 'user',
    user: MOCK_USERS[2],
    commentsCount: 2,
  },
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm-0',
    senderId: 'ai-natch',
    receiverId: 'user-1',
    content: 'Xin chào, tôi là Natch. Tôi có thể giúp gì cho bạn?',
    timestamp: Date.now() - 500000,
    type: 'text',
    status: 'read'
  }
];

export const SPAM_LIMIT_MS = 10000; // 10 seconds