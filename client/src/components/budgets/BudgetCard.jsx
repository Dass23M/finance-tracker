import { formatCurrency } from '../../utils/formatters';

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const {
    category,
    limit,
    spending,
    period,
    month,
    year,
  } = budget;

  const { spent, remaining, percentage, isExceeded } = spending;

  const progressColor =
    isExceeded        ? 'bg-red-500'    :
    percentage >= 80  ? 'bg-amber-500'  :
    percentage >= 50  ? 'bg-primary-500':
    'bg-green-500';

  const statusBadge =
    isExceeded       ? { text: 'Over Budget',  cls: 'bg-red-100    text-red-600'    } :
    percentage >= 80 ? { text: 'Near Limit',   cls: 'bg-amber-100  text-amber-600'  } :
    { text: 'On Track', cls: 'bg-green-100 text-green-700' };

  const monthName = new Date(year, month - 1, 1)
    .toLocaleString('default', { month: 'long' });

  return (
    <div className={`card hover:shadow-md transition-shadow duration-200 ${
      isExceeded ? 'border-l-4 border-l-red-400' : ''
    }`}>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${category?.color}20` }}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: category?.color || '#6366f1' }}
            />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{category?.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5 capitalize">
              {period} · {monthName} {year}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge.cls}`}>
            {statusBadge.text}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Spent</span>
          <span className="font-semibold">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-700 ${progressColor}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Amount row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center bg-gray-50 rounded-xl p-2.5">
          <p className="text-xs text-gray-400">Spent</p>
          <p className="text-sm font-bold text-red-500 mt-0.5">
            {formatCurrency(spent)}
          </p>
        </div>
        <div className="text-center bg-gray-50 rounded-xl p-2.5">
          <p className="text-xs text-gray-400">Remaining</p>
          <p className={`text-sm font-bold mt-0.5 ${
            isExceeded ? 'text-red-500' : 'text-green-600'
          }`}>
            {isExceeded ? '-' : ''}{formatCurrency(remaining)}
          </p>
        </div>
        <div className="text-center bg-gray-50 rounded-xl p-2.5">
          <p className="text-xs text-gray-400">Limit</p>
          <p className="text-sm font-bold text-gray-700 mt-0.5">
            {formatCurrency(limit)}
          </p>
        </div>
      </div>

      {/* Exceeded warning */}
      {isExceeded && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 text-xs
          font-medium px-3 py-2 rounded-xl mb-4">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Exceeded by {formatCurrency(spent - limit)}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(budget)}
          className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        <button
          onClick={() => onDelete(budget)}
          className="btn-danger flex-1 flex items-center justify-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
};

export default BudgetCard;