import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../api/transactionApi';

import Modal           from '../components/common/Modal';
import ConfirmDialog   from '../components/common/ConfirmDialog';
import LoadingSpinner  from '../components/common/LoadingSpinner';
import TransactionForm    from '../components/transactions/TransactionForm';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable   from '../components/transactions/TransactionTable';
import Pagination         from '../components/transactions/Pagination';
import { formatCurrency } from '../utils/formatters';

const defaultFilters = {
  type:      '',
  category:  '',
  startDate: '',
  endDate:   '',
  search:    '',
  page:      1,
  limit:     10,
  sortBy:    'date',
  order:     'desc',
};

const Transactions = () => {
  const queryClient = useQueryClient();

  const [filters,         setFilters]         = useState(defaultFilters);
  const [modalOpen,       setModalOpen]       = useState(false);
  const [editingTx,       setEditingTx]       = useState(null);
  const [deletingTx,      setDeletingTx]      = useState(null);
  const [confirmOpen,     setConfirmOpen]     = useState(false);

  // ── Fetch transactions ──────────────────────────────
  const { data, isLoading, isError } = useQuery({
    queryKey: ['transactions', filters],
    queryFn:  () => getTransactions(filters),
    keepPreviousData: true,
  });

  const transactions = data?.data?.transactions || [];
  const pagination   = data?.data?.pagination   || {};

  // ── Create ──────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Transaction added successfully');
      setModalOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add transaction');
    },
  });

  // ── Update ──────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Transaction updated successfully');
      setModalOpen(false);
      setEditingTx(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update transaction');
    },
  });

  // ── Delete ──────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Transaction deleted');
      setConfirmOpen(false);
      setDeletingTx(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete transaction');
    },
  });

  // ── Handlers ────────────────────────────────────────
  const handleSubmit = (formData) => {
    if (editingTx) {
      updateMutation.mutate({ id: editingTx._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (tx) => {
    setEditingTx(tx);
    setModalOpen(true);
  };

  const handleDelete = (tx) => {
    setDeletingTx(tx);
    setConfirmOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingTx(null);
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending;

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">All Transactions</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {pagination.total
              ? `${pagination.total} total transactions`
              : 'Manage your income and expenses'}
          </p>
        </div>
        <button
          onClick={() => { setEditingTx(null); setModalOpen(true); }}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <TransactionFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(defaultFilters)}
      />

      {/* Summary strip */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: 'Income',
              value: transactions
                .filter((t) => t.type === 'income')
                .reduce((s, t) => s + t.amount, 0),
              color: 'text-green-600',
            },
            {
              label: 'Expenses',
              value: transactions
                .filter((t) => t.type === 'expense')
                .reduce((s, t) => s + t.amount, 0),
              color: 'text-red-500',
            },
            {
              label: 'Net',
              value:
                transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0) -
                transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
              color: 'text-primary-600',
            },
          ].map((item) => (
            <div key={item.label} className="card py-4 text-center">
              <p className="text-xs text-gray-400 font-medium">{item.label}</p>
              <p className={`text-base font-bold mt-1 ${item.color}`}>
                {formatCurrency(Math.abs(item.value))}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Sort controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-gray-500">Sort by:</span>
        {[
          { key: 'date',   label: 'Date'   },
          { key: 'amount', label: 'Amount' },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                sortBy: s.key,
                order:  prev.sortBy === s.key && prev.order === 'desc' ? 'asc' : 'desc',
                page:   1,
              }))
            }
            className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg font-medium
              transition-colors ${
                filters.sortBy === s.key
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
          >
            {s.label}
            {filters.sortBy === s.key && (
              <span>{filters.order === 'desc' ? '↓' : '↑'}</span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="card flex items-center justify-center py-16">
          <LoadingSpinner size="lg" text="Loading transactions..." />
        </div>
      ) : isError ? (
        <div className="card text-center py-12">
          <p className="text-red-500 font-medium">Failed to load transactions.</p>
        </div>
      ) : (
        <>
          <TransactionTable
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <Pagination
            pagination={pagination}
            onChange={handlePageChange}
          />
        </>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title={editingTx ? 'Edit Transaction' : 'Add Transaction'}
      >
        <TransactionForm
          onSubmit={handleSubmit}
          initialData={editingTx}
          isLoading={isMutating}
        />
      </Modal>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setDeletingTx(null); }}
        onConfirm={() => deleteMutation.mutate(deletingTx?._id)}
        isLoading={deleteMutation.isPending}
        title="Delete Transaction"
        message={`Delete "${deletingTx?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Transactions;