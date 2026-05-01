import { motion } from 'framer-motion';

const FormInput = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  helpText,
  error,
  ...props
}) => {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <motion.input
        type={type}
        className={`form-input ${error ? 'error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        whileFocus={{ scale: 1.01 }}
        {...props}
      />
      {helpText && <span className="form-help-text">{helpText}</span>}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default FormInput;
