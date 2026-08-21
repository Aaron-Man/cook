import { useState, useEffect } from 'react';
import { dishApi, orderApi, categoryApi } from '../api/client';
import type { Dish } from '../types';
import DishCard from '../components/DishCard';

export default function MenuPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [orderModal, setOrderModal] = useState<Dish | null>(null);
  const [orderNote, setOrderNote] = useState('');
  const [ordering, setOrdering] = useState(false);

  const fetchData = async () => {
    try {
      const [dishData, catData] = await Promise.all([
        dishApi.getAll(),
        categoryApi.getAll(),
      ]);
      setDishes(dishData);
      setCategories(catData);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredDishes = selectedCategory
    ? dishes.filter((d) => d.category === selectedCategory)
    : dishes;

  const handleOrder = async () => {
    if (!orderModal) return;
    setOrdering(true);
    try {
      await orderApi.create({
        dishId: orderModal.id,
        note: orderNote.trim() || undefined,
      });
      setOrderModal(null);
      setOrderNote('');
      alert('点菜成功！🎉');
    } catch {
      alert('点菜失败，请重试');
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="section-title">◈ 菜单</h1>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('')}
            className={`
              px-4 py-2 rounded-full text-sm transition-all duration-300
              ${!selectedCategory
                ? 'bg-primary/10 border border-primary/50 text-primary'
                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
              }
            `}
          >
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-4 py-2 rounded-full text-sm transition-all duration-300
                ${selectedCategory === cat
                  ? 'bg-primary/10 border border-primary/50 text-primary'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Dish Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40">加载中...</p>
        </div>
      ) : filteredDishes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">🍽️</p>
          <p className="text-white/40">
            {selectedCategory ? '该分类暂无菜品' : '菜单还是空的，去管理页面添加菜品吧！'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} onOrder={setOrderModal} />
          ))}
        </div>
      )}

      {/* Order Modal */}
      {orderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOrderModal(null)} />
          <div className="relative glass neon-border p-6 rounded-2xl max-w-md w-full animate-slide-up">
            <h3 className="text-xl font-display font-bold text-white mb-4">
              确认点菜
            </h3>
            <div className="mb-4">
              <p className="text-primary text-lg font-semibold">{orderModal.name}</p>
              <p className="text-white/40 text-sm">{orderModal.category} · 难度 {'★'.repeat(orderModal.difficulty)}</p>
            </div>
            <textarea
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="备注（可选）：比如不要辣、多加点葱..."
              className="input-field mb-4 min-h-[80px] resize-none"
            />
            <div className="flex gap-3">
              <button onClick={handleOrder} disabled={ordering} className="btn-primary flex-1">
                {ordering ? '提交中...' : '确认点菜 🎉'}
              </button>
              <button onClick={() => { setOrderModal(null); setOrderNote(''); }} className="btn-danger">
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
