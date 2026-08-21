import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { journalApi } from '../api/client';
import type { Journal } from '../types';
import { MOOD_OPTIONS } from '../types';

function getMoodEmoji(mood: string | null): string {
  if (!mood) return '';
  const found = MOOD_OPTIONS.find((m) => m.label === mood);
  return found ? found.emoji : '';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function JournalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [journal, setJournal] = useState<Journal | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');

  useEffect(() => {
    if (!id) return;
    journalApi.getById(Number(id))
      .then((j) => {
        setJournal(j);
        setTitle(j.title);
        setContent(j.content);
        setMood(j.mood || '');
      })
      .catch(() => navigate('/journal'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSave = async () => {
    if (!journal || !title.trim() || !content.trim()) return;
    try {
      const updated = await journalApi.update(journal.id, {
        title: title.trim(),
        content: content.trim(),
        mood: mood || undefined,
      });
      setJournal(updated);
      setEditing(false);
    } catch { /* ignore */ }
  };

  const handleDelete = async () => {
    if (!journal || !confirm('确定删除这篇日志？')) return;
    try {
      await journalApi.delete(journal.id);
      navigate('/journal');
    } catch { /* ignore */ }
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!journal) return null;

  return (
    <div className="page-container max-w-3xl">
      <Link to="/journal" className="text-primary/60 text-sm hover:text-primary transition-colors mb-6 inline-block">
        ← 返回日志列表
      </Link>

      <article className="card animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          {journal.mood && (
            <>
              <span className="text-2xl">{getMoodEmoji(journal.mood)}</span>
              <span className="badge-accent">{journal.mood}</span>
            </>
          )}
          <span className="text-white/30 text-sm ml-auto">
            {formatDate(journal.createdAt)}
          </span>
        </div>

        {editing ? (
          <>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field mb-4 text-xl font-display font-bold"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-field mb-4 min-h-[300px] resize-y"
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
            <div className="flex gap-3">
              <button onClick={handleSave} className="btn-primary">保存修改</button>
              <button onClick={() => setEditing(false)} className="btn-danger">取消</button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
              {journal.title}
            </h1>
            <div className="text-white/70 leading-relaxed whitespace-pre-wrap mb-8">
              {journal.content}
            </div>
            {journal.updatedAt !== journal.createdAt && (
              <p className="text-white/20 text-xs mb-4">
                最后编辑于 {formatDate(journal.updatedAt)}
              </p>
            )}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button onClick={() => setEditing(true)} className="btn-primary text-sm">
                编辑
              </button>
              <button onClick={handleDelete} className="btn-danger text-sm">
                删除
              </button>
            </div>
          </>
        )}
      </article>
    </div>
  );
}
