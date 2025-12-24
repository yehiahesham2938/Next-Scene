import PropTypes from 'prop-types';

const Input = ({ 
  label, 
  type = 'text', 
  id, 
  value, 
  onChange, 
  placeholder = '',
  required = false,
  className = '',
  error = null,
  ...props 
}) => {
  const errorId = error ? `${id}-error` : undefined;
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}{required && <span className="text-red-600 dark:text-red-400 ml-1" aria-label="required">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={`w-full border border-gray-300 dark:border-gray-600 rounded py-2 px-3 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 ${error ? 'border-red-500 dark:border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{error}</p>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  error: PropTypes.string,
};

export default Input;
