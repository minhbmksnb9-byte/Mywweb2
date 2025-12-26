import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Send, Search, Image as ImageIcon, Paperclip, Smile } from 'lucide-react';

const ChatPage: React.FC = () => {
  const { messages, sendMessage, users } = useData();
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | 'group'>('group');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!user) {
      return (
          <div className="flex items-center justify-center h-[60vh] text-slate-500">
              Please login to access chat.
          </div>
      )
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex">
      {/* Sidebar - Contacts */}
      <div className="w-20 md:w-72 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 hidden md:block">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-3">Messages</h2>
            <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search people..." 
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {/* Group Chat (Default) */}
            <button 
                onClick={() => setSelectedUser('group')}
                className={`w-full flex items-center p-3 rounded-xl transition-colors ${selectedUser === 'group' ? 'bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">#</div>
                </div>
                <div className="ml-3 text-left hidden md:block">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">General Chat</p>
                    <p className="text-xs text-slate-500 truncate">Official community channel</p>
                </div>
            </button>

            {/* Users */}
            {users.filter(u => u.id !== user.id).map(u => (
                <button 
                    key={u.id}
                    onClick={() => setSelectedUser(u.id)}
                    className={`w-full flex items-center p-3 rounded-xl transition-colors ${selectedUser === u.id ? 'bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                    <div className="relative">
                        <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                        {u.isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-50 dark:border-slate-900 rounded-full"></span>}
                    </div>
                    <div className="ml-3 text-left hidden md:block">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{u.name}</p>
                        <p className="text-xs text-slate-500 truncate capitalize">{u.role}</p>
                    </div>
                </button>
            ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-800/50">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                 {selectedUser === 'group' ? (
                     <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">#</div>
                 ) : (
                    <img src={users.find(u => u.id === selectedUser)?.avatar} className="w-8 h-8 rounded-full" />
                 )}
                 <div>
                     <h3 className="font-semibold text-slate-900 dark:text-white">
                         {selectedUser === 'group' ? 'General Chat' : users.find(u => u.id === selectedUser)?.name}
                     </h3>
                     <p className="text-xs text-green-500 flex items-center">
                         <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span> Online
                     </p>
                 </div>
            </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
                const isMe = msg.senderId === user.id;
                const sender = users.find(u => u.id === msg.senderId) || { name: 'Unknown', avatar: '' };
                return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[80%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                            {!isMe && <img src={sender.avatar} className="w-6 h-6 rounded-full mb-1 mx-2" />}
                            <div>
                                {!isMe && <p className="text-[10px] text-slate-500 ml-1 mb-1">{sender.name}</p>}
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
                        placeholder="Type a message..." 
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
      </div>
    </div>
  );
};

export default ChatPage;