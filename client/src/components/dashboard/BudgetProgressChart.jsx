import { formatCurrency } from '../../utils/formatters';
import EmptyState from '../common/EmptyState';

const BudgetProgressBar = ({ budget }) => {
  const { category, limit, spent, remaining, percentage, isExceeded } = budget;

  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: category?.color || '#6366f1' }}
          />
          <span className="text-sm font-medium text-gray-700">{category?.name}</span>
          {isExceeded && (
            <span className="text-xs font-semibold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
              Over budget
            </span>
          )}
        </div>
        <span className="text-sm font-semibold text-gray-800">
          {percentage}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${
            isExceeded   ? 'bg-red-500'    :
            percentage >= 80 ? 'bg-amber-500' : 'bg-primary-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Amount row */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>Spent: <span className="text-gray-600 font-medium">{formatCurrency(spent)}</span></span>
        <span>Limit: <span className="text-gray-600 font-medium">{formatCurrency(limit)}</span></span>
      </div>
    </div>
  );
};

const BudgetProgressChart = ({ data = [] }) => {
  if (!data.length) {
    return (
      <EmptyState
        icon="🎯"
        title="No budgets set"
        description="Create budgets to track your spending limits"
      />
    );
  }

  return (
    <div className="space-y-5">
      {data.map((budget) => (
        <BudgetProgressBar key={budget.budgetId} budget={budget} />
      ))}
    </div>
  );
};

export default BudgetProgressChart;