import React, { useState, useEffect } from 'react';
import { getAIKnowledgeApi, updateAIKnowledgeApi } from '../../services/api';

export default function ManageAIKnowledge() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadKnowledge();
  }, []);

  const loadKnowledge = async () => {
    setLoading(true);
    try {
      const data = await getAIKnowledgeApi();
      if (data && data.content) {
        setContent(data.content);
      }
    } catch (err) {
      console.error('Failed to load AI knowledge', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await updateAIKnowledgeApi(content);
      setMessage('Knowledge base updated successfully! The AI will now use this information.');
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      setMessage('Error saving knowledge base: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">AI Knowledge Base</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Provide company information, services, contact details, and rules for the AI Chatbot.
          The AI will read this exact text to learn how to answer user questions.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200">
              Company Knowledge (System Prompt)
            </label>
            <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-xs mb-4">
              <strong>Tip:</strong> Be very clear and structured. Use bullet points or numbered lists. Tell the AI its name, its role, and strict rules about what it can and cannot talk about.
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="20"
              placeholder="Example: You are Tibeb AI... Company Name is Tibeb Consultancy... Our services are..."
              className="w-full p-4 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-transparent dark:text-white dark:border-slate-600 font-mono"
            ></textarea>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">
              {message && (
                <span className={message.includes('Error') ? 'text-red-500' : 'text-green-600'}>
                  {message}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={saving || !content.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            >
              {saving ? 'Saving...' : 'Save Knowledge Base'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
