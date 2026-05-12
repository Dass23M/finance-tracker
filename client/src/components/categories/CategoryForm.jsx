import { useEffect }  from 'react';
import { useForm }    from 'react-hook-form';
import { TRANSACTION_TYPES, CHART_COLORS } from '../../utils/constants';

const CategoryForm = ({ onSubmit, initialData, isLoading }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name:  initialData?.name  || '',
      type:  initialData?.type  || 'expense',
      color: initialData?.color || '#6366f1',
      icon:  initialData?.icon  || 'tag',
    },
  });

  useEffect(() => {
    reset({
      name:  initialData?.name  || '',
      type:  initialData?.type  || 'expense',
      color: initialData?.color || '#6366f1',
      icon:  initialData?.icon  || 'tag',
    });
  }, [initialData, reset]);

  const selectedColor = watch('color');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Name */}
      <div>
        <label className="label">Category Name</label>
        <input
          type="text"
          placeholder="e.g. Groceries"
          className={`input-field ${errors.name ? 'input-error' : ''}`}
          {...register('name', {
            required:  'Category name is required',
            maxLength: { value: 30, message: 'Name cannot exceed 30 characters' },
          })}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Type */}
      <div>
        <label className="label">Type</label>
        <select
          className="input-field"
          disabled={!!initialData}
          {...register('type', { required: 'Type is required' })}
        >
          {TRANSACTION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        {initialData && (
          <p className="text-xs text-gray-400 mt-1">Type cannot be changed after creation</p>
        )}
      </div>

      {/* Color picker */}
      <div>
        <label className="label">Color</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {CHART_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', color)}
              className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                selectedColor === color
                  ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                  : ''
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        {/* Custom color input */}
        <div className="flex items-center gap-3">
          <input
            type="color"
            className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-1"
            {...register('color')}
          />
          <input
            type="text"
            placeholder="#6366f1"
            className="input-field flex-1 font-mono text-sm"
            value={selectedColor}
            onChange={(e) => setValue('color', e.target.value)}
          />
          <div
            className="w-10 h-10 rounded-xl border border-gray-200 flex-shrink-0"
            style={{ backgroundColor: selectedColor }}
          />
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs text-gray-400 font-medium mb-3">Preview</p>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${selectedColor}20` }}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: selectedColor }}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {watch('name') || 'Category Name'}
            </p>
            <p className="text-xs text-gray-400 capitalize">{watch('type')}</p>
          </div>
          <span
            className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: `${selectedColor}20`,
              color: selectedColor,
            }}
          >
            {watch('type')}
          </span>
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
          initialData ? 'Update Category' : 'Create Category'
        )}
      </button>
    </form>
  );
};

export default CategoryForm;