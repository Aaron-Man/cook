import { useState, useEffect } from 'react';
import { statusApi } from '../api/client';
import type { Status } from '../types';
import { MOOD_OPTIONS } from '../types';
import StatusCard from '../components/StatusCard';

export default function StatusPage() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchStatuses = async () => {
    try {
      const data = await statusApi.getAll();
      setStatuses(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStatuses(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await statusApi.create({ content: content.trim(), mood: mood || undefined });
      setContent('');
      setMood('');
      setShowForm(false);
      fetchStatuses();
    } catch { /* ignore */ }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除这条状态？')) return;
    try {
      await statusApi.delete(id);
      fetchStatuses();
    } catch { /* ignore */ }
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title mb-0">◉ 状态</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '取消' : '+ 发布状态'}
        </button>
      </div>

      {/* New Status Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-8 animate-slide-up">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="此刻的心情..."
            className="input-field mb-4 min-h-[100px] resize-none"
            autoFocus
          />
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-white/40 text-sm">选择心情：</span>
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
          <button type="submit" disabled={submitting || !content.trim()} className="btn-primary">
            {submitting ? '发布中...' : '发布'}
          </button>
        </form>
      )}

      {/* Status List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40">加载中...</p>
        </div>
      ) : statuses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">🌟</p>
          <p className="text-white/40">还没有状态，发布第一条吧！</p>
        </div>
      ) : (
        <div className="space-y-4">
          {statuses.map((s) => (
            <StatusCard key={s.id} status={s} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
