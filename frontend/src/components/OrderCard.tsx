import type { Order } from '../types';
import { ORDER_STATUS_MAP } from '../types';

interface Props {
  order: Order;
  onStatusChange?: (id: number, status: Order['status']) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderCard({ order, onStatusChange }: Props) {
  const statusInfo = ORDER_STATUS_MAP[order.status];

  return (
    <div className="card animate-slide-up">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-display font-semibold text-white">
              {order.dish.name}
            </h3>
            <span className={statusInfo.className}>{statusInfo.label}</span>
          </div>
          {order.note && (
            <p className="text-white/40 text-sm mb-2">
              <span className="text-white/60">备注：</span>{order.note}
            </p>
          )}
          <div className="flex items-center gap-4 text-white/30 text-xs">
            <span>📂 {order.dish.category}</span>
            <span>🕐 {formatDate(order.createdAt)}</span>
          </div>
        </div>

        {/* Status Actions */}
        {onStatusChange && order.status !== 'done' && order.status !== 'cancelled' && (
          <div className="flex gap-2">
            {order.status === 'pending' && (
              <button
                onClick={() => onStatusChange(order.id, 'cooking')}
                className="btn-primary text-xs px-3 py-1.5"
              >
                开始做
              </button>
            )}
            {order.status === 'cooking' && (
              <button
                onClick={() => onStatusChange(order.id, 'done')}
                className="btn-primary text-xs px-3 py-1.5"
              >
                完成了
              </button>
            )}
            <button
              onClick={() => onStatusChange(order.id, 'cancelled')}
              className="btn-danger text-xs px-3 py-1.5"
            >
              取消
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
