import Modal from './Modal';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title       = 'Confirm Delete',
  message     = 'Are you sure you want to delete this? This action cannot be undone.',
  confirmText = 'Delete',
  isLoading   = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-gray-600 text-sm mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-secondary" disabled={isLoading}>
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600
            text-white font-medium py-2.5 px-4 rounded-xl transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;