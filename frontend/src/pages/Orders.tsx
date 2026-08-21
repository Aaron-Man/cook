import { useState, useEffect } from 'react';
import { orderApi } from '../api/client';
import type { Order } from '../types';
import { ORDER_STATUS_MAP } from '../types';
import OrderCard from '../components/OrderCard';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  const fetchOrders = async () => {
    try {
      const data = await orderApi.getAll();
      setOrders(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id: number, status: Order['status']) => {
    try {
      await orderApi.updateStatus(id, status);
      fetchOrders();
    } catch { /* ignore */ }
  };

  const filteredOrders = filter
    ? orders.filter((o) => o.status === filter)
    : orders;

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    cooking: orders.filter((o) => o.status === 'cooking').length,
    done: orders.filter((o) => o.status === 'done').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  return (
    <div className="page-container">
      <h1 className="section-title">☰ 订单记录</h1>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilter('')}
          className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
            !filter ? 'bg-primary/10 border border-primary/50 text-primary' : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
          }`}
        >
          全部 ({statusCounts.all})
        </button>
        {(Object.entries(ORDER_STATUS_MAP) as [string, { label: string }][]).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
              filter === key ? 'bg-primary/10 border border-primary/50 text-primary' : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            {val.label} ({statusCounts[key as keyof typeof statusCounts] || 0})
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40">加载中...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-white/40">
            {filter ? '该状态暂无订单' : '还没有订单，去菜单页面点一道菜吧！'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}
