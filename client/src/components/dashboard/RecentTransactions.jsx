import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import EmptyState from '../common/EmptyState';

const RecentTransactions = ({ transactions = [] }) => {
  if (!transactions.length) {
    return (
      <EmptyState
        icon="💸"
        title="No transactions yet"
        description="Add your first transaction to get started"
      />
    );
  }

  return (
    <div className="space-y-1">
      {transactions.map((tx) => (
        <div
          key={tx._id}
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          {/* Category color dot */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${tx.category?.color}20` }}
          >
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: tx.category?.color || '#6366f1' }}
            />
          </div>

          {/* Title + category */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{tx.title}</p>
            <p className="text-xs text-gray-400 truncate">
              {tx.category?.name} · {formatRelativeTime(tx.date)}
            </p>
          </div>

          {/* Amount */}
          <span className={`text-sm font-bold flex-shrink-0 ${
            tx.type === 'income' ? 'text-green-600' : 'text-red-500'
          }`}>
            {tx.type === 'income' ? '+' : '-'}
            {formatCurrency(tx.amount)}
          </span>
        </div>
      ))}

      <Link
        to="/transactions"
        className="block text-center text-sm text-primary-600 font-medium
          hover:text-primary-700 pt-3 pb-1 hover:underline transition-colors"
      >
        View all transactions →
      </Link>
    </div>
  );
};

export default RecentTransactions;