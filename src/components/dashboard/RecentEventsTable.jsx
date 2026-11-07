import React, { useState } from 'react';
import { Activity, Globe, Server, ChevronDown, ChevronUp } from 'lucide-react';

export default function RecentEventsTable({ events = [], loading = false }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const getBadgeStyle = (name) => {
    switch (name) {
      case 'page_view':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'menu_item_viewed':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'add_to_cart':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'remove_from_cart':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'checkout_started':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'order_created':
      case 'order_completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Live Ingested Events Stream</h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time raw events persisted in MySQL database</p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Live Ingestion Active</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Event Name</th>
              <th className="py-3 px-4">Source</th>
              <th className="py-3 px-4">Page URL</th>
              <th className="py-3 px-4">Visitor ID</th>
              <th className="py-3 px-4 text-right">Properties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              [1, 2, 3, 4].map((n) => (
                <tr key={n} className="animate-pulse">
                  <td colSpan={6} className="py-4 px-4">
                    <div className="h-4 bg-slate-100 rounded"></div>
                  </td>
                </tr>
              ))
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  No events received yet. Switch to the Restaurant Demo tab and interact with menu items!
                </td>
              </tr>
            ) : (
              events.map((evt) => {
                const isExpanded = expandedRow === evt.id;
                const formattedTime = new Date(evt.timestamp).toLocaleTimeString();
                const isServer = evt.event_source === 'server';

                return (
                  <React.Fragment key={evt.id}>
                    <tr
                      onClick={() => setExpandedRow(isExpanded ? null : evt.id)}
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {formattedTime}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-semibold border text-[11px] ${getBadgeStyle(
                            evt.event_name
                          )}`}
                        >
                          {evt.event_name}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                            isServer ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {isServer ? <Server className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                          <span>{evt.event_source}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700 truncate max-w-xs">
                        {evt.page_url || '-'}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 truncate max-w-[120px]">
                        {evt.visitor_id}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-slate-400 hover:text-slate-600 inline-flex items-center">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-slate-50/60">
                        <td colSpan={6} className="py-3 px-4">
                          <div className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
                            <pre>{JSON.stringify(evt.event_properties, null, 2)}</pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
