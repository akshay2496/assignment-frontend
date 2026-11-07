import React, { useState, useEffect, useCallback } from 'react';
import SummaryCards from './SummaryCards.jsx';
import TrafficChart from './TrafficChart.jsx';
import EventBreakdownChart from './EventBreakdownChart.jsx';
import PopularPagesChart from './PopularPagesChart.jsx';
import RecentEventsTable from './RecentEventsTable.jsx';
import DateFilter from './DateFilter.jsx';
import api from '../../services/api.js';

export default function DashboardView() {
  const [range, setRange] = useState('30d');
  const [customDates, setCustomDates] = useState({
    startDate: '',
    endDate: ''
  });
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({});
  const [trends, setTrends] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [popularPages, setPopularPages] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [error, setError] = useState(null);

  // Compute startDate & endDate based on active range
  const getDateParams = useCallback(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const start = new Date();
    if (range === 'today') {
      start.setHours(0, 0, 0, 0);
    } else if (range === '7d') {
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
    } else if (range === '30d') {
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
    } else if (range === 'custom') {
      if (customDates.startDate && customDates.endDate) {
        return {
          startDate: customDates.startDate,
          endDate: customDates.endDate,
          websiteId: 'restaurant-demo'
        };
      }
    }

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      websiteId: 'restaurant-demo'
    };
  }, [range, customDates]);

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = getDateParams();

      const [summaryRes, trendsRes, breakdownRes, pagesRes, recentRes] = await Promise.all([
        api.getSummary(params),
        api.getTrafficTrends(params),
        api.getEventBreakdown(params),
        api.getPopularPages({ ...params, limit: 10 }),
        api.getRecentEvents({ websiteId: 'restaurant-demo', limit: 20 })
      ]);

      setSummary(summaryRes.data || {});
      setTrends(trendsRes.data || []);
      setBreakdown(breakdownRes.data || []);
      setPopularPages(pagesRes.data || []);
      setRecentEvents(recentRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message || 'Error connecting to analytics backend.');
    } finally {
      setLoading(false);
    }
  }, [getDateParams]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchDashboardData]);

  return (
    <div className="space-y-6">
      <DateFilter
        currentRange={range}
        customDates={customDates}
        onRangeChange={setRange}
        onCustomDatesChange={setCustomDates}
        onRefresh={fetchDashboardData}
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={setAutoRefresh}
        loading={loading}
      />

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <SummaryCards summary={summary} loading={loading} />

      {/* Trends Chart */}
      <TrafficChart data={trends} loading={loading} />

      {/* Event Breakdown & Popular Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EventBreakdownChart data={breakdown} loading={loading} />
        <PopularPagesChart data={popularPages} loading={loading} />
      </div>

      {/* Ingestion Stream Table */}
      <RecentEventsTable events={recentEvents} loading={loading} />
    </div>
  );
}
