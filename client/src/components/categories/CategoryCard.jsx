const CategoryCard = ({ category, onEdit, onDelete }) => {
  const { name, type, color, icon, isDefault } = category;

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border
      border-gray-100 hover:shadow-sm transition-shadow group">

      {/* Color icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}20` }}
      >
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
          {isDefault && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full
              font-medium flex-shrink-0">
              Default
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="text-xs font-medium capitalize px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${color}20`,
              color,
            }}
          >
            {type}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(category)}
          className="w-8 h-8 flex items-center justify-center rounded-lg
            text-primary-600 hover:bg-primary-50 transition-colors"
          title="Edit"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        {!isDefault && (
          <button
            onClick={() => onDelete(category)}
            className="w-8 h-8 flex items-center justify-center rounded-lg
              text-red-500 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;