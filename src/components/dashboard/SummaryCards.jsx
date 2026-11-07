import React from 'react';
import { Eye, Users, Activity, ShoppingBag, ArrowUpRight } from 'lucide-react';

export default function SummaryCards({ summary = {}, loading = false }) {
  const cards = [
    {
      title: 'Total Page Views',
      value: summary.total_page_views || 0,
      icon: Eye,
      color: 'blue',
      description: 'Total browser page impressions'
    },
    {
      title: 'Unique Visitors',
      value: summary.unique_visitors || 0,
      icon: Users,
      color: 'emerald',
      description: 'Distinct client devices (visitor_id)'
    },
    {
      title: 'Total Events',
      value: summary.total_events || 0,
      icon: Activity,
      color: 'purple',
      description: 'All captured browser & server events'
    },
    {
      title: 'Total Orders',
      value: summary.total_orders || 0,
      icon: ShoppingBag,
      color: 'orange',
      description: 'Completed orders in restaurant'
    }
  ];

  const colorStyles = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-700'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      badge: 'bg-emerald-100 text-emerald-700'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      badge: 'bg-purple-100 text-purple-700'
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      badge: 'bg-orange-100 text-orange-700'
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const style = colorStyles[card.color];

        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`w-10 h-10 rounded-xl ${style.bg} ${style.text} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4">
              {loading ? (
                <div className="h-8 bg-slate-200 rounded animate-pulse w-24"></div>
              ) : (
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                  {card.value.toLocaleString()}
                </h3>
              )}
              <p className="text-xs text-slate-400 mt-1">{card.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
