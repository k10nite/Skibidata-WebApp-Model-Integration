import { motion } from 'framer-motion';

const FormSelect = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  required = false,
  error,
}) => {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <motion.select
        className={`form-select ${error ? 'error' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        whileFocus={{ scale: 1.01 }}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </motion.select>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default FormSelect;
