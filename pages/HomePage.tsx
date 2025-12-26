import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { Plus, Image as ImageIcon } from 'lucide-react';

const HomePage: React.FC = () => {
  const { posts, addPost } = useData();
  const { user } = useAuth();
  const [newPostContent, setNewPostContent] = useState('');

  // Filter only Admin posts for Home
  const adminPosts = posts.filter(p => p.type === 'admin');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    addPost(newPostContent, 'admin');
    setNewPostContent('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Announcements</h2>
           <p className="text-slate-500 text-sm">Official updates from Nexus admins</p>
        </div>
      </div>

      {/* Admin Post Creation */}
      {user?.role === 'admin' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 mb-8 animate-fade-in">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Create Announcement</h3>
          <form onSubmit={handlePostSubmit}>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's new in Nexus?"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white resize-none h-24"
            />
            <div className="flex justify-between items-center mt-3">
              <button type="button" className="text-slate-500 hover:text-blue-500">
                <ImageIcon className="w-5 h-5" />
              </button>
              <button 
                type="submit"
                disabled={!newPostContent.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Post Update</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feed */}
      <div className="space-y-6">
        {adminPosts.length === 0 ? (
          <div className="text-center py-10 text-slate-500">No announcements yet.</div>
        ) : (
          adminPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;