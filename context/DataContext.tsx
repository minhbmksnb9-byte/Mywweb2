import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Post, Comment, Message, Notification } from '../types';
import { INITIAL_POSTS, INITIAL_MESSAGES, MOCK_USERS, SPAM_LIMIT_MS } from '../constants';
import { useAuth } from './AuthContext';

interface DataContextType {
  posts: Post[];
  messages: Message[];
  addPost: (content: string, type: 'admin' | 'user', images?: string[]) => void;
  addComment: (postId: string, content: string) => { success: boolean; message?: string };
  getComments: (postId: string) => Comment[];
  sendMessage: (content: string, type?: 'text' | 'image') => void;
  notifications: Notification[];
  addNotification: (msg: string, type: Notification['type']) => void;
  removeNotification: (id: string) => void;
  users: typeof MOCK_USERS;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [comments, setComments] = useState<Comment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Rate limiting for comments: userId -> lastTimestamp
  const [lastCommentTime, setLastCommentTime] = useState<Record<string, number>>({});

  const addNotification = useCallback((message: string, type: Notification['type']) => {
    const id = Date.now().toString() + Math.random();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addPost = (content: string, type: 'admin' | 'user', images: string[] = []) => {
    if (!user) return;
    const newPost: Post = {
      id: Date.now().toString(),
      userId: user.id,
      content,
      images,
      likes: 0,
      timestamp: Date.now(),
      type,
      user: user,
      commentsCount: 0
    };
    setPosts(prev => [newPost, ...prev]);
    addNotification('Post published successfully!', 'success');
  };

  const addComment = (postId: string, content: string) => {
    if (!user) return { success: false, message: 'Must be logged in' };

    // Spam Check
    const lastTime = lastCommentTime[user.id] || 0;
    const now = Date.now();
    if (now - lastTime < SPAM_LIMIT_MS) {
      return { success: false, message: `Please wait ${(SPAM_LIMIT_MS - (now - lastTime)) / 1000}s before commenting again.` };
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      userId: user.id,
      content,
      timestamp: now,
      user: user
    };

    setComments(prev => [...prev, newComment]);
    setLastCommentTime(prev => ({ ...prev, [user.id]: now }));
    
    // Update post comment count
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p));

    return { success: true };
  };

  const getComments = (postId: string) => {
    return comments.filter(c => c.postId === postId).sort((a, b) => b.timestamp - a.timestamp);
  };

  const sendMessage = (content: string, type: 'text' | 'image' = 'text') => {
    if (!user) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: 'group', // simplified
      content,
      timestamp: Date.now(),
      type,
      status: 'sent'
    };
    setMessages(prev => [...prev, newMessage]);

    // Simulate realtime reply
    if(user.role !== 'admin') {
        setTimeout(() => {
            const reply: Message = {
                id: (Date.now() + 1).toString(),
                senderId: 'admin-1', // Admin replies
                receiverId: user.id,
                content: "We've received your message. An agent will be with you shortly.",
                timestamp: Date.now(),
                type: 'text',
                status: 'delivered'
            };
            setMessages(prev => [...prev, reply]);
        }, 2000);
    }
  };

  return (
    <DataContext.Provider value={{ 
      posts, 
      messages, 
      addPost, 
      addComment, 
      getComments, 
      sendMessage, 
      notifications, 
      addNotification,
      removeNotification,
      users: MOCK_USERS
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};