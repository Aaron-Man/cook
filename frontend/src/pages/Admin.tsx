import { useState, useEffect } from 'react';
import { dishApi, statusApi, journalApi } from '../api/client';
import type { Dish } from '../types';
import { DIFFICULTY_LABELS } from '../types';
import DishCard from '../components/DishCard';

type Tab = 'dishes' | 'status' | 'journal';

export default function Admin() {
  const [tab, setTab] = useState<Tab>('dishes');

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'dishes', label: '菜品管理', icon: '🍳' },
    { key: 'status', label: '状态管理', icon: '◉' },
    { key: 'journal', label: '日志管理', icon: '✎' },
  ];

  return (
    <div className="page-container">
      <h1 className="section-title">⚙ 管理中心</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`
              px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300
              ${tab === t.key
                ? 'bg-primary/10 border border-primary/50 text-primary shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
              }
            `}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'dishes' && <DishManager />}
      {tab === 'status' && <StatusManager />}
      {tab === 'journal' && <JournalManager />}
    </div>
  );
}

// ============ Dish Manager ============

function DishManager() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', category: '', ingredients: '',
    difficulty: 1, imageUrl: '', available: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchDishes = async () => {
    try {
      const data = await dishApi.getAll();
      setDishes(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDishes(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category.trim()) return;
    setSubmitting(true);
    try {
      await dishApi.create({
        name: form.name.trim(),
        description: form.description.trim() || null,
        category: form.category.trim(),
        ingredients: form.ingredients.trim() || null,
        difficulty: form.difficulty,
        imageUrl: form.imageUrl.trim() || null,
        available: form.available,
      });
      setForm({ name: '', description: '', category: '', ingredients: '', difficulty: 1, imageUrl: '', available: true });
      setShowForm(false);
      fetchDishes();
    } catch { /* ignore */ }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除这道菜？')) return;
    try {
      await dishApi.delete(id);
      fetchDishes();
    } catch { /* ignore */ }
  };

  const toggleAvailable = async (dish: Dish) => {
    try {
      await dishApi.update(dish.id, { available: !dish.available });
      fetchDishes();
    } catch { /* ignore */ }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '取消' : '+ 添加菜品'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-8 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="菜名 *" className="input-field"
            />
            <input
              type="text" value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="分类 *（如：川菜、粤菜、甜点）" className="input-field"
            />
          </div>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="描述" className="input-field mb-4 min-h-[80px] resize-none"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text" value={form.ingredients}
              onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
              placeholder="食材（逗号分隔）" className="input-field"
            />
            <input
              type="text" value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="图片 URL（可选）" className="input-field"
            />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-white/40 text-sm">难度：</span>
            {[1, 2, 3, 4, 5].map((d) => (
              <button
                key={d} type="button"
                onClick={() => setForm({ ...form, difficulty: d })}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  form.difficulty === d
                    ? 'bg-primary/20 border border-primary/50 text-primary'
                    : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10'
                }`}
              >
                {DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox" checked={form.available}
              onChange={(e) => setForm({ ...form, available: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-white/60 text-sm">可点</span>
          </label>
          <button type="submit" disabled={submitting || !form.name.trim() || !form.category.trim()} className="btn-primary">
            {submitting ? '添加中...' : '添加菜品'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
        </div>
      ) : dishes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">🍳</p>
          <p className="text-white/40">还没有菜品，添加第一道菜吧！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map((dish) => (
            <div key={dish.id} className="relative">
              <DishCard dish={dish} onDelete={handleDelete} />
              <button
                onClick={() => toggleAvailable(dish)}
                className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs transition-all ${
                  dish.available
                    ? 'bg-success/20 text-success border border-success/30'
                    : 'bg-white/10 text-white/40 border border-white/20'
                }`}
              >
                {dish.available ? '可点' : '不可点'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ Status Manager ============

function StatusManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetch = async () => {
    try { setItems(await statusApi.getAll()); }
    catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await statusApi.create({ content: content.trim() });
      setContent('');
      fetch();
    } catch { /* ignore */ }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除？')) return;
    try { await statusApi.delete(id); fetch(); }
    catch { /* ignore */ }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="card mb-6">
        <textarea
          value={content} onChange={(e) => setContent(e.target.value)}
          placeholder="发布新状态..." className="input-field mb-3 min-h-[80px] resize-none"
        />
        <button type="submit" disabled={submitting || !content.trim()} className="btn-primary text-sm">
          {submitting ? '发布中...' : '发布'}
        </button>
      </form>
      {loading ? (
        <div className="text-center py-8"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" /></div>
      ) : items.length === 0 ? (
        <p className="text-center text-white/40 py-8">暂无状态</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="card flex items-start justify-between gap-4">
              <p className="text-white/70 text-sm flex-1">{item.content}</p>
              <button onClick={() => handleDelete(item.id)} className="text-white/20 hover:text-danger text-sm transition-colors">删除</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ Journal Manager ============

function JournalManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetch = async () => {
    try { setItems(await journalApi.getAll()); }
    catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      await journalApi.create({ title: title.trim(), content: content.trim() });
      setTitle(''); setContent('');
      fetch();
    } catch { /* ignore */ }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除？')) return;
    try { await journalApi.delete(id); fetch(); }
    catch { /* ignore */ }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="card mb-6">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="标题" className="input-field mb-3" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="内容..." className="input-field mb-3 min-h-[120px] resize-y" />
        <button type="submit" disabled={submitting || !title.trim() || !content.trim()} className="btn-accent text-sm">
          {submitting ? '保存中...' : '保存日志'}
        </button>
      </form>
      {loading ? (
        <div className="text-center py-8"><div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto" /></div>
      ) : items.length === 0 ? (
        <p className="text-center text-white/40 py-8">暂无日志</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="card flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm">{item.title}</h4>
                <p className="text-white/40 text-xs mt-1 line-clamp-2">{item.content}</p>
              </div>
              <button onClick={() => handleDelete(item.id)} className="text-white/20 hover:text-danger text-sm transition-colors">删除</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
