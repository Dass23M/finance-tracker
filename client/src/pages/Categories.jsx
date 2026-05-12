import { useState }                          from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast                                 from 'react-hot-toast';

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../api/categoryApi';

import Modal          from '../components/common/Modal';
import ConfirmDialog  from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState     from '../components/common/EmptyState';
import CategoryForm   from '../components/categories/CategoryForm';
import CategoryCard   from '../components/categories/CategoryCard';

const Categories = () => {
  const queryClient = useQueryClient();

  const [activeTab,      setActiveTab]      = useState('expense');
  const [modalOpen,      setModalOpen]      = useState(false);
  const [editingCat,     setEditingCat]     = useState(null);
  const [deletingCat,    setDeletingCat]    = useState(null);
  const [confirmOpen,    setConfirmOpen]    = useState(false);

  // ── Fetch ─────────────────────────────────────────
  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories', activeTab],
    queryFn:  () => getCategories({ type: activeTab }),
  });

  const categories = data?.data?.categories || [];

  // ── Create ────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
      setModalOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create category');
    },
  });

  // ── Update ────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
      setModalOpen(false);
      setEditingCat(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update category');
    },
  });

  // ── Delete ────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted');
      setConfirmOpen(false);
      setDeletingCat(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    },
  });

  // ── Handlers ──────────────────────────────────────
  const handleSubmit = (formData) => {
    if (editingCat) {
      updateMutation.mutate({
        id:   editingCat._id,
        data: { name: formData.name, color: formData.color, icon: formData.icon },
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (cat) => {
    setEditingCat(cat);
    setModalOpen(true);
  };

  const handleDelete = (cat) => {
    setDeletingCat(cat);
    setConfirmOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingCat(null);
  };

  const defaultCount = categories.filter((c) => c.isDefault).length;
  const customCount  = categories.filter((c) => !c.isDefault).length;

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Categories</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {categories.length
              ? `${defaultCount} default · ${customCount} custom`
              : 'Organize your transactions'}
          </p>
        </div>
        <button
          onClick={() => { setEditingCat(null); setModalOpen(true); }}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Category
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 w-fit gap-1">
        {[
          { value: 'expense', label: '💸 Expense' },
          { value: 'income',  label: '💰 Income'  },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-primary-50 border border-primary-100
        text-primary-700 px-4 py-3 rounded-2xl text-sm">
        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>
          Default categories are created automatically and cannot be deleted.
          You can edit their name and color, or add your own custom categories.
        </p>
      </div>

      {/* Category list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner size="lg" text="Loading categories..." />
        </div>
      ) : isError ? (
        <div className="card text-center py-12">
          <p className="text-red-500 font-medium">Failed to load categories.</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="🏷️"
            title={`No ${activeTab} categories`}
            description="Create a category to organize your transactions"
            action={
              <button
                onClick={() => setModalOpen(true)}
                className="btn-primary flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Category
              </button>
            }
          />
        </div>
      ) : (
        <div className="space-y-6">

          {/* Default categories */}
          {defaultCount > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Default Categories ({defaultCount})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {categories
                  .filter((c) => c.isDefault)
                  .map((cat) => (
                    <CategoryCard
                      key={cat._id}
                      category={cat}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Custom categories */}
          {customCount > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Custom Categories ({customCount})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {categories
                  .filter((c) => !c.isDefault)
                  .map((cat) => (
                    <CategoryCard
                      key={cat._id}
                      category={cat}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title={editingCat ? 'Edit Category' : 'New Category'}
      >
        <CategoryForm
          onSubmit={handleSubmit}
          initialData={editingCat}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setDeletingCat(null); }}
        onConfirm={() => deleteMutation.mutate(deletingCat?._id)}
        isLoading={deleteMutation.isPending}
        title="Delete Category"
        message={`Delete "${deletingCat?.name}"? Any transactions using this category will lose their category reference.`}
      />
    </div>
  );
};

export default Categories;