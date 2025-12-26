import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { Send, Image as ImageIcon, X } from 'lucide-react';

const ForumPage: React.FC = () => {
  const { posts, addPost } = useData();
  const { user } = useAuth();
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter User posts for Forum
  const forumPosts = posts.filter(p => p.type === 'user');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Limit 2MB for localstorage safety
          alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() && !selectedImage) return;
    
    const images = selectedImage ? [selectedImage] : [];
    addPost(newPostContent, 'user', images);
    
    setNewPostContent('');
    setSelectedImage(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
       <div className="mb-6">
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Cộng đồng</h2>
           <p className="text-slate-500 text-sm">Kết nối, chia sẻ khoảnh khắc với mọi người.</p>
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
                  placeholder={`Bạn đang nghĩ gì, ${user.name.split(' ')[0]}?`}
                  className="w-full bg-transparent border-none focus:ring-0 p-2 text-sm text-slate-900 dark:text-white resize-none h-20 placeholder-slate-400"
                />
                
                {/* Image Preview */}
                {selectedImage && (
                    <div className="relative inline-block m-2">
                        <img src={selectedImage} alt="Preview" className="h-20 w-auto rounded-lg border border-slate-300 dark:border-slate-600" />
                        <button 
                            type="button" 
                            onClick={() => { setSelectedImage(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                )}

                <div className="flex justify-between items-center px-2 pt-2 border-t border-slate-200 dark:border-slate-700/50">
                    <div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleFileChange}
                        />
                        <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
                            title="Thêm ảnh"
                        >
                            <ImageIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <button 
                        type="submit" 
                        disabled={!newPostContent.trim() && !selectedImage}
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
        {forumPosts.length === 0 && <div className="text-center text-slate-500 mt-10">Hãy là người đầu tiên đăng bài!</div>}
      </div>
    </div>
  );
};

export default ForumPage;