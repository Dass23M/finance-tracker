import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../api/statsApi';
import { formatCurrency, getCurrentMonthYear, getMonthName } from '../utils/formatters';
import { MONTHS } from '../utils/constants';

import StatCard             from '../components/common/StatCard';
import LoadingSpinner       from '../components/common/LoadingSpinner';
import ExpensePieChart      from '../components/dashboard/ExpensePieChart';
import MonthlyTrendChart    from '../components/dashboard/MonthlyTrendChart';
import BudgetProgressChart  from '../components/dashboard/BudgetProgressChart';
import RecentTransactions   from '../components/dashboard/RecentTransactions';

const Dashboard = () => {
  const { month: currentMonth, year: currentYear } = getCurrentMonthYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear,  setSelectedYear]  = useState(currentYear);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard', selectedMonth, selectedYear],
    queryFn:  () => getDashboardStats({ month: selectedMonth, year: selectedYear }),
  });

  const stats     = data?.data;
  const summary   = stats?.financialSummary;
  const yearRange = Array.from({ length: 5 }, (_, i) => currentYear - i);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-500 font-medium">Failed to load dashboard data.</p>
        <p className="text-gray-400 text-sm mt-1">Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Month / Year selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="input-field w-auto text-sm"
        >
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="input-field w-auto text-sm"
        >
          {yearRange.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <span className="text-sm text-gray-400">
          Showing {getMonthName(selectedMonth)} {selectedYear}
        </span>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Income"
          value={formatCurrency(summary?.income || 0)}
          subtitle={`${summary?.incomeCount || 0} transactions`}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          }
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(summary?.expense || 0)}
          subtitle={`${summary?.expenseCount || 0} transactions`}
          color="red"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          }
        />
        <StatCard
          title="Net Balance"
          value={formatCurrency(summary?.balance || 0)}
          subtitle="Income minus expenses"
          color={summary?.balance >= 0 ? 'primary' : 'red'}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Active Budgets"
          value={stats?.budgetOverview?.length || 0}
          subtitle={`${stats?.budgetOverview?.filter((b) => b.isExceeded).length || 0} exceeded`}
          color="amber"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* ── Charts Row 1: Pie + Monthly Trend ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Expense by Category */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900">Expense by Category</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {getMonthName(selectedMonth)} {selectedYear}
              </p>
            </div>
            <span className="text-xs bg-red-50 text-red-500 font-medium px-3 py-1 rounded-full">
              {stats?.categoryBreakdown?.length || 0} categories
            </span>
          </div>
          <ExpensePieChart data={stats?.categoryBreakdown || []} />
        </div>

        {/* Monthly Income vs Expense */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900">Monthly Trend</h2>
              <p className="text-xs text-gray-400 mt-0.5">Income vs expenses {selectedYear}</p>
            </div>
            <span className="text-xs bg-primary-50 text-primary-600 font-medium px-3 py-1 rounded-full">
              {selectedYear}
            </span>
          </div>
          <MonthlyTrendChart data={stats?.monthlyTrend || []} />
        </div>
      </div>

      {/* ── Charts Row 2: Budget Progress + Recent Transactions ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Budget vs Actual */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900">Budget vs Actual</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {getMonthName(selectedMonth)} spending limits
              </p>
            </div>
            {stats?.budgetOverview?.some((b) => b.isExceeded) && (
              <span className="text-xs bg-red-50 text-red-500 font-semibold px-3 py-1 rounded-full animate-pulse">
                ⚠ Over budget
              </span>
            )}
          </div>
          <BudgetProgressChart data={stats?.budgetOverview || []} />
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900">Recent Transactions</h2>
              <p className="text-xs text-gray-400 mt-0.5">Your latest 5 activities</p>
            </div>
          </div>
          <RecentTransactions transactions={stats?.recentTransactions || []} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;