import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function PopularPagesChart({ data = [], loading = false }) {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 h-80 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading popular pages...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-slate-900 text-base">Popular Pages</h3>
        <p className="text-xs text-slate-500 mt-0.5">Top visited routes and URLs by page view count</p>
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
          No page view data recorded yet
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis
                type="category"
                dataKey="page_url"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              />
              <Bar dataKey="views" name="Page Views" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              <Bar dataKey="unique_visitors" name="Unique Visitors" fill="#10b981" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
