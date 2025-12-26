import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { Send, Image as ImageIcon } from 'lucide-react';

const ForumPage: React.FC = () => {
  const { posts, addPost } = useData();
  const { user } = useAuth();
  const [newPostContent, setNewPostContent] = useState('');

  // Filter User posts for Forum
  const forumPosts = posts.filter(p => p.type === 'user');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    addPost(newPostContent, 'user');
    setNewPostContent('');
  };

  return (
    <div className="space-y-6">
       <div className="mb-6">
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Community Forum</h2>
           <p className="text-slate-500 text-sm">Connect with others, share thoughts, and discuss.</p>
        </div>

      {/* User Post Creation */}
      {user && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 animate-fade-in">
          <div className="flex items-start space-x-4">
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
            <form onSubmit={handlePostSubmit} className="flex-1">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-700 focus-within:ring-2 ring-blue-500/50 transition-all">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder={`What's on your mind, ${user.name.split(' ')[0]}?`}
                  className="w-full bg-transparent border-none focus:ring-0 p-2 text-sm text-slate-900 dark:text-white resize-none h-20 placeholder-slate-400"
                />
                <div className="flex justify-between items-center px-2 pt-2 border-t border-slate-200 dark:border-slate-700/50">
                    <button type="button" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-500">
                        <ImageIcon className="w-5 h-5" />
                    </button>
                    <button 
                        type="submit" 
                        disabled={!newPostContent.trim()}
                        className="p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feed */}
      <div className="space-y-6">
        {forumPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        {forumPosts.length === 0 && <div className="text-center text-slate-500 mt-10">Be the first to post!</div>}
      </div>
    </div>
  );
};

export default ForumPage;