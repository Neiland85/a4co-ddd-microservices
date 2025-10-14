import React, { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { useComponentTracking, useEventTracking } from './index';

// Button with integrated observability
export interface TrackedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  trackingName?: string;
  trackingMetadata?: Record<string, any>;
}

export const TrackedButton: React.FC<TrackedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  trackingName,
  trackingMetadata,
  ...props
}) => {
  const { trackClick } = useEventTracking();
  const componentName = trackingName || 'ds-button';

  useComponentTracking(componentName, {
    trackProps: ['variant', 'size'],
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    trackClick(`${componentName}.${variant}`, {
      size,
      text: typeof children === 'string' ? children : undefined,
      ...trackingMetadata,
    });

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`ds-button ds-button--${variant} ds-button--${size} ${props.className || ''}`}
      data-tracking-component={componentName}
      data-tracking-variant={variant}
      data-tracking-size={size}
    >
      {children}
    </button>
  );
};

// Input with integrated observability
export interface TrackedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  trackingName?: string;
  trackingMetadata?: Record<string, any>;
  debounceMs?: number;
}

export const TrackedInput: React.FC<TrackedInputProps> = ({
  label,
  error,
  onChange,
  onBlur,
  trackingName,
  trackingMetadata,
  debounceMs = 500,
  ...props
}) => {
  const { trackInput, trackCustom } = useEventTracking();
  const componentName = trackingName || 'ds-input';
<<<<<<< HEAD
  const debounceTimer = React.useRef<NodeJS.Timeout | undefined>(undefined);
=======
  const debounceTimer = React.useRef<NodeJS.Timeout>();
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

  useComponentTracking(componentName, {
    trackProps: ['type', 'required', 'disabled'],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Debounce tracking
    debounceTimer.current = setTimeout(() => {
      trackInput(componentName, e.target.value, {
        type: props.type,
        hasError: !!error,
        ...trackingMetadata,
      });
    }, debounceMs);

    if (onChange) {
      onChange(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    trackCustom(componentName, 'blur', {
      hasValue: !!e.target.value,
      hasError: !!error,
      ...trackingMetadata,
    });

    if (onBlur) {
      onBlur(e);
    }
  };

  React.useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className="ds-input-wrapper">
      {label && (
        <label className="ds-input-label" htmlFor={props.id}>
          {label}
        </label>
      )}
      <input
        {...props}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`ds-input ${error ? 'ds-input--error' : ''} ${props.className || ''}`}
        data-tracking-component={componentName}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.id}-error` : undefined}
      />
      {error && (
        <span id={`${props.id}-error`} className="ds-input-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

// Select with integrated observability
export interface TrackedSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
  trackingName?: string;
  trackingMetadata?: Record<string, any>;
}

export const TrackedSelect: React.FC<TrackedSelectProps> = ({
  label,
  options,
  onChange,
  trackingName,
  trackingMetadata,
  ...props
}) => {
  const { trackCustom } = useEventTracking();
  const componentName = trackingName || 'ds-select';

  useComponentTracking(componentName, {
    trackProps: ['required', 'disabled'],
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = options.find(opt => opt.value === e.target.value);

    trackCustom(componentName, 'change', {
      value: e.target.value,
      label: selectedOption?.label,
      ...trackingMetadata,
    });

    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="ds-select-wrapper">
      {label && (
        <label className="ds-select-label" htmlFor={props.id}>
          {label}
        </label>
      )}
      <select
        {...props}
        onChange={handleChange}
        className={`ds-select ${props.className || ''}`}
        data-tracking-component={componentName}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Card with integrated observability
export interface TrackedCardProps {
  title?: string;
  children: React.ReactNode;
  onClick?: () => void;
  trackingName?: string;
  trackingMetadata?: Record<string, any>;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const TrackedCard: React.FC<TrackedCardProps> = ({
  title,
  children,
  onClick,
  trackingName,
  trackingMetadata,
  variant = 'default',
}) => {
  const { trackClick, trackCustom } = useEventTracking();
  const componentName = trackingName || 'ds-card';

  useComponentTracking(componentName, {
    trackProps: ['variant'],
  });

  const handleClick = () => {
    if (onClick) {
      trackClick(componentName, {
        title,
        variant,
        ...trackingMetadata,
      });
      onClick();
    }
  };

  const handleMouseEnter = () => {
    trackCustom(componentName, 'hover', {
      title,
      variant,
      ...trackingMetadata,
    });
  };

  return (
    <div
      className={`ds-card ds-card--${variant} ${onClick ? 'ds-card--clickable' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      data-tracking-component={componentName}
      data-tracking-variant={variant}
    >
      {title && <h3 className="ds-card-title">{title}</h3>}
      <div className="ds-card-content">{children}</div>
    </div>
  );
};

// Modal with integrated observability
export interface TrackedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  trackingName?: string;
  trackingMetadata?: Record<string, any>;
}

export const TrackedModal: React.FC<TrackedModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  trackingName,
  trackingMetadata,
}) => {
  const { trackCustom } = useEventTracking();
  const componentName = trackingName || 'ds-modal';
  const openTime = React.useRef<number>(0);

  React.useEffect(() => {
    if (isOpen) {
      openTime.current = Date.now();
      trackCustom(componentName, 'open', {
        title,
        ...trackingMetadata,
      });
    } else if (openTime.current > 0) {
      const duration = Date.now() - openTime.current;
      trackCustom(componentName, 'close', {
        title,
        duration,
        ...trackingMetadata,
      });
      openTime.current = 0;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      trackCustom(componentName, 'backdrop_click', {
        title,
        ...trackingMetadata,
      });
      onClose();
    }
  };

  const handleCloseClick = () => {
    trackCustom(componentName, 'close_button_click', {
      title,
      ...trackingMetadata,
    });
    onClose();
  };

  return (
    <div
      className="ds-modal-backdrop"
      onClick={handleBackdropClick}
      data-tracking-component={componentName}
    >
      <div className="ds-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {title && (
          <div className="ds-modal-header">
            <h2 id="modal-title" className="ds-modal-title">
              {title}
            </h2>
            <button className="ds-modal-close" onClick={handleCloseClick} aria-label="Close modal">
              ×
            </button>
          </div>
        )}
        <div className="ds-modal-content">{children}</div>
      </div>
    </div>
  );
};

// Tab component with integrated observability
export interface TrackedTabsProps {
  tabs: Array<{ id: string; label: string; content: React.ReactNode }>;
  defaultTab?: string;
  trackingName?: string;
  trackingMetadata?: Record<string, any>;
}

export const TrackedTabs: React.FC<TrackedTabsProps> = ({
  tabs,
  defaultTab,
  trackingName,
  trackingMetadata,
}) => {
  const { trackCustom } = useEventTracking();
  const componentName = trackingName || 'ds-tabs';
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0]?.id);

  useComponentTracking(componentName, {
    trackProps: ['defaultTab'],
  });

  const handleTabClick = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);

    trackCustom(componentName, 'tab_change', {
      fromTab: activeTab,
      toTab: tabId,
      tabLabel: tab?.label,
      ...trackingMetadata,
    });

    setActiveTab(tabId);
  };

  return (
    <div className="ds-tabs" data-tracking-component={componentName}>
      <div className="ds-tabs-header" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`ds-tab ${activeTab === tab.id ? 'ds-tab--active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="ds-tabs-content">
        {tabs.map(tab => (
          <div
            key={tab.id}
            id={`tabpanel-${tab.id}`}
            className={`ds-tab-panel ${activeTab === tab.id ? 'ds-tab-panel--active' : ''}`}
            role="tabpanel"
            hidden={activeTab !== tab.id}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};
