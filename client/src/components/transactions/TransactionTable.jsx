import { formatCurrency, formatDate } from '../../utils/formatters';
import EmptyState from '../common/EmptyState';

const TransactionTable = ({ transactions, onEdit, onDelete }) => {
  if (!transactions.length) {
    return (
      <div className="card">
        <EmptyState
          icon="💸"
          title="No transactions found"
          description="Try adjusting your filters or add a new transaction"
        />
      </div>
    );
  }

  return (
    <div className="card p-0 overflow-hidden">
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                Transaction
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">
                Category
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">
                Date
              </th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">
                Amount
              </th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((tx) => (
              <tr key={tx._id} className="hover:bg-gray-50 transition-colors group">

                {/* Title + type badge */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${tx.category?.color}20` }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tx.category?.color || '#6366f1' }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{tx.title}</p>
                      {tx.note && (
                        <p className="text-xs text-gray-400 truncate max-w-[200px]">{tx.note}</p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-4">
                  <span className="text-xs font-medium bg-gray-100 text-gray-600
                    px-2.5 py-1 rounded-full">
                    {tx.category?.name || 'Uncategorized'}
                  </span>
                </td>

                {/* Date */}
                <td className="px-4 py-4 text-sm text-gray-500">
                  {formatDate(tx.date)}
                </td>

                {/* Amount */}
                <td className="px-4 py-4 text-right">
                  <span className={`text-sm font-bold ${
                    tx.type === 'income' ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2
                    opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(tx)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg
                        text-primary-600 hover:bg-primary-50 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(tx)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg
                        text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden divide-y divide-gray-100">
        {transactions.map((tx) => (
          <div key={tx._id} className="p-4 flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${tx.category?.color}20` }}
            >
              <div
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: tx.category?.color || '#6366f1' }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{tx.title}</p>
              <p className="text-xs text-gray-400">
                {tx.category?.name} · {formatDate(tx.date)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`text-sm font-bold ${
                tx.type === 'income' ? 'text-green-600' : 'text-red-500'
              }`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </span>
              <div className="flex gap-1">
                <button onClick={() => onEdit(tx)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg
                    text-primary-600 hover:bg-primary-50">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button onClick={() => onDelete(tx)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg
                    text-red-500 hover:bg-red-50">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionTable;