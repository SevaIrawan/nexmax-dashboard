# NEXMAX Dashboard - Frontend Components Documentation

## 🧩 Component Architecture

### Overview
NEXMAX Dashboard menggunakan arsitektur komponen React yang modular dan reusable. Setiap komponen dirancang untuk memenuhi kebutuhan spesifik dashboard dengan styling yang konsisten.

## 📦 Core Components

### 1. Layout Components

#### Header.js
**File**: `components/Header.js`
**Purpose**: Header utama aplikasi dengan user info dan navigation

**Props**:
```javascript
{
  title: string,           // Judul halaman
  user: object,           // Data user yang login
  sidebarExpanded: boolean, // Status sidebar
  setSidebarExpanded: function // Function untuk toggle sidebar
}
```

**Features**:
- User profile display
- Sidebar toggle functionality
- Page title display
- Responsive design

**Usage**:
```javascript
<Header 
  title="Main Dashboard"
  user={{ username: 'admin' }}
  sidebarExpanded={true}
  setSidebarExpanded={setSidebarExpanded}
/>
```

#### Sidebar.js
**File**: `components/Sidebar.js`
**Purpose**: Navigation sidebar dengan menu dan submenu

**Props**:
```javascript
{
  user: object,           // User data
  sidebarExpanded: boolean, // Sidebar state
  setSidebarExpanded: function // Toggle function
}
```

**Features**:
- Collapsible sidebar
- Multi-level menu navigation
- Role-based menu visibility
- Dark theme styling
- Submenu scrolling

**Menu Structure**:
```javascript
const menuItems = [
  {
    title: 'Dashboard',
    icon: '📊',
    path: '/',
    submenu: []
  },
  {
    title: 'Transaction',
    icon: '💰',
    submenu: [
      { title: 'Deposit', path: '/transaction/deposit' },
      { title: 'Withdraw', path: '/transaction/withdraw' },
      { title: 'Exchange', path: '/transaction/exchange' },
      { title: 'Headcount', path: '/transaction/headcount' },
      { title: 'New Register', path: '/transaction/new-register' },
      { title: 'New Depositor', path: '/transaction/new-depositor' },
      { title: 'Member Report', path: '/transaction/member-report' },
      { title: 'Adjustment', path: '/transaction/adjustment' }
    ]
  },
  {
    title: 'Business Flow',
    icon: '📈',
    path: '/business-flow'
  },
  {
    title: 'Strategic Executive',
    icon: '🎯',
    path: '/strategic-executive'
  }
];
```

### 2. Data Visualization Components

#### StandardStatCard.js
**File**: `components/StandardStatCard.js`
**Purpose**: Komponen KPI card yang standar

**Props**:
```javascript
{
  title: string,          // Judul KPI
  value: string|number,   // Nilai KPI
  change: string,         // Perubahan (e.g., "+5.2%")
  changeType: 'positive'|'negative', // Tipe perubahan
  icon: string,          // Icon untuk KPI
  color: string          // Warna tema
}
```

**Features**:
- Consistent styling across all pages
- Dynamic color themes
- Change indicator with colors
- Responsive design

**Usage**:
```javascript
<StandardStatCard
  title="Total Revenue"
  value="1,234,567"
  change="+12.5%"
  changeType="positive"
  icon="💰"
  color="#667eea"
/>
```

#### StandardChart.js
**File**: `components/StandardChart.js`
**Purpose**: Komponen chart yang standar

**Props**:
```javascript
{
  type: 'line'|'bar'|'doughnut', // Tipe chart
  data: object,                   // Data chart
  options: object,                // Chart options
  height: string                  // Tinggi chart
}
```

**Features**:
- Chart.js integration
- Consistent styling
- Responsive design
- Customizable options

**Usage**:
```javascript
<StandardChart
  type="line"
  data={chartData}
  options={chartOptions}
  height="300px"
/>
```

#### StandardKPIGrid.js
**File**: `components/StandardKPIGrid.js`
**Purpose**: Grid layout untuk KPI cards

**Props**:
```javascript
{
  data: array,           // Array of KPI data
  columns: number        // Number of columns (optional)
}
```

**Features**:
- Auto-responsive grid layout
- Dynamic column adjustment
- Consistent spacing
- Mobile-friendly

**Usage**:
```javascript
<StandardKPIGrid
  data={[
    { title: "Revenue", value: "1M", change: "+5%" },
    { title: "Profit", value: "500K", change: "+3%" }
  ]}
/>
```

#### StandardChartGrid.js
**File**: `components/StandardChartGrid.js`
**Purpose**: Grid layout untuk charts

**Props**:
```javascript
{
  data: array,           // Array of chart data
  layout: 'simple'|'complex', // Layout type
  height: string         // Chart height
}
```

**Features**:
- Multiple layout options
- Responsive grid system
- Consistent chart sizing
- Complex layout support

**Usage**:
```javascript
<StandardChartGrid
  data={chartDataArray}
  layout="complex"
  height="300px"
/>
```

### 3. Chart Components

#### LineChart.js
**File**: `components/LineChart.js`
**Purpose**: Line chart component

**Features**:
- Smooth line rendering
- Multiple datasets support
- Customizable colors
- Responsive design

#### BarChart.js
**File**: `components/BarChart.js`
**Purpose**: Bar chart component

**Features**:
- Horizontal and vertical bars
- Stacked bar support
- Custom colors
- Responsive design

#### DonutChart.js
**File**: `components/DonutChart.js`
**Purpose**: Donut chart component

**Features**:
- Percentage visualization
- Custom colors
- Legend support
- Responsive design

#### MixedChart.js
**File**: `components/MixedChart.js`
**Purpose**: Mixed chart (line + bar)

**Features**:
- Combined line and bar data
- Dual Y-axis support
- Complex data visualization
- Responsive design

### 4. Utility Components

#### ExportButton.js
**File**: `components/ExportButton.js`
**Purpose**: Export functionality

**Props**:
```javascript
{
  data: array,           // Data to export
  filename: string,      // Export filename
  type: 'excel'|'csv'   // Export type
}
```

**Features**:
- Excel export with exceljs
- CSV export
- Custom filename
- Progress indicator

#### SubHeader.js
**File**: `components/SubHeader.js`
**Purpose**: Sub-header dengan slicers

**Props**:
```javascript
{
  title: string,         // Sub-header title
  slicers: array,        // Array of slicer components
  position: 'fixed'|'static' // Position type
}
```

**Features**:
- Fixed positioning
- Slicer integration
- Responsive design
- Consistent styling

## 🎨 Styling System

### 1. CSS Architecture

#### Global Styles (`styles/globals.css`)
```css
/* Base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Sidebar styles */
.sidebar {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  /* ... */
}

/* Component styles */
.kpi-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  /* ... */
}
```

#### Component Styles (`styles/dashboard-components.css`)
```css
/* KPI Grid */
.kpi-grid-standard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

/* Chart Grid */
.charts-grid-standard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}
```

#### Transaction Pages (`styles/transaction-pages.css`)
```css
/* Table styles */
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

/* Form styles */
.input-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

### 2. Styled JSX

#### Inline Styling
```javascript
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px'
}}>
  {/* Content */}
</div>
```

#### Component Styling
```javascript
<style jsx>{`
  .module-section {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    margin-bottom: 32px;
    overflow: hidden;
    transition: all 0.3s ease;
  }
`}</style>
```

## 🔄 State Management

### 1. Local State
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

### 2. Custom Hooks

#### useAuth Hook
```javascript
// hooks/useAuth.js
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Authentication logic
  return { user, loading, login, logout };
};
```

#### useRoleAccess Hook
```javascript
// hooks/useRoleAccess.js
export const useRoleAccess = (requiredRole) => {
  const { user } = useAuth();
  
  return {
    hasAccess: user?.role === requiredRole || user?.role === 'admin',
    userRole: user?.role
  };
};
```

## 📱 Responsive Design

### 1. Breakpoints
```css
/* Mobile */
@media (max-width: 768px) {
  .sidebar { width: 75px; }
  .main-content { margin-left: 75px; }
}

/* Tablet */
@media (max-width: 1024px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1025px) {
  .kpi-grid { grid-template-columns: repeat(4, 1fr); }
}
```

### 2. Mobile Optimization
- Collapsible sidebar
- Touch-friendly buttons
- Optimized table scrolling
- Responsive charts

## 🎯 Component Best Practices

### 1. Props Validation
```javascript
import PropTypes from 'prop-types';

StandardStatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  change: PropTypes.string,
  changeType: PropTypes.oneOf(['positive', 'negative']),
  icon: PropTypes.string,
  color: PropTypes.string
};
```

### 2. Error Boundaries
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}
```

### 3. Performance Optimization
```javascript
// Memoization for expensive components
const MemoizedChart = React.memo(StandardChart);

// Lazy loading for large components
const LazyComponent = React.lazy(() => import('./HeavyComponent'));
```

## 🔧 Component Testing

### 1. Unit Tests
```javascript
// __tests__/StandardStatCard.test.js
import { render, screen } from '@testing-library/react';
import StandardStatCard from '../components/StandardStatCard';

test('renders KPI card with correct data', () => {
  render(
    <StandardStatCard
      title="Revenue"
      value="1,000,000"
      change="+5%"
      changeType="positive"
    />
  );
  
  expect(screen.getByText('Revenue')).toBeInTheDocument();
  expect(screen.getByText('1,000,000')).toBeInTheDocument();
});
```

### 2. Integration Tests
```javascript
// __tests__/Dashboard.test.js
test('dashboard loads with all components', async () => {
  render(<Dashboard />);
  
  await waitFor(() => {
    expect(screen.getByText('Main Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
  });
});
```

## 📚 Component Documentation

### 1. JSDoc Comments
```javascript
/**
 * Standard KPI Card Component
 * @param {Object} props - Component props
 * @param {string} props.title - KPI title
 * @param {string|number} props.value - KPI value
 * @param {string} props.change - Change percentage
 * @param {'positive'|'negative'} props.changeType - Change type
 * @param {string} props.icon - KPI icon
 * @param {string} props.color - Theme color
 * @returns {JSX.Element} Rendered KPI card
 */
export default function StandardStatCard({ title, value, change, changeType, icon, color }) {
  // Component implementation
}
```

### 2. Storybook Integration
```javascript
// stories/StandardStatCard.stories.js
export default {
  title: 'Components/StandardStatCard',
  component: StandardStatCard,
  parameters: {
    layout: 'centered',
  },
};

export const Default = {
  args: {
    title: 'Total Revenue',
    value: '1,234,567',
    change: '+12.5%',
    changeType: 'positive',
    icon: '💰',
    color: '#667eea'
  },
};
```

---

*This frontend components documentation provides comprehensive information about all React components used in the NEXMAX Dashboard, including their props, features, and usage examples.* 