import { useEffect } from 'react';
import { useForm }   from 'react-hook-form';
import { useQuery }  from '@tanstack/react-query';
import { getCategories } from '../../api/categoryApi';
import { PERIODS, MONTHS } from '../../utils/constants';

const BudgetForm = ({ onSubmit, initialData, isLoading }) => {
  const currentYear  = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: initialData?.category?._id || initialData?.category || '',
      amount:   initialData?.amount   || '',
      period:   initialData?.period   || 'monthly',
      month:    initialData?.month    || currentMonth,
      year:     initialData?.year     || currentYear,
    },
  });

  useEffect(() => {
    reset({
      category: initialData?.category?._id || initialData?.category || '',
      amount:   initialData?.amount   || '',
      period:   initialData?.period   || 'monthly',
      month:    initialData?.month    || currentMonth,
      year:     initialData?.year     || currentYear,
    });
  }, [initialData, reset]);

  // Only expense categories can have budgets
  const { data } = useQuery({
    queryKey: ['categories', 'expense'],
    queryFn:  () => getCategories({ type: 'expense' }),
  });

  const categories = data?.data?.categories || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Category */}
      <div>
        <label className="label">Expense Category</label>
        <select
          className={`input-field ${errors.category ? 'input-error' : ''}`}
          disabled={!!initialData}
          {...register('category', { required: 'Category is required' })}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        {initialData && (
          <p className="text-xs text-gray-400 mt-1">
            Category cannot be changed after creation
          </p>
        )}
        {errors.category && (
          <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
        )}
      </div>

      {/* Budget amount */}
      <div>
        <label className="label">Budget Limit (LKR)</label>
        <input
          type="number"
          step="0.01"
          min="1"
          placeholder="e.g. 25000"
          className={`input-field ${errors.amount ? 'input-error' : ''}`}
          {...register('amount', {
            required: 'Budget amount is required',
            min:      { value: 1, message: 'Amount must be greater than 0' },
          })}
        />
        {errors.amount && (
          <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
        )}
      </div>

      {/* Period */}
      <div>
        <label className="label">Period</label>
        <select
          className="input-field"
          disabled={!!initialData}
          {...register('period')}
        >
          {PERIODS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* Month + Year row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Month</label>
          <select
            className="input-field"
            disabled={!!initialData}
            {...register('month')}
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Year</label>
          <select
            className="input-field"
            disabled={!!initialData}
            {...register('year')}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          initialData ? 'Update Budget' : 'Create Budget'
        )}
      </button>
    </form>
  );
};

export default BudgetForm;