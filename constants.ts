import { User, Post, Message } from './types';

export const MOCK_ADMIN: User = {
  id: 'admin-1',
  name: 'Nexus Official',
  email: 'admin@nexus.com',
  avatar: 'https://picsum.photos/seed/admin/200/200',
  role: 'admin',
  isOnline: true,
};

export const MOCK_USER: User = {
  id: 'user-1',
  name: 'Alex Developer',
  email: 'alex@nexus.com',
  avatar: 'https://picsum.photos/seed/alex/200/200',
  role: 'user',
  isOnline: true,
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
  },
  {
    id: 'user-3',
    name: 'John Product',
    email: 'john@nexus.com',
    avatar: 'https://picsum.photos/seed/john/200/200',
    role: 'user',
    isOnline: true,
  },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'p-1',
    userId: 'admin-1',
    content: 'Welcome to Nexus Social v2.0! We have updated our privacy policy and added new dark mode features. Enjoy the experience.',
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
    content: 'Does anyone know how to optimize React re-renders efficiently? Im struggling with a large list.',
    likes: 45,
    timestamp: Date.now() - 3600000,
    type: 'user',
    user: MOCK_USERS[2],
    commentsCount: 2,
  },
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm-1',
    senderId: 'user-2',
    receiverId: 'user-1',
    content: 'Hey Alex, did you see the new admin post?',
    timestamp: Date.now() - 100000,
    type: 'text',
    status: 'read',
  },
];

export const SPAM_LIMIT_MS = 10000; // 10 seconds