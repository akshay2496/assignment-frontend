import React, { useState } from 'react';
import { Calendar, RefreshCw, Filter } from 'lucide-react';

export default function DateFilter({
  currentRange,
  customDates,
  onRangeChange,
  onCustomDatesChange,
  onRefresh,
  autoRefresh,
  onToggleAutoRefresh,
  loading
}) {
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const ranges = [
    { id: 'today', label: 'Today' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: 'custom', label: 'Custom Range' }
  ];

  const handleSelectRange = (rangeId) => {
    if (rangeId === 'custom') {
      setShowCustomPicker(true);
    } else {
      setShowCustomPicker(false);
    }
    onRangeChange(rangeId);
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
      {/* Range Pills */}
      <div className="flex items-center space-x-1.5 flex-wrap gap-y-2">
        <div className="flex items-center text-slate-400 mr-2 text-xs font-semibold">
          <Filter className="w-3.5 h-3.5 mr-1 text-slate-500" />
          <span>Filter:</span>
        </div>
        {ranges.map((r) => {
          const isActive = currentRange === r.id;
          return (
            <button
              key={r.id}
              onClick={() => handleSelectRange(r.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      {/* Custom Date Pickers */}
      {(currentRange === 'custom' || showCustomPicker) && (
        <div className="flex items-center space-x-2 text-xs">
          <input
            type="date"
            value={customDates.startDate ? customDates.startDate.split('T')[0] : ''}
            onChange={(e) =>
              onCustomDatesChange({
                ...customDates,
                startDate: e.target.value ? new Date(e.target.value).toISOString() : ''
              })
            }
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={customDates.endDate ? customDates.endDate.split('T')[0] : ''}
            onChange={(e) =>
              onCustomDatesChange({
                ...customDates,
                endDate: e.target.value ? new Date(e.target.value + 'T23:59:59.999Z').toISOString() : ''
              })
            }
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      )}

      {/* Refresh & Auto-Refresh */}
      <div className="flex items-center space-x-3 text-xs">
        <label className="flex items-center space-x-2 cursor-pointer text-slate-600 select-none">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => onToggleAutoRefresh(e.target.checked)}
            className="rounded text-orange-600 focus:ring-orange-500 w-3.5 h-3.5"
          />
          <span>Auto-refresh (5s)</span>
        </label>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
}
