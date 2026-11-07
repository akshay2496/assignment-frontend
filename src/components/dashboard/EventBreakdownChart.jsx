import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

const COLORS = [
  '#f97316', // orange
  '#3b82f6', // blue
  '#10b981', // emerald
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#eab308'  // yellow
];

export default function EventBreakdownChart({ data = [], loading = false }) {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 h-80 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading event breakdown...</div>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d.event_name,
    value: d.count
  }));

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-slate-900 text-base">Event Distribution</h3>
        <p className="text-xs text-slate-500 mt-0.5">Share of user actions tracked across the application</p>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
          No event breakdown data available
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
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
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
