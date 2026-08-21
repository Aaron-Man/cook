import type { Dish } from '../types';
import { DIFFICULTY_LABELS } from '../types';

interface Props {
  dish: Dish;
  onOrder?: (dish: Dish) => void;
  onDelete?: (id: number) => void;
}

export default function DishCard({ dish, onOrder, onDelete }: Props) {
  return (
    <div className="card animate-slide-up group flex flex-col">
      {/* Image or Placeholder */}
      <div className="relative -mx-6 -mt-6 mb-4 h-40 rounded-t-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
        {dish.imageUrl ? (
          <img
            src={dish.imageUrl}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🍽️
          </div>
        )}
        {!dish.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white/60 font-display text-sm">暂不可点</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge-primary">{dish.category}</span>
          <span className="text-white/30 text-xs">
            {'★'.repeat(dish.difficulty)}{'☆'.repeat(5 - dish.difficulty)}
          </span>
        </div>
        <h3 className="text-lg font-display font-semibold text-white mb-1">
          {dish.name}
        </h3>
        {dish.description && (
          <p className="text-white/40 text-sm mb-3 line-clamp-2">
            {dish.description}
          </p>
        )}
        {dish.ingredients && (
          <p className="text-white/30 text-xs mb-3">
            <span className="text-white/50">食材：</span>{dish.ingredients}
          </p>
        )}
        <div className="text-white/30 text-xs">
          难度：{DIFFICULTY_LABELS[dish.difficulty] || dish.difficulty}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        {onOrder && dish.available && (
          <button onClick={() => onOrder(dish)} className="btn-primary flex-1 text-sm text-center">
            点这道菜
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(dish.id)}
            className="opacity-0 group-hover:opacity-100 px-3 py-2 text-white/20 hover:text-danger border border-white/10 hover:border-danger/50 rounded-xl transition-all duration-300"
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
