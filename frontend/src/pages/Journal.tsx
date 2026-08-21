import { useState, useEffect } from 'react';
import { journalApi } from '../api/client';
import type { Journal } from '../types';
import { MOOD_OPTIONS } from '../types';
import JournalCard from '../components/JournalCard';

export default function JournalPage() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchJournals = async () => {
    try {
      const data = await journalApi.getAll();
      setJournals(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJournals(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      await journalApi.create({
        title: title.trim(),
        content: content.trim(),
        mood: mood || undefined,
      });
      setTitle('');
      setContent('');
      setMood('');
      setShowForm(false);
      fetchJournals();
    } catch { /* ignore */ }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除这篇日志？')) return;
    try {
      await journalApi.delete(id);
      fetchJournals();
    } catch { /* ignore */ }
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title mb-0">✎ 日志</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-accent">
          {showForm ? '取消' : '+ 写日志'}
        </button>
      </div>

      {/* New Journal Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-8 animate-slide-up">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="标题"
            className="input-field mb-4"
            autoFocus
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="记录今天发生的事..."
            className="input-field mb-4 min-h-[200px] resize-y"
          />
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-white/40 text-sm">心情：</span>
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m.label}
                type="button"
                onClick={() => setMood(mood === m.label ? '' : m.label)}
                className={`
                  px-3 py-1.5 rounded-full text-sm transition-all duration-300
                  ${mood === m.label
                    ? 'bg-accent/20 border border-accent/50 text-accent'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                  }
                `}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
          <button type="submit" disabled={submitting || !title.trim() || !content.trim()} className="btn-accent">
            {submitting ? '保存中...' : '保存日志'}
          </button>
        </form>
      )}

      {/* Journal List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40">加载中...</p>
        </div>
      ) : journals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">📝</p>
          <p className="text-white/40">还没有日志，写下第一篇吧！</p>
        </div>
      ) : (
        <div className="space-y-4">
          {journals.map((j) => (
            <JournalCard key={j.id} journal={j} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
