import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { UserPlus, UserMinus, MessageCircle, Ban } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { allUsers, posts, toggleFriend, toggleBlock } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const profileUser = allUsers.find(u => u.id === userId);
  
  if (!profileUser) {
      return <div className="text-center py-10">Người dùng không tồn tại.</div>;
  }

  const userPosts = posts.filter(p => p.userId === profileUser.id);
  const isMe = user?.id === profileUser.id;
  const isFriend = user?.friendIds.includes(profileUser.id);
  const isBlocked = user?.blockedIds.includes(profileUser.id);

  return (
    <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative">
            <div className="h-32 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            <div className="px-6 pb-6">
                <div className="relative flex justify-between items-end -mt-12 mb-4">
                    <img src={profileUser.avatar} className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-md bg-white" />
                    {!isMe && user && (
                        <div className="flex space-x-2 mb-2">
                             <button 
                                onClick={() => toggleFriend(profileUser.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 transition-colors ${
                                    isFriend 
                                    ? 'bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600 dark:bg-slate-700 dark:text-slate-300' 
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                             >
                                 {isFriend ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                                 <span>{isFriend ? 'Hủy kết bạn' : 'Kết bạn'}</span>
                             </button>
                             <button 
                                onClick={() => navigate('/chat')}
                                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600"
                             >
                                 <MessageCircle className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={() => toggleBlock(profileUser.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 ${isBlocked ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}
                             >
                                 <Ban className="w-4 h-4" />
                             </button>
                        </div>
                    )}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                        {profileUser.name}
                        {profileUser.role === 'admin' && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] rounded-full uppercase font-bold tracking-wider">Admin</span>}
                    </h1>
                    <p className="text-slate-500">{profileUser.email}</p>
                    <div className="flex space-x-4 mt-4 text-sm text-slate-500 dark:text-slate-400">
                         <span><strong className="text-slate-900 dark:text-white">{userPosts.length}</strong> bài viết</span>
                         <span><strong className="text-slate-900 dark:text-white">{profileUser.friendIds.length}</strong> bạn bè</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Posts */}
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Bài viết</h2>
        <div className="space-y-6">
            {userPosts.length > 0 ? (
                userPosts.map(p => <PostCard key={p.id} post={p} />)
            ) : (
                <div className="text-center py-8 text-slate-500 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    Chưa có bài viết nào.
                </div>
            )}
        </div>
    </div>
  );
};

export default ProfilePage;