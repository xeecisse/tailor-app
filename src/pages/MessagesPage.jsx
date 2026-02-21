import React, { useState, useEffect, useRef } from 'react';
import { User, Send, Trash2, AlertCircle } from 'lucide-react';
import { messagesAPI } from '../lib/api';

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      loadMessages(selectedCustomer.clientId);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await messagesAPI.getConversations();
      setConversations(response.data.conversations);
      
      // Auto-select first conversation if available
      if (response.data.conversations.length > 0 && !selectedCustomer) {
        setSelectedCustomer(response.data.conversations[0]);
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (clientId) => {
    try {
      const response = await messagesAPI.getMessages(clientId);
      setMessages(response.data.messages);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedCustomer) return;

    try {
      setSending(true);
      const response = await messagesAPI.sendMessage(selectedCustomer.clientId, message.trim());
      
      // Add new message to the list
      setMessages([...messages, response.data.message]);
      setMessage('');
      
      // Update conversation list
      await loadConversations();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteConversation = async (clientId) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      await messagesAPI.deleteConversation(clientId);
      
      // Remove from list
      setConversations(conversations.filter(c => c.clientId !== clientId));
      
      // Clear selection if it was the deleted conversation
      if (selectedCustomer?.clientId === clientId) {
        setSelectedCustomer(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
      setError('Failed to delete conversation');
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return formatTime(date);
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-navy-50 via-brand-orange-50 to-brand-navy-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-brand-navy-200 border-t-brand-navy mb-4"></div>
          <p className="text-gray-700 font-bold text-lg">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy-50 via-brand-orange-50 to-brand-navy-50">
      {/* Enhanced Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-brand-navy to-brand-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-gradient-to-br from-brand-orange to-brand-navy rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-[550px] h-[550px] bg-gradient-to-br from-brand-navy to-brand-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex h-[calc(100vh-180px)] bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden">
          {/* Left Sidebar - Customer List */}
          <div className="w-80 bg-white/90 backdrop-blur-sm border-r-2 border-gray-100 flex flex-col">
            <div className="p-6 border-b-2 border-gray-100">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-navy to-brand-orange bg-clip-text text-transparent">Messages</h1>
              <p className="text-sm text-gray-600 mt-1 font-medium">Chat with your customers</p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="bg-gradient-to-br from-brand-navy-50 to-brand-orange-50 rounded-2xl p-6 inline-block mb-3">
                    <AlertCircle className="mx-auto text-gray-400" size={48} />
                  </div>
                  <p className="text-gray-700 font-semibold">No conversations yet</p>
                  <p className="text-sm text-gray-500 mt-1">Messages will appear here</p>
                </div>
              ) : (
                <div className="p-4">
                  <h2 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-3">
                    Customers
                  </h2>
                  {conversations.map((customer) => (
                    <div
                      key={customer.clientId}
                      onClick={() => setSelectedCustomer(customer)}
                      className={`flex items-center p-3 rounded-xl cursor-pointer transition-all mb-2 group border-2 ${
                        selectedCustomer?.clientId === customer.clientId
                          ? 'bg-gradient-to-br from-brand-navy-50 to-brand-orange-50 border-brand-navy-200'
                          : 'border-transparent hover:bg-gray-50 hover:border-gray-100'
                      }`}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-brand-navy to-brand-orange rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <User size={20} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-semibold text-gray-900 truncate">
                            {customer.clientName}
                          </div>
                          {customer.lastMessageTime && (
                            <div className="text-xs text-gray-500 ml-2 flex-shrink-0">
                              {formatDate(customer.lastMessageTime)}
                            </div>
                          )}
                        </div>
                        {customer.lastMessage ? (
                          <div className="text-sm text-gray-600 truncate">
                            {customer.lastMessageSender === 'tailor' ? 'You: ' : ''}
                            {customer.lastMessage}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 italic">
                            No messages yet
                          </div>
                        )}
                        {customer.unreadCount > 0 && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-brand-navy-100 text-brand-navy">
                              {customer.unreadCount} new
                            </span>
                          </div>
                        )}
                      </div>
                      {customer.hasMessages && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConversation(customer.clientId);
                          }}
                          className="ml-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-white/95">
            {selectedCustomer ? (
              <>
                {/* Chat Header */}
                <div className="px-8 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-brand-navy-50 to-brand-orange-50">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-navy to-brand-orange rounded-full flex items-center justify-center mr-3">
                      <User size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        {selectedCustomer.clientName}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {selectedCustomer.clientPhone || 'Customer'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-white">
                  <div className="max-w-4xl">
                    {messages.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-600 font-semibold">No messages yet</p>
                        <p className="text-sm text-gray-500 mt-1">Start the conversation</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg._id}
                          className={`mb-4 flex ${
                            msg.sender === 'tailor' ? 'justify-start' : 'justify-end'
                          }`}
                        >
                          <div
                            className={`max-w-md ${msg.sender === 'client' ? 'ml-auto' : ''}`}
                          >
                            <div
                              className={`rounded-2xl px-5 py-3 ${
                                msg.sender === 'client'
                                  ? 'bg-gradient-to-br from-brand-navy to-brand-orange text-white shadow-lg'
                                  : 'bg-white text-gray-900 border-2 border-gray-100'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {msg.message}
                              </p>
                            </div>
                            <div
                              className={`text-xs text-gray-500 mt-1 px-2 font-medium ${
                                msg.sender === 'client' ? 'text-right' : ''
                              }`}
                            >
                              {formatTime(msg.createdAt)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message Input */}
                <div className="border-t-2 border-gray-100 p-6 bg-white">
                  {error && (
                    <div className="mb-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-xl text-sm text-red-700 font-semibold">
                      {error}
                    </div>
                  )}
                  <div className="flex items-end space-x-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        disabled={sending}
                        className="w-full px-4 py-3 pr-12 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-brand-navy text-gray-900 placeholder-gray-400 disabled:bg-gray-100 transition-all"
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || sending}
                      className="bg-gradient-to-br from-brand-navy to-brand-orange hover:from-brand-navy-dark hover:to-brand-orange-dark text-white p-3 rounded-xl transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-white">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-brand-navy to-brand-orange rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <User size={40} className="text-white" />
                  </div>
                  <p className="text-gray-700 text-lg font-bold">Select a conversation</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Choose a customer to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
