# NEXMAX Dashboard - Pages Documentation

## 📄 Pages Overview

### Structure
NEXMAX Dashboard terdiri dari beberapa halaman utama yang terorganisir berdasarkan fungsionalitas:

```
pages/
├── index.js                    # Main Dashboard
├── business-flow.js           # Business Flow Analysis
├── strategic-executive.js     # Strategic Executive Dashboard
├── login.js                   # Authentication
├── users.js                   # User Management
├── transaction/               # Transaction Pages
│   ├── deposit.js            # Deposit Management
│   ├── withdraw.js           # Withdraw Management
│   ├── exchange.js           # Exchange Rate Management
│   ├── headcount.js          # Headcount Management
│   ├── new-register.js       # New Register Management
│   ├── new-depositor.js      # New Depositor Management
│   ├── member-report.js      # Member Report Management
│   └── adjustment.js         # Adjustment Management
└── api/                      # API Endpoints
```

## 🏠 Main Dashboard (`pages/index.js`)

### Overview
Halaman utama dashboard yang menampilkan KPI dan metrics penting bisnis.

### Features
- **KPI Cards**: 8 KPI utama (Revenue, Profit, Members, dll)
- **Line Charts**: Growth vs Profitability trends
- **Bar Charts**: Retention vs Churn analysis
- **Real-time Data**: Auto-refresh setiap 30 detik
- **Slicer Integration**: Year, Currency, Month filters

### Key Components
```javascript
// KPI Cards
const kpiData = [
  { title: "Total Revenue", value: "1,234,567", change: "+12.5%" },
  { title: "Net Profit", value: "456,789", change: "+8.3%" },
  { title: "Active Members", value: "12,345", change: "+5.2%" },
  // ... more KPIs
];

// Chart Data
const lineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    { label: 'Revenue', data: [100, 120, 140, 160, 180, 200, 220] },
    { label: 'Profit', data: [20, 25, 30, 35, 40, 45, 50] }
  ]
};
```

### API Integration
- `/api/main-dashboard`: KPI data
- `/api/line-chart-data`: Chart data
- `/api/bar-chart-data`: Bar chart data
- `/api/last-update`: Last update timestamp

## 📈 Business Flow (`pages/business-flow.js`)

### Overview
Halaman analisis bisnis flow dengan 4 modul terpisah yang muncul secara berurutan saat scroll.

### Module Structure

#### Module 1: PPC Service Module
**Purpose**: New customer acquisition and group join metrics

**Content**:
- **Row 1**: 3 KPI Cards
  - New Customer Conversion Rate (4.83%)
  - Total New Customers (65)
  - Customer Group Join Volume (1,357)
- **Row 2**: 3 Charts
  - Line Chart: Conversion Rate Trend
  - Bar Chart: New Customers
  - Bar Chart: Group Join Volume

#### Module 2: First Depositor Module
**Purpose**: 2nd deposit rates comparison between group and non-group members

**Content**:
- **Row 1**: 4 KPI Cards
  - 2nd Deposit Rate (In Group): 24.22%
  - 2nd Deposits (In Group): 78
  - 2nd Deposit Rate (Not In Group): 11.80%
  - 2nd Deposits (Not In Group): 65
- **Row 2**: 3 Charts
  - Line Chart: Deposit Rate Trend
  - Bar Chart: Rate Comparison
  - Bar Chart: Customer Counts

#### Module 3: Old Member Module
**Purpose**: Engagement, NPS, upgrade and churn metrics by tier

**Content**:
- **Row 1**: 2 KPI Cards
  - Total Upgraded Members (188)
  - Total Churned Members (128)
- **Row 2**: 3 Bar Charts
  - Customer Count by Tier
  - Upgraded Members by Tier
  - Churned Members by Tier
- **Row 3**: 2 Line Charts
  - Group Engagement by Tier
  - NPS by Tier
- **Row 4**: 1 Bar + 1 Line Chart
  - Tier Upgrade Rate
  - Tier Churn Rate Trend (5 legend)

#### Module 4: Traffic Executive Module
**Purpose**: Customer reactivation and transfer success metrics

**Content**:
- **Row 1**: 3 KPI Cards
  - Customer Transfer Success Rate (80.49%)
  - Target Completion (94.70%)
  - Total Reactivated Customers (978)
- **Row 2**: 3 Charts
  - Bar Chart: Reactivation Rate by Tier
  - Bar Chart: Reactivated Customer Counts
  - Donut Chart: Transfer Success Rate

### Features
- **Scroll-based Navigation**: Modules appear as user scrolls
- **Dynamic Sub-header**: Title and subtitle change based on active module
- **Slicer Integration**: Year, Currency, Month filters
- **Chart.js Integration**: Real charts with data visualization

## 🎯 Strategic Executive (`pages/strategic-executive.js`)

### Overview
Dashboard strategis untuk analisis tingkat eksekutif dengan forecasting dan trend analysis.

### Features
- **Strategic KPIs**: High-level business metrics
- **Forecasting Charts**: Future trend predictions
- **Executive Summary**: Key insights and recommendations
- **Performance Metrics**: Year-over-year comparisons

### Key Components
```javascript
// Strategic KPIs
const strategicKPIs = [
  { title: "Market Share", value: "23.5%", trend: "+2.1%" },
  { title: "Customer Lifetime Value", value: "$2,450", trend: "+15.3%" },
  { title: "Churn Rate", value: "4.2%", trend: "-0.8%" },
  { title: "Revenue Growth", value: "18.7%", trend: "+3.2%" }
];

// Forecasting Data
const forecastData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    { label: 'Actual', data: [100, 120, 140, 160] },
    { label: 'Forecast', data: [null, null, 150, 180] }
  ]
};
```

## 🔐 Authentication (`pages/login.js`)

### Overview
Halaman login dengan sistem autentikasi custom.

### Features
- **User Authentication**: Username/password login
- **Role-based Access**: Admin, Manager, User roles
- **Session Management**: Persistent login sessions
- **Security**: Password hashing and validation

### Implementation
```javascript
const handleLogin = async (credentials) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (response.ok) {
      const user = await response.json();
      setUser(user);
      router.push('/');
    }
  } catch (error) {
    setError('Login failed');
  }
};
```

## 👥 User Management (`pages/users.js`)

### Overview
Halaman manajemen user dengan role-based access control.

### Features
- **User List**: Display all users with pagination
- **User Creation**: Add new users with roles
- **User Editing**: Modify user information
- **User Deletion**: Remove users from system
- **Role Management**: Assign and change user roles

### User Roles
- **Admin**: Full access to all features
- **Manager**: Access to reports and analytics
- **User**: Basic dashboard access

## 💰 Transaction Pages

### 1. Deposit Management (`pages/transaction/deposit.js`)

#### Features
- **Data Display**: Paginated table with sorting
- **Data Input**: Modal form for new entries
- **Data Editing**: Inline table editing
- **Data Export**: Excel export functionality
- **Slicer Filters**: Currency, Line, Year, Month, Date Range

#### API Endpoints
- `GET /api/deposit/data`: Fetch deposit data
- `POST /api/deposit/save`: Save new deposit
- `PUT /api/deposit/update`: Update existing deposit
- `GET /api/deposit/export`: Export to Excel
- `GET /api/deposit/slicer-options`: Get filter options

#### Data Structure
```javascript
const depositRecord = {
  id: 1,
  date: '2025-07-23',
  year: 2025,
  month: 'July',
  currency: 'MYR',
  line: 'VIP Program',
  amount: 10000.00,
  uniquekey: '2025-07-23-MYR-VIP-10000',
  created_date: '2025-07-23T10:00:00Z',
  modified_date: '2025-07-23T10:00:00Z'
};
```

### 2. Withdraw Management (`pages/transaction/withdraw.js`)

#### Features
- Identical structure to Deposit page
- Separate data table and API endpoints
- Same editing and export functionality

### 3. Exchange Rate Management (`pages/transaction/exchange.js`)

#### Features
- **Exchange Rate Tracking**: SGD to MYR and USD to MYR rates
- **Date-based Records**: Daily exchange rate entries
- **Unique Key Generation**: Auto-generated based on date and rates
- **Slicer Filters**: Month and Date Range only

#### Data Structure
```javascript
const exchangeRecord = {
  id: 1,
  date: '2025-07-23',
  month: 'July',
  year: 2025,
  total_sgd_to_myr: 3.4567,
  usd_to_myr: 4.1234,
  uniquekey: '2025-07-23-3.4567-4.1234',
  created_date: '2025-07-23T10:00:00Z',
  modified_date: '2025-07-23T10:00:00Z'
};
```

### 4. Headcount Management (`pages/transaction/headcount.js`)

#### Features
- **Headcount Tracking**: Total SGD, MYR, USD amounts
- **Date-based Records**: Daily headcount entries
- **Auto-generation**: Year and month derived from date
- **Unique Key**: Based on month, year, and totals

### 5. Business Flow Pages

#### New Register (`pages/transaction/new-register.js`)
- New customer registration tracking
- Same structure as deposit/withdraw pages

#### New Depositor (`pages/transaction/new-depositor.js`)
- New depositor tracking
- Conversion rate analysis

#### Member Report (`pages/transaction/member-report.js`)
- Daily member activity reports
- Member engagement metrics

#### Adjustment (`pages/transaction/adjustment.js`)
- Daily adjustment entries
- Correction and adjustment tracking

## 🔧 Utility Pages

### Setup Page (`pages/setup.js`)
**Purpose**: Database setup and testing utility

**Features**:
- Database connection testing
- Table creation utilities
- Sample data insertion
- API endpoint testing

### Database Structure (`pages/database-structure.js`)
**Purpose**: Display database schema and relationships

**Features**:
- Table structure visualization
- Column definitions
- Relationship diagrams
- Query examples

## 📊 Page Features

### 1. Common Features Across Pages

#### Slicer System
```javascript
// Standard slicer structure
const slicers = {
  currency: 'ALL',
  line: 'ALL', 
  year: 'ALL',
  month: '',
  startDate: '',
  endDate: '',
  filterMode: 'month',
  page: 1,
  limit: 1000
};
```

#### Data Table
```javascript
// Standard table structure
const tableColumns = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'currency', label: 'Currency', sortable: true },
  { key: 'line', label: 'Line', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];
```

#### Export Functionality
```javascript
const handleExport = async () => {
  const response = await fetch('/api/endpoint/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(slicers)
  });
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `export-${Date.now()}.xlsx`;
  a.click();
};
```

### 2. Responsive Design

#### Mobile Optimization
```css
@media (max-width: 768px) {
  .data-table {
    font-size: 12px;
  }
  
  .slicer-container {
    flex-direction: column;
    gap: 10px;
  }
  
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
```

#### Tablet Optimization
```css
@media (max-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
```

### 3. Error Handling

#### API Error Handling
```javascript
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/endpoint');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setData(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

#### User Feedback
```javascript
// Success notification
const showSuccess = (message) => {
  // Implementation for success toast
};

// Error notification  
const showError = (message) => {
  // Implementation for error toast
};
```

## 🚀 Performance Optimization

### 1. Code Splitting
```javascript
// Lazy load heavy components
const HeavyChart = React.lazy(() => import('../components/HeavyChart'));

// Lazy load pages
const BusinessFlow = React.lazy(() => import('./business-flow'));
```

### 2. Data Caching
```javascript
// Cache API responses
const useCachedData = (key, fetchFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const cached = localStorage.getItem(key);
    if (cached) {
      setData(JSON.parse(cached));
      setLoading(false);
    }
    
    fetchFunction().then(result => {
      setData(result);
      localStorage.setItem(key, JSON.stringify(result));
      setLoading(false);
    });
  }, [key, fetchFunction]);
  
  return { data, loading };
};
```

### 3. Virtual Scrolling
```javascript
// For large data tables
const VirtualTable = ({ data, rowHeight = 50, visibleRows = 10 }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const startIndex = Math.floor(scrollTop / rowHeight);
  const endIndex = startIndex + visibleRows;
  
  const visibleData = data.slice(startIndex, endIndex);
  
  return (
    <div style={{ height: data.length * rowHeight }}>
      {visibleData.map((item, index) => (
        <div key={startIndex + index} style={{ height: rowHeight }}>
          {/* Row content */}
        </div>
      ))}
    </div>
  );
};
```

---

*This pages documentation provides comprehensive information about all pages in the NEXMAX Dashboard, including their features, functionality, and implementation details.* 