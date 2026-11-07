import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function TrafficChart({ data = [], loading = false }) {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 h-96 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading traffic trends...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Traffic Trends & Visitors Over Time</h3>
          <p className="text-xs text-slate-500 mt-0.5">Daily breakdown of page views, unique visitors, and total events</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-72 flex items-center justify-center text-slate-400 text-sm">
          No traffic data recorded in this date range. Perform actions in the Restaurant tab to generate events!
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
              />
              <Area
                type="monotone"
                dataKey="page_views"
                name="Page Views"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorPageViews)"
              />
              <Area
                type="monotone"
                dataKey="unique_visitors"
                name="Unique Visitors"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorVisitors)"
              />
              <Area
                type="monotone"
                dataKey="total_events"
                name="Total Events"
                stroke="#8b5cf6"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
