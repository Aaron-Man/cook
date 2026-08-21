export interface Status {
  id: number;
  content: string;
  mood: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Journal {
  id: number;
  title: string;
  content: string;
  mood: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Dish {
  id: number;
  name: string;
  description: string | null;
  category: string;
  ingredients: string | null;
  difficulty: number;
  imageUrl: string | null;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  dishId: number;
  dish: Dish;
  note: string | null;
  status: 'pending' | 'cooking' | 'done' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = Order['status'];

export const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: '待处理', className: 'badge-warning' },
  cooking: { label: '烹饪中', className: 'badge-primary' },
  done: { label: '已完成', className: 'badge-success' },
  cancelled: { label: '已取消', className: 'badge-danger' },
};

export const MOOD_OPTIONS = [
  { emoji: '😊', label: '开心' },
  { emoji: '🥰', label: '甜蜜' },
  { emoji: '😋', label: '嘴馋' },
  { emoji: '😴', label: '慵懒' },
  { emoji: '🤔', label: '思考' },
  { emoji: '😤', label: '生气' },
  { emoji: '🥺', label: '委屈' },
  { emoji: '🎉', label: '庆祝' },
];

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: '简单',
  2: '较易',
  3: '中等',
  4: '较难',
  5: '困难',
};
