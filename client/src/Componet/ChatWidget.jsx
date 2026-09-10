import React, { useState, useEffect } from 'react';
import { askChatbotApi } from '../services/api';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am Tibeb AI, the official virtual assistant for Tibeb Consultancy & Training PLC. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener('open-tibeb-ai', handleOpenEvent);
    return () => window.removeEventListener('open-tibeb-ai', handleOpenEvent);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Map existing messages to history format expected by backend
      const mappedHistory = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await askChatbotApi(userMsg, mappedHistory);
      const botMsg = res.answer || res.reply || res.response || res.message || 'Thank you for reaching out to Tibeb Consultancy!';
      setMessages(prev => [...prev, { sender: 'bot', text: botMsg }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I encountered an error connecting to Tibeb AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-3.5 rounded-full font-bold text-white shadow-xl transition-all duration-300 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            border: '2px solid rgba(255,255,255,0.2)'
          }}
        >
          <span>🤖 Ask Tibeb AI</span>
        </button>
      )}

      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] rounded-3xl shadow-2xl border flex flex-col overflow-hidden animate-fade-in bg-card border-border"
         >
          
          {/* Header */}
          <div className="px-5 py-4 flex justify-between items-center text-white"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), #283593)' }}>
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🤖</span>
              <div>
                <h4 className="font-bold text-sm leading-none text-white">Tibeb AI Assistant</h4>
                <span className="text-[10px] opacity-80">Empowered by Gemini AI</span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => {
                  setMessages([{ sender: 'bot', text: 'Hello! I am Tibeb AI, the official virtual assistant for Tibeb Consultancy & Training PLC. How can I help you today?' }]);
                }, 300); // Wait for close animation
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 text-white transition-colors text-lg"
            >
              ✕
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map((m, idx) => (
              <div key={idx} className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-sm ${
                m.sender === 'user'
                  ? 'self-end text-white bg-primary rounded-br-none'
                  : 'self-start bg-theme text-primary border border-theme rounded-bl-none'
              }`}
              style={{
                backgroundColor: m.sender === 'user' ? 'var(--color-primary)' : 'var(--main-bg)',
                color: m.sender === 'user' ? '#ffffff' : 'var(--text-primary)'
              }}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="self-start text-xs text-muted italic flex items-center gap-1.5 p-2">
                <span>Tibeb AI is thinking...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t flex gap-2"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
            <input
              type="text"
              placeholder="Ask about Tibeb services, team..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border text-xs outline-none bg-theme text-primary focus:border-primary transition-all"
              style={{ borderColor: 'var(--border-color)' }}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 rounded-xl font-bold text-white text-xs transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--color-primary)' }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatWidget;
