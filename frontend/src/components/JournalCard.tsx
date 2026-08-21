import { Link } from 'react-router-dom';
import type { Journal } from '../types';
import { MOOD_OPTIONS } from '../types';

interface Props {
  journal: Journal;
  onDelete?: (id: number) => void;
}

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

export default function JournalCard({ journal, onDelete }: Props) {
  const preview = journal.content.length > 150
    ? journal.content.slice(0, 150) + '...'
    : journal.content;

  return (
    <div className="card animate-slide-up group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            {journal.mood && (
              <>
                <span className="text-lg">{getMoodEmoji(journal.mood)}</span>
                <span className="badge-accent">{journal.mood}</span>
              </>
            )}
            <span className="text-white/30 text-xs ml-auto">
              {formatDate(journal.createdAt)}
            </span>
          </div>
          <Link to={`/journal/${journal.id}`}>
            <h3 className="text-lg font-display font-semibold text-white mb-2 hover:text-primary transition-colors">
              {journal.title}
            </h3>
          </Link>
          <p className="text-white/50 text-sm leading-relaxed whitespace-pre-wrap">
            {preview}
          </p>
          <Link
            to={`/journal/${journal.id}`}
            className="inline-block mt-3 text-primary/60 text-sm hover:text-primary transition-colors"
          >
            阅读全文 →
          </Link>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(journal.id)}
            className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-danger transition-all duration-300 p-1"
            title="删除"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
