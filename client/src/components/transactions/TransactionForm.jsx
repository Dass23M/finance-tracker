import { useEffect } from 'react';
import { useForm }   from 'react-hook-form';
import { useQuery }  from '@tanstack/react-query';
import { getCategories } from '../../api/categoryApi';
import { formatDateInput } from '../../utils/formatters';
import { TRANSACTION_TYPES } from '../../utils/constants';

const TransactionForm = ({ onSubmit, initialData, isLoading }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title:    initialData?.title    || '',
      amount:   initialData?.amount   || '',
      type:     initialData?.type     || 'expense',
      category: initialData?.category?._id || initialData?.category || '',
      date:     initialData?.date
        ? formatDateInput(initialData.date)
        : formatDateInput(new Date()),
      note:     initialData?.note || '',
    },
  });

  const selectedType = watch('type');

  // Reset form when initialData changes (switching between add/edit)
  useEffect(() => {
    reset({
      title:    initialData?.title    || '',
      amount:   initialData?.amount   || '',
      type:     initialData?.type     || 'expense',
      category: initialData?.category?._id || initialData?.category || '',
      date:     initialData?.date
        ? formatDateInput(initialData.date)
        : formatDateInput(new Date()),
      note:     initialData?.note || '',
    });
  }, [initialData, reset]);

  // Fetch categories filtered by selected type
  const { data: categoriesData } = useQuery({
    queryKey: ['categories', selectedType],
    queryFn:  () => getCategories({ type: selectedType }),
  });

  const categories = categoriesData?.data?.categories || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Title */}
      <div>
        <label className="label">Title</label>
        <input
          type="text"
          placeholder="e.g. Monthly Salary"
          className={`input-field ${errors.title ? 'input-error' : ''}`}
          {...register('title', {
            required:  'Title is required',
            maxLength: { value: 100, message: 'Title cannot exceed 100 characters' },
          })}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Amount + Type row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Amount (LKR)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            className={`input-field ${errors.amount ? 'input-error' : ''}`}
            {...register('amount', {
              required: 'Amount is required',
              min:      { value: 0.01, message: 'Amount must be greater than 0' },
            })}
          />
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label className="label">Type</label>
          <select
            className={`input-field ${errors.type ? 'input-error' : ''}`}
            {...register('type', { required: 'Type is required' })}
          >
            {TRANSACTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {errors.type && (
            <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="label">Category</label>
        <select
          className={`input-field ${errors.category ? 'input-error' : ''}`}
          {...register('category', { required: 'Category is required' })}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
        )}
      </div>

      {/* Date */}
      <div>
        <label className="label">Date</label>
        <input
          type="date"
          className={`input-field ${errors.date ? 'input-error' : ''}`}
          {...register('date', { required: 'Date is required' })}
        />
        {errors.date && (
          <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
        )}
      </div>

      {/* Note */}
      <div>
        <label className="label">Note <span className="text-gray-400 font-normal">(optional)</span></label>
        <textarea
          rows={2}
          placeholder="Add a note..."
          className="input-field resize-none"
          {...register('note', {
            maxLength: { value: 300, message: 'Note cannot exceed 300 characters' },
          })}
        />
        {errors.note && (
          <p className="text-red-500 text-xs mt-1">{errors.note.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            initialData ? 'Update Transaction' : 'Add Transaction'
          )}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;