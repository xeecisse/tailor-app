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
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-180px)] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Left Sidebar - Customer List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">Chat with your customers</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="text-gray-500">No conversations yet</p>
              <p className="text-sm text-gray-400 mt-1">Messages will appear here</p>
            </div>
          ) : (
            <div className="p-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Customers
              </h2>
              {conversations.map((customer) => (
                <div
                  key={customer.clientId}
                  onClick={() => setSelectedCustomer(customer)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors mb-2 group ${
                    selectedCustomer?.clientId === customer.clientId
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <User size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-gray-900 truncate">
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
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
      <div className="flex-1 flex flex-col bg-white">
        {selectedCustomer ? (
          <>
            {/* Chat Header */}
            <div className="px-8 py-5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {selectedCustomer.clientName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedCustomer.clientPhone || 'Customer'}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
              <div className="max-w-4xl">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No messages yet</p>
                    <p className="text-sm text-gray-400 mt-1">Start the conversation</p>
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
                              ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                              : 'bg-white text-gray-900 border border-gray-200'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {msg.message}
                          </p>
                        </div>
                        <div
                          className={`text-xs text-gray-500 mt-1 px-2 ${
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
            <div className="border-t border-gray-200 p-6 bg-white">
              {error && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
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
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 disabled:bg-gray-100"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sending}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-lg transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={40} className="text-white" />
              </div>
              <p className="text-gray-500 text-lg">Select a conversation</p>
              <p className="text-sm text-gray-400 mt-1">
                Choose a customer to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
