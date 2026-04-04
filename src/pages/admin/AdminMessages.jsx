import React, { useState, useEffect } from 'react';
import { Mail, Check, Trash2, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();

    const subscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setMessages(prev => [payload.new, ...prev]);
          toast.success(`New message from ${payload.new.name}`);
        } else if (payload.eventType === 'UPDATE') {
          setMessages(prev => prev.map(m => m.id === payload.new.id ? payload.new : m));
        } else if (payload.eventType === 'DELETE') {
          setMessages(prev => prev.filter(m => m.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
       console.warn('Could not fetch messages from Supabase, possibly offline:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ status: 'read' })
        .eq('id', id);

      if (error) throw error;
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'read' } : m));
      toast.success('Message marked as read');
    } catch (error) {
      toast.error('Failed to update message');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (error) throw error;
      setMessages(prev => prev.filter(m => m.id !== id));
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif">Contact Messages</h2>
        <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          {messages.length} Total Messages
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="bg-dark-card border border-white/5 rounded-2xl p-12 text-center text-gray-500">
          <Mail className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No messages found. It's quiet here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map(msg => (
            <div key={msg.id} className={`relative bg-dark-card border rounded-2xl p-6 shadow-xl transition-colors ${msg.status === 'unread' ? 'border-primary/50' : 'border-white/5'}`}>
              {msg.status === 'unread' && (
                <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_rgba(255,122,0,0.8)]" />
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{msg.name}</h3>
                  {msg.user_email && msg.user_email !== 'Guest' && (
                    <p className="text-xs text-primary bg-primary/10 px-2 py-0.5 mt-1 rounded-full w-max border border-primary/20">
                      {msg.user_email}
                    </p>
                  )}
                  <div className="flex items-center text-xs text-gray-500 mt-2 gap-1">
                    <Calendar size={12} />
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-xl border border-white/5 mb-4 max-h-40 overflow-y-auto custom-scrollbar">
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{msg.message}</p>
              </div>

              <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                {msg.status === 'unread' ? (
                  <button 
                    onClick={() => markAsRead(msg.id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-green-400 hover:text-green-300 transition-colors"
                  >
                    <Check size={14} /> Mark Read
                  </button>
                ) : (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Check size={14} /> Read
                  </span>
                )}
                <button 
                  onClick={() => deleteMessage(msg.id)}
                  className="p-1.5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
