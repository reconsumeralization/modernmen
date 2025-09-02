import React, { useState, useCallback, useRef } from 'react';
import { 
  formBuilderThemes, 
  FormBuilderTheme, 
  FormThemeSelector, 
  FormThemePreview,
  defaultFormTheme,
  getFormTheme 
} from './formBuilderThemes';

// Form field types
export interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'number' | 'date' | 'time' | 'url' | 'password';
  label: string;
  placeholder?: string;
  required?: boolean;
  help?: string;
  options?: string[]; // For select, radio, checkbox
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  layout?: {
    width?: 'full' | 'half' | 'third' | 'quarter';
    group?: string;
  };
}

// Form configuration
export interface FormConfig {
  id: string;
  name: string;
  description?: string;
  theme: string;
  fields: FormField[];
  submitText?: string;
  successMessage?: string;
  errorMessage?: string;
  redirectUrl?: string;
}

// Form Builder Component
export const FormBuilder: React.FC<{
  initialConfig?: Partial<FormConfig>;
  onSave?: (config: FormConfig) => void;
  onPreview?: (config: FormConfig) => void;
  isPreview?: boolean;
}> = ({ initialConfig, onSave, onPreview, isPreview = false }) => {
  const [config, setConfig] = useState<FormConfig>({
    id: initialConfig?.id || `form-${Date.now()}`,
    name: initialConfig?.name || 'New Form',
    description: initialConfig?.description || '',
    theme: initialConfig?.theme || defaultFormTheme.id,
    fields: initialConfig?.fields || [],
    submitText: initialConfig?.submitText || 'Submit',
    successMessage: initialConfig?.successMessage || 'Thank you! Your form has been submitted.',
    errorMessage: initialConfig?.errorMessage || 'There was an error submitting your form.',
    redirectUrl: initialConfig?.redirectUrl || ''
  });

  const [selectedFieldType, setSelectedFieldType] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // Handle theme change
  const handleThemeChange = useCallback((themeId: string) => {
    setConfig(prev => ({ ...prev, theme: themeId }));
  }, []);

  // Add new field
  const addField = useCallback((fieldType: string) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: fieldType as FormField['type'],
      label: `New ${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      placeholder: `Enter ${fieldType}...`,
      required: false,
      layout: { width: 'full' }
    };

    if (fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox') {
      newField.options = ['Option 1', 'Option 2', 'Option 3'];
    }

    setConfig(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  }, []);

  // Update field
  const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  }, []);

  // Remove field
  const removeField = useCallback((fieldId: string) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  }, []);

  // Move field
  const moveField = useCallback((fromIndex: number, toIndex: number) => {
    setConfig(prev => {
      const newFields = [...prev.fields];
      const [movedField] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, movedField);
      return { ...prev, fields: newFields };
    });
  }, []);

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', index.toString());
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== dropIndex) {
      moveField(dragIndex, dropIndex);
    }
    setIsDragging(false);
    setDragOverIndex(null);
  }, [moveField]);

  // Render form field
  const renderField = useCallback((field: FormField, index: number) => {
    const currentTheme = getFormTheme(config.theme);
    const fieldClasses = currentTheme.cssClasses['form-field'];

    return (
      <div
        key={field.id}
        className={`form-builder-field ${fieldClasses} ${isDragging ? 'form-builder-dragging' : ''}`}
        draggable={!isPreview}
        onDragStart={(e) => handleDragStart(e, index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, index)}
        style={{
          border: dragOverIndex === index ? '2px dashed #3b82f6' : '1px solid #e5e7eb',
          backgroundColor: dragOverIndex === index ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
        }}
      >
        {!isPreview && (
          <div className="field-toolbar">
            <button
              type="button"
              onClick={() => removeField(field.id)}
              className="field-remove-btn"
              title="Remove field"
            >
              ×
            </button>
            <div className="field-type-badge">{field.type}</div>
          </div>
        )}

        <div className="field-content">
          <label className={currentTheme.cssClasses['form-label']}>
            {field.label}
            {field.required && <span className="required-asterisk">*</span>}
          </label>

          {field.help && (
            <div className={currentTheme.cssClasses['form-help']}>
              {field.help}
            </div>
          )}

          {renderFieldInput(field, currentTheme)}

          {!isPreview && (
            <div className="field-options">
              <input
                type="text"
                value={field.label}
                onChange={(e) => updateField(field.id, { label: e.target.value })}
                placeholder="Field label"
                className="field-option-input"
              />
              <input
                type="text"
                value={field.placeholder || ''}
                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                placeholder="Placeholder text"
                className="field-option-input"
              />
              <label className="field-option-checkbox">
                <input
                  type="checkbox"
                  checked={field.required || false}
                  onChange={(e) => updateField(field.id, { required: e.target.checked })}
                />
                Required
              </label>
            </div>
          )}
        </div>
      </div>
    );
  }, [config.theme, isPreview, isDragging, dragOverIndex, handleDragStart, handleDragOver, handleDragLeave, handleDrop, removeField, updateField]);

  // Render field input based on type
  const renderFieldInput = useCallback((field: FormField, theme: FormBuilderTheme) => {
    const inputClasses = theme.cssClasses['form-input'];
    const textareaClasses = theme.cssClasses['form-textarea'];
    const selectClasses = theme.cssClasses['form-select'];
    const checkboxClasses = theme.cssClasses['form-checkbox'];
    const radioClasses = theme.cssClasses['form-radio'];

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            className={textareaClasses}
            placeholder={field.placeholder}
            disabled={isPreview}
          />
        );

      case 'select':
        return (
          <select className={selectClasses} disabled={isPreview}>
            <option value="">{field.placeholder || 'Select an option...'}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option.toLowerCase().replace(/\s+/g, '-')}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className={checkboxClasses}>
            {field.options?.map((option, index) => (
              <label key={index} className="checkbox-option">
                <input
                  type="checkbox"
                  disabled={isPreview}
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'radio':
        return (
          <div className={radioClasses}>
            {field.options?.map((option, index) => (
              <label key={index} className="radio-option">
                <input
                  type="radio"
                  name={`radio-${field.id}`}
                  disabled={isPreview}
                />
                {option}
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            type={field.type}
            className={inputClasses}
            placeholder={field.placeholder}
            disabled={isPreview}
          />
        );
    }
  }, [isPreview]);

  // Handle save
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(config);
    }
  }, [config, onSave]);

  // Handle preview
  const handlePreview = useCallback(() => {
    if (onPreview) {
      onPreview(config);
    }
  }, [config, onPreview]);

  const currentTheme = getFormTheme(config.theme);

  return (
    <div className="modernmen-form-builder" data-theme={config.theme}>
      {!isPreview && (
        <>
          <div className="form-builder-header">
            <h2>ModernMen Form Builder</h2>
            <p>Create beautiful, branded forms with our theme system</p>
          </div>

          <FormThemeSelector
            selectedTheme={config.theme}
            onThemeChange={handleThemeChange}
          />

          <FormThemePreview theme={currentTheme} />

          <div className="form-builder-toolbar">
            <div className="toolbar-section">
              <h4>Add Fields</h4>
              <div className="field-type-buttons">
                {['text', 'email', 'tel', 'textarea', 'select', 'checkbox', 'radio', 'number', 'date', 'time', 'url', 'password'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addField(type)}
                    className="field-type-btn"
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="toolbar-section">
              <h4>Form Settings</h4>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Form name"
                className="form-setting-input"
              />
              <input
                type="text"
                value={config.submitText || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, submitText: e.target.value }))}
                placeholder="Submit button text"
                className="form-setting-input"
              />
            </div>
          </div>
        </>
      )}

      <div className="modernmen-form-container">
        <form className="modernmen-form">
          {config.fields.length === 0 ? (
            <div className="form-builder-drop-zone">
              <p>Drag and drop fields here to build your form</p>
              <p>Or use the toolbar above to add fields</p>
            </div>
          ) : (
            config.fields.map((field, index) => renderField(field, index))
          )}

          {config.fields.length > 0 && (
            <div className="form-submit-section">
              <button
                type="submit"
                className={currentTheme.cssClasses['form-button-primary']}
                disabled={isPreview}
              >
                {config.submitText || 'Submit'}
              </button>
            </div>
          )}
        </form>
      </div>

      {!isPreview && (
        <div className="form-builder-actions">
          <button
            type="button"
            onClick={handlePreview}
            className="action-btn preview-btn"
          >
            Preview Form
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="action-btn save-btn"
          >
            Save Form
          </button>
        </div>
      )}
    </div>
  );
};

// Form Builder Field Component
export const FormBuilderField: React.FC<{
  field: FormField;
  theme: FormBuilderTheme;
  onUpdate: (updates: Partial<FormField>) => void;
  onRemove: () => void;
  isPreview?: boolean;
}> = ({ field, theme, onUpdate, onRemove, isPreview = false }) => {
  return (
    <div className={`form-builder-field ${theme.cssClasses['form-field']}`}>
      {!isPreview && (
        <div className="field-toolbar">
          <button
            type="button"
            onClick={onRemove}
            className="field-remove-btn"
            title="Remove field"
          >
            ×
          </button>
          <div className="field-type-badge">{field.type}</div>
        </div>
      )}

      <div className="field-content">
        <label className={theme.cssClasses['form-label']}>
          {field.label}
          {field.required && <span className="required-asterisk">*</span>}
        </label>

        {field.help && (
          <div className={theme.cssClasses['form-help']}>
            {field.help}
          </div>
        )}

        {/* Field input rendering would go here */}
      </div>
    </div>
  );
};

export default FormBuilder;
