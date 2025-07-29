# NEXMAX Dashboard - Development Guide

## 👨‍💻 Development Environment Setup

### Prerequisites
- **Node.js**: 18.x or higher
- **npm**: 8.x or higher
- **PostgreSQL**: 14.x or higher
- **Git**: Latest version
- **VS Code**: Recommended IDE

### Initial Setup
```bash
# Clone repository
git clone https://github.com/your-org/nexmax-dashboard.git
cd nexmax-dashboard

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Development Tools
```bash
# Install development dependencies
npm install -D eslint prettier husky lint-staged

# Install VS Code extensions
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
```

## 📋 Coding Standards

### 1. JavaScript/React Standards

#### File Naming
```javascript
// Use PascalCase for components
// components/StandardStatCard.js
// components/BusinessFlowChart.js

// Use camelCase for utilities
// utils/dateFormatter.js
// utils/currencyConverter.js

// Use kebab-case for pages
// pages/business-flow.js
// pages/strategic-executive.js
```

#### Component Structure
```javascript
// Standard component structure
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ComponentName = ({ prop1, prop2 }) => {
  // 1. State declarations
  const [state, setState] = useState(initialValue);
  
  // 2. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // 3. Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // 4. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// PropTypes
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number
};

ComponentName.defaultProps = {
  prop2: 0
};

export default ComponentName;
```

#### Function Naming
```javascript
// Use descriptive names
const calculateGrossProfit = (revenue, cost) => {
  return revenue - cost;
};

const handleUserLogin = async (credentials) => {
  // Login logic
};

const fetchDashboardData = async (filters) => {
  // Data fetching logic
};
```

### 2. CSS Standards

#### Class Naming
```css
/* Use BEM methodology */
.kpi-card { }
.kpi-card__title { }
.kpi-card__value { }
.kpi-card--highlighted { }

/* Use semantic names */
.dashboard-header { }
.transaction-table { }
.chart-container { }
```

#### CSS Organization
```css
/* 1. Reset and base styles */
* { margin: 0; padding: 0; }

/* 2. Layout components */
.header { }
.sidebar { }
.main-content { }

/* 3. UI components */
.button { }
.card { }
.form { }

/* 4. Utilities */
.text-center { }
.mt-4 { }
.hidden { }
```

### 3. API Standards

#### Endpoint Naming
```javascript
// Use RESTful conventions
GET    /api/deposit/data          // Get deposit data
POST   /api/deposit/save          // Create new deposit
PUT    /api/deposit/update        // Update deposit
DELETE /api/deposit/delete        // Delete deposit

// Use descriptive names
GET    /api/deposit/slicer-options // Get filter options
GET    /api/deposit/export         // Export data
```

#### Response Format
```javascript
// Success response
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}

// Error response
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## 🏗️ Architecture Patterns

### 1. Component Architecture

#### Container/Presentational Pattern
```javascript
// Container component (logic)
const DepositContainer = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/deposit/data');
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DepositTable 
      data={data} 
      loading={loading} 
      onRefresh={fetchData}
    />
  );
};

// Presentational component (UI)
const DepositTable = ({ data, loading, onRefresh }) => {
  if (loading) return <div>Loading...</div>;
  
  return (
    <table>
      {/* Table content */}
    </table>
  );
};
```

#### Custom Hooks Pattern
```javascript
// Custom hook for data fetching
const useApiData = (endpoint, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(endpoint);
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, dependencies);
  
  return { data, loading, error };
};

// Usage
const DepositPage = () => {
  const { data, loading, error } = useApiData('/api/deposit/data');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <DepositTable data={data} />;
};
```

### 2. State Management

#### Local State
```javascript
// Use useState for simple state
const [count, setCount] = useState(0);
const [user, setUser] = useState(null);
const [filters, setFilters] = useState({
  currency: 'ALL',
  year: 'ALL',
  month: ''
});
```

#### Complex State
```javascript
// Use useReducer for complex state
const initialState = {
  data: [],
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 1000,
    total: 0
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { 
        ...state, 
        data: action.payload.data,
        pagination: action.payload.pagination,
        loading: false 
      };
    case 'FETCH_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'UPDATE_FILTERS':
      return { ...state, filters: action.payload };
    default:
      return state;
  }
};

const useDataManager = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const fetchData = async (filters) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      });
      const result = await response.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: result });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  };
  
  return { state, fetchData };
};
```

### 3. Error Handling

#### Try-Catch Pattern
```javascript
const handleApiCall = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/endpoint');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setData(data);
  } catch (error) {
    console.error('API call failed:', error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

#### Error Boundaries
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 🔧 Development Workflow

### 1. Git Workflow

#### Branch Naming
```bash
# Feature branches
git checkout -b feature/user-authentication
git checkout -b feature/dashboard-charts
git checkout -b feature/export-functionality

# Bug fix branches
git checkout -b fix/login-error
git checkout -b fix/chart-rendering

# Hotfix branches
git checkout -b hotfix/security-patch
```

#### Commit Messages
```bash
# Use conventional commits
git commit -m "feat: add user authentication system"
git commit -m "fix: resolve chart rendering issue"
git commit -m "docs: update API documentation"
git commit -m "style: improve button styling"
git commit -m "refactor: simplify data fetching logic"
```

#### Pull Request Process
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "feat: implement new feature"

# 3. Push to remote
git push origin feature/new-feature

# 4. Create pull request on GitHub
# 5. Code review and merge
```

### 2. Testing Strategy

#### Unit Tests
```javascript
// __tests__/components/StandardStatCard.test.js
import { render, screen } from '@testing-library/react';
import StandardStatCard from '../../components/StandardStatCard';

describe('StandardStatCard', () => {
  test('renders with correct props', () => {
    const props = {
      title: 'Revenue',
      value: '1,000,000',
      change: '+5%',
      changeType: 'positive'
    };
    
    render(<StandardStatCard {...props} />);
    
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('1,000,000')).toBeInTheDocument();
    expect(screen.getByText('+5%')).toBeInTheDocument();
  });
  
  test('handles missing props gracefully', () => {
    render(<StandardStatCard />);
    
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});
```

#### Integration Tests
```javascript
// __tests__/pages/deposit.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DepositPage from '../../pages/transaction/deposit';

describe('DepositPage', () => {
  test('loads and displays deposit data', async () => {
    render(<DepositPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Deposit Management')).toBeInTheDocument();
    });
  });
  
  test('filters data correctly', async () => {
    render(<DepositPage />);
    
    const currencySelect = screen.getByLabelText('Currency');
    fireEvent.change(currencySelect, { target: { value: 'MYR' } });
    
    await waitFor(() => {
      expect(screen.getByText('MYR')).toBeInTheDocument();
    });
  });
});
```

#### API Tests
```javascript
// __tests__/api/deposit.test.js
import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/deposit/data';

describe('/api/deposit/data', () => {
  test('returns deposit data', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { currency: 'MYR', year: '2025' }
    });
    
    await handler(req, res);
    
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toHaveProperty('data');
  });
  
  test('handles invalid parameters', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { currency: 'INVALID' }
    });
    
    await handler(req, res);
    
    expect(res._getStatusCode()).toBe(400);
  });
});
```

### 3. Code Quality

#### ESLint Configuration
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended'
  ],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'prefer-const': 'error',
    'no-var': 'error'
  }
};
```

#### Prettier Configuration
```javascript
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

#### Pre-commit Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## 📚 Best Practices

### 1. Performance Optimization

#### Code Splitting
```javascript
// Lazy load components
const HeavyChart = React.lazy(() => import('./HeavyChart'));

// Use Suspense
<Suspense fallback={<div>Loading chart...</div>}>
  <HeavyChart data={chartData} />
</Suspense>
```

#### Memoization
```javascript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* Expensive rendering */}</div>;
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);

// Use useCallback for stable function references
const handleClick = useCallback(() => {
  // Click handler logic
}, [dependencies]);
```

#### Database Optimization
```javascript
// Use connection pooling
const pool = new Pool({
  max: 20,
  min: 5,
  idle: 10000
});

// Use prepared statements
const query = 'SELECT * FROM deposit_daily WHERE currency = $1 AND year = $2';
const result = await pool.query(query, ['MYR', 2025]);

// Implement caching
const cache = new Map();
const getCachedData = async (key, queryFn) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  const data = await queryFn();
  cache.set(key, data);
  return data;
};
```

### 2. Security Best Practices

#### Input Validation
```javascript
// Validate user input
const validateDepositData = (data) => {
  const errors = [];
  
  if (!data.amount || data.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (!data.currency || !['MYR', 'SGD', 'USD'].includes(data.currency)) {
    errors.push('Invalid currency');
  }
  
  if (!data.date || !isValidDate(data.date)) {
    errors.push('Invalid date');
  }
  
  return errors;
};
```

#### SQL Injection Prevention
```javascript
// Use parameterized queries
const query = 'SELECT * FROM deposit_daily WHERE currency = $1';
const result = await pool.query(query, [currency]);

// Never use string concatenation
// BAD: `SELECT * FROM deposit_daily WHERE currency = '${currency}'`
```

#### Authentication
```javascript
// Verify user permissions
const requireAuth = (handler) => {
  return async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
};
```

### 3. Error Handling

#### Graceful Degradation
```javascript
// Handle API failures gracefully
const DataComponent = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(setError);
  }, []);
  
  if (error) {
    return <div>Unable to load data. Please try again later.</div>;
  }
  
  if (!data) {
    return <div>Loading...</div>;
  }
  
  return <DataTable data={data} />;
};
```

#### User-Friendly Error Messages
```javascript
// Provide helpful error messages
const getErrorMessage = (error) => {
  switch (error.code) {
    case 'NETWORK_ERROR':
      return 'Please check your internet connection and try again.';
    case 'VALIDATION_ERROR':
      return 'Please check your input and try again.';
    case 'AUTH_ERROR':
      return 'Please log in again to continue.';
    default:
      return 'Something went wrong. Please try again.';
  }
};
```

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Code review completed
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Build successful
- [ ] Security scan completed

### Deployment Steps
```bash
# 1. Build application
npm run build

# 2. Run tests
npm test

# 3. Deploy to staging
npm run deploy:staging

# 4. Run integration tests
npm run test:integration

# 5. Deploy to production
npm run deploy:production

# 6. Verify deployment
npm run health:check
```

### Post-Deployment
- [ ] Health checks passing
- [ ] Database connections working
- [ ] API endpoints responding
- [ ] User authentication working
- [ ] Monitoring alerts configured
- [ ] Backup procedures tested

---

*This development guide provides comprehensive information about coding standards, best practices, and development workflows for the NEXMAX Dashboard project.* 