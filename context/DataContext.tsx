import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Post, Comment, Message, Notification, User, Group } from '../types';
import { INITIAL_POSTS, INITIAL_MESSAGES, MOCK_USERS, SPAM_LIMIT_MS, AI_BOT } from '../constants';
import { useAuth } from './AuthContext';

interface DataContextType {
  posts: Post[];
  messages: Message[];
  groups: Group[];
  allUsers: User[];
  addPost: (content: string, type: 'admin' | 'user', images?: string[]) => void;
  addComment: (postId: string, content: string) => { success: boolean; message?: string };
  getComments: (postId: string) => Comment[];
  sendMessage: (content: string, receiverId: string, type?: 'text' | 'image') => void;
  createGroup: (name: string, memberIds: string[]) => void;
  toggleFriend: (targetUserId: string) => void;
  toggleBlock: (targetUserId: string) => void;
  notifications: Notification[];
  addNotification: (msg: string, type: Notification['type']) => void;
  removeNotification: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.error(`Error loading key ${key}`, e);
    return fallback;
  }
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [posts, setPosts] = useState<Post[]>(() => loadFromStorage('nexus_posts', INITIAL_POSTS));
  const [messages, setMessages] = useState<Message[]>(() => loadFromStorage('nexus_messages', INITIAL_MESSAGES));
  const [comments, setComments] = useState<Comment[]>(() => loadFromStorage('nexus_comments', []));
  const [groups, setGroups] = useState<Group[]>(() => loadFromStorage('nexus_groups', []));
  
  // Manage users locally to support friend/block changes persistence (mocking DB)
  const [allUsers, setAllUsers] = useState<User[]>(() => loadFromStorage('nexus_users', MOCK_USERS));

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastCommentTime, setLastCommentTime] = useState<Record<string, number>>({});

  useEffect(() => { localStorage.setItem('nexus_posts', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('nexus_messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('nexus_comments', JSON.stringify(comments)); }, [comments]);
  useEffect(() => { localStorage.setItem('nexus_groups', JSON.stringify(groups)); }, [groups]);
  useEffect(() => { localStorage.setItem('nexus_users', JSON.stringify(allUsers)); }, [allUsers]);

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
    addNotification('Đã đăng bài thành công!', 'success');
  };

  const addComment = (postId: string, content: string) => {
    if (!user) return { success: false, message: 'Bạn cần đăng nhập' };
    const lastTime = lastCommentTime[user.id] || 0;
    const now = Date.now();
    if (now - lastTime < SPAM_LIMIT_MS) {
      return { success: false, message: `Vui lòng đợi ${(SPAM_LIMIT_MS - (now - lastTime)) / 1000}s trước khi bình luận lại.` };
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
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p));
    return { success: true };
  };

  const getComments = (postId: string) => {
    return comments.filter(c => c.postId === postId).sort((a, b) => b.timestamp - a.timestamp);
  };

  const generateAIResponse = (userMsg: string): string => {
      const lower = userMsg.toLowerCase();
      if (lower.includes('chào') || lower.includes('hello')) return "Xin chào! Tôi là Natch(minhbmksnb9). Tôi có thể giúp gì cho bạn hôm nay?";
      if (lower.includes('bạn là ai')) return "Tôi là trí tuệ nhân tạo được phát triển bởi BinhMinhWL để hỗ trợ bạn.";
      if (lower.includes('thời tiết')) return "Tôi chưa có kết nối thời tiết thực tế, nhưng hy vọng trời hôm nay đẹp!";
      if (lower.includes('giúp')) return "Bạn có thể hỏi tôi về cách sử dụng web, kết bạn, hoặc tạo nhóm chat.";
      return "Thú vị đấy! Hãy kể thêm cho tôi nghe đi. (Auto-reply from Natch)";
  };

  const sendMessage = (content: string, receiverId: string, type: 'text' | 'image' = 'text') => {
    if (!user) return;

    // Check blocked status
    const targetUser = allUsers.find(u => u.id === receiverId);
    if (targetUser && (targetUser.blockedIds.includes(user.id) || user.blockedIds.includes(targetUser.id))) {
        addNotification("Không thể gửi tin nhắn. Người dùng đã bị chặn hoặc chặn bạn.", 'error');
        return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId, 
      content,
      timestamp: Date.now(),
      type,
      status: 'sent'
    };
    setMessages(prev => [...prev, newMessage]);

    // AI Logic
    if (receiverId === AI_BOT.id) {
        setTimeout(() => {
            const reply: Message = {
                id: (Date.now() + 1).toString(),
                senderId: AI_BOT.id,
                receiverId: user.id,
                content: generateAIResponse(content),
                timestamp: Date.now(),
                type: 'text',
                status: 'read'
            };
            setMessages(prev => [...prev, reply]);
        }, 1500);
    }
  };

  const createGroup = (name: string, memberIds: string[]) => {
      if(!user) return;
      const newGroup: Group = {
          id: 'group-' + Date.now(),
          name,
          avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
          memberIds: [...memberIds, user.id],
          adminId: user.id
      };
      setGroups(prev => [...prev, newGroup]);
      addNotification(`Đã tạo nhóm "${name}"`, 'success');
  };

  const toggleFriend = (targetUserId: string) => {
      if (!user) return;
      const currentUser = allUsers.find(u => u.id === user.id);
      const targetUser = allUsers.find(u => u.id === targetUserId);
      
      if (!currentUser || !targetUser) return;

      let newCurrentUser = { ...currentUser };
      let newTargetUser = { ...targetUser };

      if (currentUser.friendIds.includes(targetUserId)) {
          // Unfriend
          newCurrentUser.friendIds = currentUser.friendIds.filter(id => id !== targetUserId);
          newTargetUser.friendIds = targetUser.friendIds.filter(id => id !== user.id);
          addNotification("Đã hủy kết bạn", 'info');
      } else {
          // Add Friend
          newCurrentUser.friendIds = [...currentUser.friendIds, targetUserId];
          newTargetUser.friendIds = [...targetUser.friendIds, user.id];
          addNotification("Đã kết bạn", 'success');
      }

      // Update state
      setAllUsers(prev => prev.map(u => {
          if (u.id === user.id) return newCurrentUser;
          if (u.id === targetUserId) return newTargetUser;
          return u;
      }));
  };

  const toggleBlock = (targetUserId: string) => {
      if (!user) return;
      const currentUser = allUsers.find(u => u.id === user.id);
      if (!currentUser) return;

      let newCurrentUser = { ...currentUser };
      if (currentUser.blockedIds.includes(targetUserId)) {
          newCurrentUser.blockedIds = currentUser.blockedIds.filter(id => id !== targetUserId);
          addNotification("Đã bỏ chặn người dùng", 'info');
      } else {
          newCurrentUser.blockedIds = [...currentUser.blockedIds, targetUserId];
          addNotification("Đã chặn người dùng", 'warning');
      }

      setAllUsers(prev => prev.map(u => u.id === user.id ? newCurrentUser : u));
  };

  return (
    <DataContext.Provider value={{ 
      posts, messages, groups, allUsers,
      addPost, addComment, getComments, sendMessage, createGroup,
      toggleFriend, toggleBlock,
      notifications, addNotification, removeNotification
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