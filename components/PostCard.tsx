import React, { useState } from 'react';
import { Post } from '../types';
import { Heart, MessageCircle, Share2, MoreHorizontal, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuth();
  const { addComment, getComments, addNotification } = useData();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const result = addComment(post.id, commentText);
    if (result.success) {
      setCommentText('');
      addNotification('Comment added', 'success');
    } else {
      addNotification(result.message || 'Error', 'error');
    }
  };

  const comments = getComments(post.id);
  // Show only top 2 if not expanded
  const displayComments = showComments ? comments : comments.slice(0, 2);

  // Admin posts do not allow comments
  const allowComments = post.type !== 'admin';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6 transition-colors duration-300 animate-slide-up">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent dark:ring-slate-700" />
          <div>
            <div className="flex items-center space-x-1">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{post.user.name}</h3>
              {post.user.role === 'admin' && (
                <ShieldCheck className="w-4 h-4 text-blue-500 fill-blue-500/20" />
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {new Date(post.timestamp).toLocaleString()} • {post.type === 'admin' ? 'Announcement' : 'Community'}
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-2">
        <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Media */}
      {post.images && post.images.length > 0 && (
        <div className="mt-2">
          <img 
            src={post.images[0]} 
            alt="Post content" 
            loading="lazy"
            className="w-full h-64 object-cover hover:opacity-95 transition-opacity cursor-pointer" 
          />
        </div>
      )}

      {/* Action Bar */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 mt-2">
        <div className="flex space-x-4">
          <button 
            onClick={handleLike}
            className={`flex items-center space-x-1.5 text-sm font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500 dark:text-slate-400'}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </button>
          
          {allowComments && (
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1.5 text-sm font-medium text-slate-500 hover:text-blue-500 dark:text-slate-400 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{post.commentsCount + comments.length}</span>
            </button>
          )}
        </div>

        <button className="text-slate-500 hover:text-blue-500 dark:text-slate-400 transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Comments Section */}
      {allowComments && (
        <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 border-t border-slate-100 dark:border-slate-700/50">
          {/* List Comments */}
          <div className="space-y-3 mb-3">
            {displayComments.map(comment => (
              <div key={comment.id} className="flex space-x-2 animate-fade-in">
                <img src={comment.user.avatar} alt="User" className="w-6 h-6 rounded-full" />
                <div className="bg-white dark:bg-slate-700 rounded-lg rounded-tl-none px-3 py-2 shadow-sm text-xs flex-1">
                  <span className="font-semibold text-slate-900 dark:text-white mr-2">{comment.user.name}</span>
                  <span className="text-slate-700 dark:text-slate-300">{comment.content}</span>
                </div>
              </div>
            ))}
            
            {!showComments && comments.length > 2 && (
              <button onClick={() => setShowComments(true)} className="text-xs text-blue-500 hover:underline">
                View all comments
              </button>
            )}
          </div>

          {/* Comment Input */}
          {user && (
            <form onSubmit={handleSubmitComment} className="flex items-center space-x-2">
              <img src={user.avatar} alt="Me" className="w-8 h-8 rounded-full" />
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;