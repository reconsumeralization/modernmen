# 🎨 COMPONENT STATE FLOW

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         COMPONENT STATE FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐           ┌─────────────────┐           ┌─────────────────┐
│   USER ACTION   │           │   COMPONENT     │           │   STATE         │
│   (Click/Input) │           │   RECEIVES      │           │   UPDATES       │
└─────────────────┘           └─────────────────┘           └─────────────────┘
        │                               │                               │
        │ ┌─────────────────────────────┼─────────────────────────────┤ │
        │ │                             │                             │ │
        ▼ ▼                             ▼                             ▼ ▼
    ┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
    │  EVENT      │◄────────────────►│   HANDLER    │◄────────────────►│   SETTER     │
    │  TRIGGER    │                 │   FUNCTION   │                 │   FUNCTION   │
    └─────────────┘                 └─────────────┘                 └─────────────┘
        │                               │                               │
        ▼                               ▼                               ▼
    ┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
    │ VALIDATION  │◄───────────────►│ STATE       │◄───────────────►│   RE-RENDER  │
    │   CHECK     │                 │   CHANGE     │                 │   TRIGGER    │
    └─────────────┘                 └─────────────┘                 └─────────────┘
        │                               │                               │
        ▼                               ▼                               ▼
    ┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
    │ ERROR       │◄───────────────►│ LOADING     │◄───────────────►│   SUCCESS    │
    │   STATE     │                 │   STATE      │                 │   STATE      │
    └─────────────┘                 └─────────────┘                 └─────────────┘
        │                               │                               │
        ▼                               ▼                               ▼
    ┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
    │ UI FEEDBACK │◄───────────────►│ API CALL    │◄───────────────►│ DATA        │
    │  (Toast)    │                 │  (Fetch)     │                 │   UPDATE     │
    └─────────────┘                 └─────────────┘                 └─────────────┘

STATE TYPES: 🔵 Loading │ 🟢 Success │ 🔴 Error │ 🟡 Pending │ 🟠 Idle
```

## 📋 **State Management Architecture**

### 🔄 **State Flow Patterns**

#### **User Interaction Flow**
```
User Action → Event Handler → State Update → Re-render → UI Feedback
```

#### **Data Fetching Flow**
```
Trigger → Loading State → API Call → Response → State Update → UI Update
```

#### **Form Submission Flow**
```
Input → Validation → Submit → Loading → API → Success/Error → Feedback
```

### 🎯 **State Types & Management**

#### **Loading States**
```typescript
interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
  progress?: number;
}

// Usage
const [loadingState, setLoadingState] = useState<LoadingState>({
  isLoading: false,
  loadingMessage: 'Loading...',
  progress: 0
});
```

#### **Error States**
```typescript
interface ErrorState {
  hasError: boolean;
  errorMessage: string;
  errorCode?: string;
  retryAction?: () => void;
}

// Usage
const [errorState, setErrorState] = useState<ErrorState>({
  hasError: false,
  errorMessage: '',
  errorCode: undefined,
  retryAction: undefined
});
```

#### **Success States**
```typescript
interface SuccessState {
  isSuccess: boolean;
  successMessage: string;
  data?: any;
  timestamp?: Date;
}

// Usage
const [successState, setSuccessState] = useState<SuccessState>({
  isSuccess: false,
  successMessage: '',
  data: undefined,
  timestamp: undefined
});
```

### 🏗️ **Custom Hooks for State Management**

#### **useAsyncState Hook**
```typescript
function useAsyncState<T>() {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await asyncFunction();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
      throw error;
    }
  }, []);

  return { ...state, execute };
}
```

#### **useFormState Hook**
```typescript
function useFormState<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const handleSubmit = useCallback(async (onSubmit: (values: T) => Promise<void>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [values]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setErrors,
  };
}
```

### 🔄 **State Update Patterns**

#### **Optimistic Updates**
```typescript
const handleOptimisticUpdate = async (newData: any) => {
  // Update UI immediately
  setData(prevData => ({ ...prevData, ...newData }));

  try {
    // Make API call
    await api.updateData(newData);
  } catch (error) {
    // Revert on error
    setData(prevData);
    setError('Update failed');
  }
};
```

#### **Debounced State Updates**
```typescript
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

#### **State Synchronization**
```typescript
const useSyncedState = (initialValue: any, syncFunction: (value: any) => void) => {
  const [value, setValue] = useState(initialValue);
  const [isSyncing, setIsSyncing] = useState(false);

  const setSyncedValue = useCallback(async (newValue: any) => {
    setValue(newValue);
    setIsSyncing(true);

    try {
      await syncFunction(newValue);
    } finally {
      setIsSyncing(false);
    }
  }, [syncFunction]);

  return [value, setSyncedValue, isSyncing] as const;
};
```

### 📊 **State Persistence**

#### **Local Storage Hook**
```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}
```

#### **Session Storage Hook**
```typescript
function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}
```

### 🎯 **Error Boundaries**

#### **React Error Boundary Component**
```typescript
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

#### **Error Boundary Hook**
```typescript
function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const captureError = useCallback((error: Error) => {
    setError(error);
  }, []);

  useEffect(() => {
    if (error) {
      // Log error to monitoring service
      console.error('Error captured:', error);
    }
  }, [error]);

  return { error, resetError, captureError };
}
```

### 📈 **Performance Optimization**

#### **State Update Batching**
```typescript
// React 18 automatic batching
function handleMultipleUpdates() {
  setLoading(true);
  setData(null);
  setError(null);

  // All updates batched automatically in React 18
  fetchData().then(result => {
    setLoading(false);
    setData(result);
  }).catch(error => {
    setLoading(false);
    setError(error);
  });
}
```

#### **Memoized State Selectors**
```typescript
const useAppState = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useMemo(() => !!user, [user]);
  const userDisplayName = useMemo(() => user?.name || 'Guest', [user]);

  return {
    user,
    isAuthenticated,
    userDisplayName,
  };
};
```

### 🧪 **Testing State Management**

#### **State Testing Utilities**
```typescript
// Test hook wrapper
function renderHookWithProviders<T>(hook: () => T) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </Provider>
  );

  return renderHook(hook, { wrapper });
}

// State assertion helpers
export const stateMatchers = {
  toHaveState: (received: any, expected: any) => {
    return {
      pass: JSON.stringify(received) === JSON.stringify(expected),
      message: () => `Expected state to match`,
    };
  },
};
```

#### **Integration Test Example**
```typescript
describe('useAsyncState', () => {
  it('handles successful async operation', async () => {
    const mockApi = jest.fn().mockResolvedValue({ data: 'success' });

    const { result } = renderHook(() => useAsyncState());

    await act(async () => {
      await result.current.execute(mockApi);
    });

    expect(result.current.data).toEqual({ data: 'success' });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('handles failed async operation', async () => {
    const mockApi = jest.fn().mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useAsyncState());

    await act(async () => {
      try {
        await result.current.execute(mockApi);
      } catch (error) {
        // Expected error
      }
    });

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toMatchObject(new Error('API Error'));
  });
});
```

### 📋 **State Management Best Practices**

#### **1. Single Source of Truth**
- Keep state in one place for each domain
- Use context or global state for shared state
- Avoid prop drilling with deeply nested components

#### **2. Immutable State Updates**
```typescript
// ✅ Good: Immutable updates
setState(prevState => ({
  ...prevState,
  user: {
    ...prevState.user,
    name: 'New Name'
  }
}));

// ❌ Bad: Mutable updates
state.user.name = 'New Name';
setState(state);
```

#### **3. State Colocation**
- Keep state close to where it's used
- Lift state up only when necessary
- Use composition over complex state management

#### **4. Error Handling**
- Always handle async operation errors
- Provide user feedback for all error states
- Log errors for debugging and monitoring

#### **5. Performance**
- Use useMemo for expensive calculations
- Use useCallback for event handlers
- Debounce rapid state changes
- Optimize re-renders with React.memo
