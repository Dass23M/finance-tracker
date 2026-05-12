import { useState }                          from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast                                 from 'react-hot-toast';

import { getBudgets, createBudget, updateBudget, deleteBudget } from '../api/budgetApi';
import { formatCurrency, getMonthName }      from '../utils/formatters';
import { MONTHS }                            from '../utils/constants';

import Modal          from '../components/common/Modal';
import ConfirmDialog  from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState     from '../components/common/EmptyState';
import BudgetForm     from '../components/budgets/BudgetForm';
import BudgetCard     from '../components/budgets/BudgetCard';

const Budgets = () => {
  const queryClient  = useQueryClient();
  const now          = new Date();

  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear,  setSelectedYear]  = useState(now.getFullYear());
  const [modalOpen,     setModalOpen]     = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deletingBudget,setDeletingBudget]= useState(null);
  const [confirmOpen,   setConfirmOpen]   = useState(false);

  const yearRange = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 1 + i);

  // ── Fetch ────────────────────────────────────────────
  const { data, isLoading, isError } = useQuery({
    queryKey: ['budgets', selectedMonth, selectedYear],
    queryFn:  () => getBudgets({ month: selectedMonth, year: selectedYear }),
  });

  const budgets = data?.data?.budgets  || [];
  const summary = data?.data?.summary  || {};

  // ── Create ───────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Budget created successfully');
      setModalOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create budget');
    },
  });

  // ── Update ───────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateBudget(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Budget updated successfully');
      setModalOpen(false);
      setEditingBudget(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update budget');
    },
  });

  // ── Delete ───────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Budget deleted');
      setConfirmOpen(false);
      setDeletingBudget(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete budget');
    },
  });

  // ── Handlers ─────────────────────────────────────────
  const handleSubmit = (formData) => {
    const payload = {
      ...formData,
      amount: Number(formData.amount),
      month:  Number(formData.month),
      year:   Number(formData.year),
    };
    if (editingBudget) {
      updateMutation.mutate({ id: editingBudget._id, data: { amount: payload.amount } });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setModalOpen(true);
  };

  const handleDelete = (budget) => {
    setDeletingBudget(budget);
    setConfirmOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingBudget(null);
  };

  const exceededCount = budgets.filter((b) => b.spending?.isExceeded).length;

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Budgets</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {budgets.length
              ? `${budgets.length} budgets · ${exceededCount} exceeded`
              : 'Set spending limits per category'}
          </p>
        </div>
        <button
          onClick={() => { setEditingBudget(null); setModalOpen(true); }}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Budget
        </button>
      </div>

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
          {getMonthName(selectedMonth)} {selectedYear}
        </span>
      </div>

      {/* Summary strip */}
      {budgets.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Budgeted',
              value: formatCurrency(summary.totalBudgeted || 0),
              color: 'text-primary-600',
              bg:    'bg-primary-50',
            },
            {
              label: 'Total Spent',
              value: formatCurrency(summary.totalSpent || 0),
              color: 'text-red-500',
              bg:    'bg-red-50',
            },
            {
              label: 'Total Remaining',
              value: formatCurrency(summary.totalRemaining || 0),
              color: 'text-green-600',
              bg:    'bg-green-50',
            },
            {
              label: 'Exceeded',
              value: `${exceededCount} budget${exceededCount !== 1 ? 's' : ''}`,
              color: exceededCount > 0 ? 'text-red-500' : 'text-gray-500',
              bg:    exceededCount > 0 ? 'bg-red-50'    : 'bg-gray-50',
            },
          ].map((item) => (
            <div key={item.label} className={`rounded-2xl px-4 py-3 ${item.bg}`}>
              <p className="text-xs text-gray-500 font-medium">{item.label}</p>
              <p className={`text-base font-bold mt-0.5 ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Exceeded alert banner */}
      {exceededCount > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200
          text-red-700 px-4 py-3 rounded-2xl text-sm font-medium">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {exceededCount} budget{exceededCount !== 1 ? 's have' : ' has'} exceeded their
          spending limit this month. Review your expenses.
        </div>
      )}

      {/* Budget cards grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner size="lg" text="Loading budgets..." />
        </div>
      ) : isError ? (
        <div className="card text-center py-12">
          <p className="text-red-500 font-medium">Failed to load budgets.</p>
        </div>
      ) : budgets.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="🎯"
            title="No budgets for this period"
            description="Create a budget to start tracking your spending limits"
            action={
              <button
                onClick={() => setModalOpen(true)}
                className="btn-primary flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create First Budget
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget._id}
              budget={budget}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title={editingBudget ? 'Edit Budget' : 'Create Budget'}
      >
        <BudgetForm
          onSubmit={handleSubmit}
          initialData={editingBudget}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setDeletingBudget(null); }}
        onConfirm={() => deleteMutation.mutate(deletingBudget?._id)}
        isLoading={deleteMutation.isPending}
        title="Delete Budget"
        message={`Delete the "${deletingBudget?.category?.name}" budget? This action cannot be undone.`}
      />
    </div>
  );
};

export default Budgets;