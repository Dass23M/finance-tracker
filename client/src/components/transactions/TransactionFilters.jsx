import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../api/categoryApi';
import { TRANSACTION_TYPES } from '../../utils/constants';

const TransactionFilters = ({ filters, onChange, onReset }) => {
  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn:  () => getCategories(),
  });

  const categories = data?.data?.categories || [];

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  const hasActiveFilters =
    filters.type || filters.category || filters.startDate ||
    filters.endDate || filters.search;

  return (
    <div className="card space-y-4">

      {/* Search + Reset row */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
          </svg>
          <input
            type="text"
            placeholder="Search transactions..."
            className="input-field pl-10"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>
        {hasActiveFilters && (
          <button onClick={onReset} className="btn-secondary whitespace-nowrap flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

        {/* Type filter */}
        <select
          className="input-field text-sm"
          value={filters.type || ''}
          onChange={(e) => handleChange('type', e.target.value)}
        >
          <option value="">All Types</option>
          {TRANSACTION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        {/* Category filter */}
        <select
          className="input-field text-sm"
          value={filters.category || ''}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        {/* Start date */}
        <div>
          <input
            type="date"
            className="input-field text-sm"
            value={filters.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
        </div>

        {/* End date */}
        <div>
          <input
            type="date"
            className="input-field text-sm"
            value={filters.endDate || ''}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;