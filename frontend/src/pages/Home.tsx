import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { statusApi, journalApi, orderApi } from '../api/client';
import type { Status, Journal, Order } from '../types';
import StatusCard from '../components/StatusCard';

const greetings = [
  '欢迎回到我们的秘密基地',
  '今天也要开心哦',
  '想吃什么？点一道吧',
  '记录我们的每一天',
  '生活因你而精彩',
];

export default function Home() {
  const [greeting, setGreeting] = useState('');
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [recentJournals, setRecentJournals] = useState<Journal[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
    Promise.all([
      statusApi.getAll().then(setStatuses).catch(() => {}),
      journalApi.getAll().then((j) => setRecentJournals(j.slice(0, 3))).catch(() => {}),
      orderApi.getAll().then((o) => setRecentOrders(o.slice(0, 3))).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 font-body">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-gradient mb-6 animate-float">
          OUR SPACE
        </h1>
        <p className="text-xl md:text-2xl text-white/60 font-body mb-8 animate-fade-in">
          {greeting} ✨
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/menu" className="btn-primary">
            🍽️ 今天吃什么
          </Link>
          <Link to="/journal" className="btn-accent">
            ✎ 写日志
          </Link>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <div className="card text-center">
          <div className="text-3xl font-display font-bold neon-text mb-1">
            {statuses.length}
          </div>
          <div className="text-white/40 text-sm">条状态</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-display font-bold text-accent mb-1">
            {recentJournals.length > 0 ? '∞' : 0}
          </div>
          <div className="text-white/40 text-sm">篇日志</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-display font-bold text-success mb-1">
            {recentOrders.length}
          </div>
          <div className="text-white/40 text-sm">次点菜</div>
        </div>
      </section>

      {/* Latest Status */}
      {statuses.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title mb-0">最新动态</h2>
            <Link to="/status" className="text-primary/60 text-sm hover:text-primary transition-colors">
              查看全部 →
            </Link>
          </div>
          <div className="space-y-4">
            {statuses.slice(0, 3).map((s) => (
              <StatusCard key={s.id} status={s} />
            ))}
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link to="/menu" className="card group cursor-pointer">
          <div className="flex items-center gap-4">
            <span className="text-4xl group-hover:animate-bounce">🍳</span>
            <div>
              <h3 className="text-lg font-display font-semibold text-white group-hover:text-primary transition-colors">
                点菜系统
              </h3>
              <p className="text-white/40 text-sm">看看今天吃什么好吃的</p>
            </div>
          </div>
        </Link>
        <Link to="/orders" className="card group cursor-pointer">
          <div className="flex items-center gap-4">
            <span className="text-4xl group-hover:animate-bounce">📋</span>
            <div>
              <h3 className="text-lg font-display font-semibold text-white group-hover:text-primary transition-colors">
                订单记录
              </h3>
              <p className="text-white/40 text-sm">回顾每一次点菜的记忆</p>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}
