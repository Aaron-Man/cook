import type { Status } from '../types';
import { MOOD_OPTIONS } from '../types';

interface Props {
  status: Status;
  onDelete?: (id: number) => void;
}

function getMoodEmoji(mood: string | null): string {
  if (!mood) return '';
  const found = MOOD_OPTIONS.find((m) => m.label === mood);
  return found ? found.emoji : '';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 7) return `${days} 天前`;
  return date.toLocaleDateString('zh-CN');
}

export default function StatusCard({ status, onDelete }: Props) {
  return (
    <div className="card animate-slide-up group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {status.mood && (
              <span className="text-xl" title={status.mood}>
                {getMoodEmoji(status.mood)}
              </span>
            )}
            {status.mood && (
              <span className="badge-accent">{status.mood}</span>
            )}
            <span className="text-white/30 text-xs ml-auto">
              {formatDate(status.createdAt)}
            </span>
          </div>
          <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
            {status.content}
          </p>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(status.id)}
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
