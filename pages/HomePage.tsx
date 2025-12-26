import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { Plus, Image as ImageIcon, X } from 'lucide-react';

const HomePage: React.FC = () => {
  const { posts, addPost } = useData();
  const { user } = useAuth();
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter only Admin posts for Home
  const adminPosts = posts.filter(p => p.type === 'admin');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
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
    addPost(newPostContent, 'admin', images);
    
    setNewPostContent('');
    setSelectedImage(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Thông báo</h2>
           <p className="text-slate-500 text-sm">Cập nhật chính thức từ BinhMinhWL Admin</p>
        </div>
      </div>

      {/* Admin Post Creation */}
      {user?.role === 'admin' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 mb-8 animate-fade-in">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Tạo thông báo mới</h3>
          <form onSubmit={handlePostSubmit}>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Có gì mới trên Nexus?"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white resize-none h-24"
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

            <div className="flex justify-between items-center mt-3">
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
                    className="text-slate-500 hover:text-blue-500 flex items-center space-x-1"
                >
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-xs">Thêm ảnh</span>
                </button>
              </div>
              <button 
                type="submit"
                disabled={!newPostContent.trim() && !selectedImage}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Đăng tin</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feed */}
      <div className="space-y-6">
        {adminPosts.length === 0 ? (
          <div className="text-center py-10 text-slate-500">Chưa có thông báo nào.</div>
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