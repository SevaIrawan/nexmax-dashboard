# 📊 NEXMAX Dashboard Logic

**Centralized Logic System untuk NEXMAX Dashboard Analytics**

## 🏗️ Struktur Folder

```
logic/
├── dashboard/          # Logic untuk setiap dashboard page
│   ├── overview-logic.js
│   ├── business-flow-logic.js
│   ├── strategic-executive-logic.js
│   ├── bgo-logic.js
│   ├── sr-logic.js
│   ├── xoo-logic.js
│   └── os-logic.js
├── database/           # Database connection & management
│   └── postgresql.js
├── utils/              # Utility functions
│   └── formatters.js
├── index.js           # Main export file
└── README.md          # Documentation
```

## 🎯 Tujuan

Folder Logic ini dibuat untuk:
- ✅ **Centralisasi semua logic bisnis** dalam satu folder
- ✅ **Memudahkan maintenance** dan update logic
- ✅ **Konsistensi** formula dan kalkulasi di seluruh dashboard
- ✅ **Reusability** komponen logic di berbagai page
- ✅ **Separation of concerns** antara UI dan business logic

## 🔧 Konfigurasi Database

**PostgreSQL Configuration:**
- **Host:** localhost:5432
- **Username:** postgre
- **Password:** CRM_Backend
- **Database:** crm_backend_data

## 📚 Penggunaan

### 1. Import Logic untuk Page Tertentu

```javascript
// Untuk Overview page
import { Logic } from '../logic/index.js';
const overviewData = await Logic.overview.fetchOverviewData('MYR', '2025', 'July');

// Untuk Business Flow page
const businessFlowData = await Logic.businessFlow.fetchBusinessFlowData('MYR', '2025', 'July');
```

### 2. Import Utilities

```javascript
import { Formatters } from '../logic/index.js';

// Format currency
const formattedAmount = Formatters.currency(15000, 'MYR');
// Result: "RM 15,000.00"

// Format percentage
const formattedPercentage = Formatters.percentage(4.83);
// Result: "4.83%"
```

### 3. Test Database Connection

```javascript
import { Database } from '../logic/index.js';

// Test connection
const isConnected = await Database.checkConnection();
console.log('Database connected:', isConnected);

// Test all tables
const tableStatus = await Database.testTables();
console.log('Table status:', tableStatus);
```

## 📄 Dashboard Logic Files

### 1. Overview Logic (`overview-logic.js`)
**Fungsi:**
- KPI cards: Total Deposits, Withdrawals, New Depositors, Active Members
- Charts: Retention vs Churn, CLV vs Purchase Frequency, Growth vs Profitability
- **Tables:** `transactions`, `customer_analytics`, `business_metrics`, `operational_metrics`

### 2. Business Flow Logic (`business-flow-logic.js`)
**Fungsi:**
- 4 Module: PPC Service, First Depositor, Old Member, Traffic Executive
- KPI per module dengan chart analysis
- **Tables:** `ppc_service_metrics`, `first_depositor_metrics`, `old_member_metrics`, `traffic_executive_metrics`

### 3. Strategic Executive Logic (`strategic-executive-logic.js`)
**Fungsi:**
- High-level KPIs: Revenue, Profit, Customer Lifetime Value
- Strategic charts: GGR trends, Customer value analysis
- **Tables:** `strategic_metrics`, `ggr_metrics`, `ggr_pure_metrics`, `customer_value_metrics`

### 4. BGO Logic (`bgo-logic.js`)
**Fungsi:**
- Gaming analytics: Bets, Wins, GGR, Active Players
- Game performance analysis
- **Tables:** `bgo_metrics`, `bgo_game_metrics`, `bgo_bet_details`, `bgo_game_results`

### 5. S&R Logic (`sr-logic.js`)
**Fungsi:**
- Sports & Racing betting analytics
- Win rates, odds analysis, popular sports
- **Tables:** `sr_metrics`, `sr_sports_metrics`, `sr_racing_metrics`, `sr_popular_sports`

### 6. XOO Logic (`xoo-logic.js`)
**Fungsi:**
- Service revenue analytics
- Customer segmentation, transaction analysis
- **Tables:** `xoo_metrics`, `xoo_service_metrics`, `xoo_customer_segments`, `xoo_transactions`

### 7. OS Logic (`os-logic.js`)
**Fungsi:**
- System performance analytics
- User activity, resource utilization, error analysis
- **Tables:** `os_metrics`, `os_system_performance`, `os_user_activity`, `os_resource_utilization`

## 🔧 Database Management

### Auto-create Tables
```javascript
import { setupDatabase } from './logic/index.js';

// Initialize all required tables
await setupDatabase();
```

### Manual Query Execution
```javascript
import { Database } from './logic/index.js';

const result = await Database.executeQuery(
  'SELECT * FROM transactions WHERE currency = $1',
  ['MYR']
);
```

## 📊 Format Utilities

```javascript
import { Formatters } from './logic/index.js';

// Currency formatting
Formatters.currency(15000, 'MYR')           // "RM 15,000.00"
Formatters.currency(25000, 'USD')           // "$25,000.00"

// Number formatting
Formatters.number(1234567)                  // "1,234,567"
Formatters.largeNumber(1500000)            // "1.5M"

// Percentage formatting
Formatters.percentage(45.67)                // "45.67%"

// Change calculation
Formatters.change(150, 100)                 // 50 (percentage change)
Formatters.changeFormat(25.5)               // { value: "+25.50%", direction: "up" }

// Date formatting
Formatters.date(new Date(), 'short')        // "Jul 29, 2025"
Formatters.time(new Date())                 // "11:30 AM"
```

## 🚀 Inisialisasi Complete Dashboard

```javascript
import { initializeAllDashboards } from './logic/index.js';

// Load all dashboard data sekaligus
const allData = await initializeAllDashboards('MYR', '2025', 'July');

console.log('Overview:', allData.overview);
console.log('Business Flow:', allData.businessFlow);
console.log('Strategic Executive:', allData.strategicExecutive);
console.log('BGO:', allData.bgo);
console.log('S&R:', allData.sr);
console.log('XOO:', allData.xoo);
console.log('OS:', allData.os);
```

## ⚡ Performance Features

- **Parallel Processing**: Semua queries dijalankan secara parallel
- **Connection Pooling**: Efficient database connection management
- **Error Handling**: Fallback ke default data jika database error
- **Caching Ready**: Structure siap untuk implementasi caching
- **Type Safety**: Structured return objects untuk predictable data

## 🔒 Security Features

- **Parameterized Queries**: Protection dari SQL injection
- **Connection Timeout**: Prevent hanging connections
- **Error Logging**: Comprehensive error tracking
- **Environment Variables**: Secure database credentials

## 🛠️ Maintenance

### Update Logic untuk Page Tertentu
```javascript
// Edit file: logic/dashboard/overview-logic.js
// Semua perubahan otomatis ter-reflect di Overview page
```

### Add New KPI
```javascript
// Tambah method baru di class Logic
async fetchNewKPI(currency, year, month) {
  // Implementation
}
```

### Update Database Schema
```javascript
// Edit: logic/database/postgresql.js
// Update initializeDatabaseTables() function
```

## 📈 Monitoring & Health Check

```javascript
import { getSystemHealth } from './logic/index.js';

const health = await getSystemHealth();
console.log('System Status:', health);
// {
//   database: 'healthy',
//   tables: 'healthy', 
//   logic: 'healthy',
//   timestamp: '2025-07-29T11:30:00.000Z'
// }
```

## 🎯 Best Practices

1. **Always use Logic classes** untuk data fetching
2. **Use Formatters** untuk consistent display
3. **Test database connection** sebelum fetch data
4. **Handle errors gracefully** dengan default fallbacks
5. **Use environment variables** untuk database config
6. **Keep logic separate** dari UI components
7. **Document any changes** di file ini

---

**📝 Terakhir diupdate:** 29 Juli 2025  
**👨‍💻 Team:** NEXMAX Dashboard Development Team  
**📧 Contact:** Support untuk questions atau updates 