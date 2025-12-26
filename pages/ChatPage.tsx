import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Send, Search, Paperclip, Smile, MoreVertical, Plus, UserPlus, Users, Bot, User, VolumeX, Ban, MessagesSquare } from 'lucide-react';
import { AI_BOT } from '../constants';

const ChatPage: React.FC = () => {
  const { messages, sendMessage, allUsers, groups, createGroup, toggleBlock } = useData();
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  
  // Selected Chat State
  const [activeTab, setActiveTab] = useState<'friends' | 'groups' | 'ai'>('friends');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Modal & Options State
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedId]);

  if (!user) {
      return (
          <div className="flex items-center justify-center h-[60vh] text-slate-500">
              Vui lòng đăng nhập để sử dụng tính năng Chat.
          </div>
      )
  }

  // Determine current chat partner/group
  const activeChatUser = activeTab === 'friends' ? allUsers.find(u => u.id === selectedId) : null;
  const activeChatGroup = activeTab === 'groups' ? groups.find(g => g.id === selectedId) : null;
  const isAI = activeTab === 'ai';

  // Helper to filter friends
  const myFriends = allUsers.filter(u => user.friendIds.includes(u.id));

  // Handle Sending
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    let receiver = selectedId;
    if(activeTab === 'ai') receiver = AI_BOT.id;
    
    if (receiver) {
        sendMessage(inputText, receiver);
        setInputText('');
    }
  };

  const handleCreateGroup = () => {
      if(!groupName.trim() || selectedGroupMembers.length === 0) return;
      createGroup(groupName, selectedGroupMembers);
      setShowCreateGroup(false);
      setGroupName('');
      setSelectedGroupMembers([]);
      setActiveTab('groups');
  };

  // Filter messages for current view
  const currentMessages = messages.filter(m => {
      if (isAI) {
          return (m.senderId === user.id && m.receiverId === AI_BOT.id) || (m.senderId === AI_BOT.id && m.receiverId === user.id);
      }
      if (activeChatGroup) {
          return m.receiverId === activeChatGroup.id;
      }
      if (activeChatUser) {
          return (m.senderId === user.id && m.receiverId === activeChatUser.id) || (m.senderId === activeChatUser.id && m.receiverId === user.id);
      }
      return false;
  });

  return (
    <div className="h-[calc(100vh-8rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex">
      {/* Sidebar */}
      <div className="w-20 md:w-80 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 hidden md:block">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Tìm kiếm..." 
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
            </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
            <button onClick={() => { setActiveTab('friends'); setSelectedId(null); }} className={`flex-1 py-3 text-xs font-medium flex justify-center items-center ${activeTab === 'friends' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}><User className="w-4 h-4 md:mr-1" /><span className="hidden md:inline">Bạn bè</span></button>
            <button onClick={() => { setActiveTab('groups'); setSelectedId(null); }} className={`flex-1 py-3 text-xs font-medium flex justify-center items-center ${activeTab === 'groups' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}><Users className="w-4 h-4 md:mr-1" /><span className="hidden md:inline">Nhóm</span></button>
            <button onClick={() => { setActiveTab('ai'); setSelectedId(AI_BOT.id); }} className={`flex-1 py-3 text-xs font-medium flex justify-center items-center ${activeTab === 'ai' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}><Bot className="w-4 h-4 md:mr-1" /><span className="hidden md:inline">AI</span></button>
        </div>
        
        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {activeTab === 'friends' && myFriends.length === 0 && <div className="text-center text-xs text-slate-500 mt-4">Chưa có bạn bè nào.</div>}
            
            {activeTab === 'friends' && myFriends.map(u => (
                <button key={u.id} onClick={() => setSelectedId(u.id)} className={`w-full flex items-center p-3 rounded-xl transition-colors ${selectedId === u.id ? 'bg-white dark:bg-slate-800 shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    <div className="relative">
                        <img src={u.avatar} className="w-10 h-10 rounded-full object-cover" />
                        {u.isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></span>}
                    </div>
                    <div className="ml-3 text-left hidden md:block overflow-hidden">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{u.name}</p>
                    </div>
                </button>
            ))}

            {activeTab === 'groups' && (
                <>
                    <button onClick={() => setShowCreateGroup(true)} className="w-full flex items-center justify-center p-2 mb-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 hover:text-blue-600 hover:border-blue-500 text-xs">
                        <Plus className="w-4 h-4 mr-1" /> Tạo nhóm mới
                    </button>
                    {groups.map(g => (
                        <button key={g.id} onClick={() => setSelectedId(g.id)} className={`w-full flex items-center p-3 rounded-xl transition-colors ${selectedId === g.id ? 'bg-white dark:bg-slate-800 shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                             <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">G</div>
                             <div className="ml-3 text-left hidden md:block">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{g.name}</p>
                             </div>
                        </button>
                    ))}
                </>
            )}

            {activeTab === 'ai' && (
                 <button className="w-full flex items-center p-3 rounded-xl bg-blue-50 dark:bg-slate-800/50">
                    <img src={AI_BOT.avatar} className="w-10 h-10 rounded-full" />
                    <div className="ml-3 text-left hidden md:block">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{AI_BOT.name}</p>
                        <p className="text-xs text-blue-500">Trợ lý ảo</p>
                    </div>
                </button>
            )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-800/50">
        {!selectedId && !isAI ? (
            <div className="flex-1 flex items-center justify-center flex-col text-slate-400">
                <MessagesSquare className="w-12 h-12 mb-2 opacity-50" />
                <p>Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
        ) : (
            <>
                {/* Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {isAI ? (
                             <img src={AI_BOT.avatar} className="w-8 h-8 rounded-full" />
                        ) : activeChatGroup ? (
                             <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">G</div>
                        ) : (
                             <img src={activeChatUser?.avatar} className="w-8 h-8 rounded-full" />
                        )}
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                {isAI ? AI_BOT.name : activeChatGroup ? activeChatGroup.name : activeChatUser?.name}
                            </h3>
                            {activeChatUser && !isAI && (
                                <p className="text-xs text-green-500">Đang hoạt động</p>
                            )}
                        </div>
                    </div>
                    <div className="relative">
                        <button onClick={() => setShowOptions(!showOptions)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                            <MoreVertical className="w-5 h-5 text-slate-500" />
                        </button>
                        {showOptions && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                                <button onClick={() => setIsMuted(!isMuted)} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm flex items-center">
                                    <VolumeX className="w-4 h-4 mr-2" /> {isMuted ? 'Bật thông báo' : 'Tắt thông báo'}
                                </button>
                                {!isAI && !activeChatGroup && activeChatUser && (
                                    <button onClick={() => { toggleBlock(activeChatUser.id); setShowOptions(false); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm flex items-center text-red-500">
                                        <Ban className="w-4 h-4 mr-2" /> 
                                        {user.blockedIds.includes(activeChatUser.id) ? 'Bỏ chặn' : 'Chặn người dùng'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentMessages.map((msg) => {
                        const isMe = msg.senderId === user.id;
                        const sender = allUsers.find(u => u.id === msg.senderId) || AI_BOT;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex max-w-[80%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                                    {!isMe && <img src={sender.avatar} className="w-6 h-6 rounded-full mb-1 mx-2" />}
                                    <div>
                                        {!isMe && activeChatGroup && <p className="text-[10px] text-slate-500 ml-1 mb-1">{sender.name}</p>}
                                        <div className={`px-4 py-2 rounded-2xl text-sm ${
                                            isMe 
                                            ? 'bg-blue-600 text-white rounded-br-none' 
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none'
                                        }`}>
                                            {msg.content}
                                        </div>
                                        <p className={`text-[10px] text-slate-400 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <form onSubmit={handleSend} className="flex items-center space-x-2">
                        <button type="button" className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <div className="flex-1 relative">
                            <input 
                                type="text" 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Nhập tin nhắn..." 
                                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white pl-4 pr-10"
                            />
                            <button type="button" className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600">
                                <Smile className="w-5 h-5" />
                            </button>
                        </div>
                        <button 
                            type="submit" 
                            disabled={!inputText.trim()}
                            className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-sm p-6 animate-fade-in">
                  <h3 className="text-lg font-bold mb-4 dark:text-white">Tạo nhóm mới</h3>
                  <input 
                    className="w-full border p-2 rounded mb-4 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    placeholder="Tên nhóm..."
                    value={groupName}
                    onChange={e => setGroupName(e.target.value)}
                  />
                  <div className="mb-4">
                      <p className="text-sm font-semibold mb-2 dark:text-slate-300">Chọn thành viên:</p>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                          {myFriends.map(f => (
                              <label key={f.id} className="flex items-center space-x-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={selectedGroupMembers.includes(f.id)}
                                    onChange={(e) => {
                                        if(e.target.checked) setSelectedGroupMembers([...selectedGroupMembers, f.id]);
                                        else setSelectedGroupMembers(selectedGroupMembers.filter(id => id !== f.id));
                                    }}
                                  />
                                  <span className="dark:text-slate-200 text-sm">{f.name}</span>
                              </label>
                          ))}
                      </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                      <button onClick={() => setShowCreateGroup(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">Hủy</button>
                      <button onClick={handleCreateGroup} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Tạo nhóm</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ChatPage;