# NEXMAX Dashboard - API Documentation

## 🔌 API Overview

### Base URL
```
http://localhost:3000/api
```

### Authentication
Semua API endpoints memerlukan autentikasi melalui session atau JWT token.

### Response Format
```javascript
// Success Response
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## 📊 Dashboard APIs

### 1. Main Dashboard API

#### GET `/api/main-dashboard`
**Purpose**: Fetch main dashboard KPI data

**Query Parameters**:
```javascript
{
  currency: string,    // 'MYR', 'SGD', 'USD', 'ALL'
  year: number,        // 2024, 2025, etc.
  month: string        // 'January', 'February', etc.
}
```

**Response**:
```javascript
{
  "success": true,
  "data": {
    "depositAmount": 3565158.2,
    "withdrawAmount": 2866074.8,
    "grossProfit": 699083.4,
    "netProfit": 693053.48,
    "newDepositor": 1411,
    "activeMember": 4901,
    "addTransaction": 477.8,
    "deductTransaction": 6507.72
  }
}
```

#### GET `/api/line-chart-data`
**Purpose**: Fetch line chart data for trends

**Query Parameters**:
```javascript
{
  currency: string,    // 'MYR', 'SGD', 'USD'
  year: number         // 2024, 2025, etc.
}
```

**Response**:
```javascript
{
  "success": true,
  "data": {
    "growthVsProfitability": {
      "categories": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      "series": [
        {
          "name": "Net Profit",
          "data": [100, 120, 140, 160, 180, 200, 220]
        },
        {
          "name": "New Depositor", 
          "data": [50, 60, 70, 80, 90, 100, 110]
        }
      ]
    },
    "operationalEfficiency": {
      "categories": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      "series": [
        {
          "name": "Total Revenue",
          "data": [1000, 1200, 1400, 1600, 1800, 2000, 2200]
        },
        {
          "name": "Total Cost",
          "data": [800, 960, 1120, 1280, 1440, 1600, 1760]
        }
      ]
    }
  }
}
```

#### GET `/api/bar-chart-data`
**Purpose**: Fetch bar chart data for comparisons

**Query Parameters**:
```javascript
{
  currency: string,    // 'MYR', 'SGD', 'USD'
  year: number         // 2024, 2025, etc.
}
```

**Response**:
```javascript
{
  "success": true,
  "data": {
    "retentionVsChurn": {
      "categories": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      "dataPoints": 7,
      "retentionData": [85, 87, 89, 91, 93, 95, 97],
      "churnData": [15, 13, 11, 9, 7, 5, 3]
    },
    "customerLifetimeValue": {
      "categories": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      "dataPoints": 7,
      "clvData": [2000, 2200, 2400, 2600, 2800, 3000, 3200]
    }
  }
}
```

#### GET `/api/last-update`
**Purpose**: Get last data update timestamp

**Response**:
```javascript
{
  "success": true,
  "data": {
    "lastUpdate": "2025-07-23T10:00:00Z",
    "formattedDate": "Jul 23, 2025"
  }
}
```

## 💰 Transaction APIs

### 1. Deposit APIs

#### GET `/api/deposit/data`
**Purpose**: Fetch deposit data with pagination and filters

**Query Parameters**:
```javascript
{
  currency: string,      // 'ALL', 'MYR', 'SGD', 'USD'
  line: string,          // 'ALL' or specific line
  year: string,          // 'ALL' or specific year
  month: string,         // '' or specific month
  startDate: string,     // 'YYYY-MM-DD' or ''
  endDate: string,       // 'YYYY-MM-DD' or ''
  filterMode: string,    // 'month' or 'date'
  page: number,          // Page number (1-based)
  limit: number          // Records per page
}
```

**Response**:
```javascript
{
  "success": true,
  "data": {
    "records": [
      {
        "id": 1,
        "date": "2025-07-23",
        "year": 2025,
        "month": "July",
        "currency": "MYR",
        "line": "VIP Program",
        "amount": 10000.00,
        "uniquekey": "2025-07-23-MYR-VIP-10000",
        "created_date": "2025-07-23T10:00:00Z",
        "modified_date": "2025-07-23T10:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 88,
      "totalRecords": 87500,
      "recordsPerPage": 1000
    }
  }
}
```

#### POST `/api/deposit/save`
**Purpose**: Save new deposit record

**Request Body**:
```javascript
{
  "date": "2025-07-23",
  "currency": "MYR",
  "line": "VIP Program",
  "amount": 10000.00
}
```

**Response**:
```javascript
{
  "success": true,
  "data": {
    "id": 123,
    "uniquekey": "2025-07-23-MYR-VIP-10000",
    "message": "Deposit saved successfully"
  }
}
```

#### PUT `/api/deposit/update`
**Purpose**: Update existing deposit record

**Request Body**:
```javascript
{
  "id": 123,
  "originalUniqueKey": "2025-07-23-MYR-VIP-10000",
  "date": "2025-07-23",
  "currency": "MYR",
  "line": "VIP Program",
  "amount": 15000.00
}
```

**Response**:
```javascript
{
  "success": true,
  "data": {
    "uniquekey": "2025-07-23-MYR-VIP-15000",
    "message": "Deposit updated successfully"
  }
}
```

#### GET `/api/deposit/export`
**Purpose**: Export deposit data to Excel

**Query Parameters**: Same as `/api/deposit/data`

**Response**: Excel file download

#### GET `/api/deposit/slicer-options`
**Purpose**: Get available filter options

**Response**:
```javascript
{
  "success": true,
  "data": {
    "currencies": ["MYR", "SGD", "USD"],
    "lines": ["VIP Program", "Standard", "Premium"],
    "years": [2024, 2025],
    "months": ["January", "February", "March", "April", "May", "June", "July"],
    "dateRange": {
      "min_date": "2025-06-30T16:00:00.000Z",
      "max_date": "2025-07-21T16:00:00.000Z"
    }
  }
}
```

### 2. Withdraw APIs

#### GET `/api/withdraw/data`
**Purpose**: Fetch withdraw data (same structure as deposit)

#### POST `/api/withdraw/save`
**Purpose**: Save new withdraw record

#### PUT `/api/withdraw/update`
**Purpose**: Update existing withdraw record

#### GET `/api/withdraw/export`
**Purpose**: Export withdraw data to Excel

#### GET `/api/withdraw/slicer-options`
**Purpose**: Get withdraw filter options

### 3. Exchange Rate APIs

#### GET `/api/exchange/data`
**Purpose**: Fetch exchange rate data

**Query Parameters**:
```javascript
{
  month: string,         // 'ALL' or specific month
  startDate: string,     // 'YYYY-MM-DD' or ''
  endDate: string,       // 'YYYY-MM-DD' or ''
  useDateRange: boolean, // true/false
  page: number,          // Page number
  limit: number          // Records per page
}
```

**Response**:
```javascript
{
  "success": true,
  "data": {
    "records": [
      {
        "id": 1,
        "date": "2025-07-23",
        "month": "July",
        "year": 2025,
        "total_sgd_to_myr": 3.4567,
        "usd_to_myr": 4.1234,
        "uniquekey": "2025-07-23-3.4567-4.1234",
        "created_date": "2025-07-23T10:00:00Z",
        "modified_date": "2025-07-23T10:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalRecords": 189,
      "recordsPerPage": 1000
    }
  }
}
```

#### POST `/api/exchange/save`
**Purpose**: Save new exchange rate record

**Request Body**:
```javascript
{
  "date": "2025-07-23",
  "total_sgd_to_myr": 3.4567,
  "usd_to_myr": 4.1234
}
```

#### PUT `/api/exchange/update`
**Purpose**: Update existing exchange rate record

#### GET `/api/exchange/export`
**Purpose**: Export exchange rate data to Excel

#### GET `/api/exchange/slicer-options`
**Purpose**: Get exchange rate filter options

### 4. Headcount APIs

#### GET `/api/headcount/data`
**Purpose**: Fetch headcount data

#### POST `/api/headcount/save`
**Purpose**: Save new headcount record

#### PUT `/api/headcount/update`
**Purpose**: Update existing headcount record

#### GET `/api/headcount/export`
**Purpose**: Export headcount data to Excel

#### GET `/api/headcount/slicer-options`
**Purpose**: Get headcount filter options

### 5. Business Flow APIs

#### New Register APIs
- `GET /api/new-register/data`
- `POST /api/new-register/save`
- `PUT /api/new-register/update`
- `GET /api/new-register/export`
- `GET /api/new-register/slicer-options`

#### New Depositor APIs
- `GET /api/new-depositor/data`
- `POST /api/new-depositor/save`
- `PUT /api/new-depositor/update`
- `GET /api/new-depositor/export`
- `GET /api/new-depositor/slicer-options`

#### Member Report APIs
- `GET /api/member-report/data`
- `POST /api/member-report/save`
- `PUT /api/member-report/update`
- `GET /api/member-report/export`
- `GET /api/member-report/slicer-options`

#### Adjustment APIs
- `GET /api/adjustment/data`
- `POST /api/adjustment/save`
- `PUT /api/adjustment/update`
- `GET /api/adjustment/export`
- `GET /api/adjustment/slicer-options`

## 🎯 Strategic Executive APIs

#### GET `/api/strategic-executive`
**Purpose**: Fetch strategic executive KPI data

**Query Parameters**:
```javascript
{
  currency: string,    // 'MYR', 'SGD', 'USD'
  year: number,        // 2024, 2025, etc.
  month: string        // 'January', 'February', etc.
}
```

**Response**:
```javascript
{
  "success": true,
  "data": {
    "marketShare": 23.5,
    "customerLifetimeValue": 2450,
    "churnRate": 4.2,
    "revenueGrowth": 18.7,
    "customerSatisfaction": 8.5,
    "operationalEfficiency": 92.3
  }
}
```

#### GET `/api/strategic-charts`
**Purpose**: Fetch strategic charts data

**Query Parameters**:
```javascript
{
  currency: string,    // 'MYR', 'SGD', 'USD'
  year: number         // 2024, 2025, etc.
}
```

**Response**:
```javascript
{
  "success": true,
  "data": {
    "marketTrends": {
      "labels": ["Q1", "Q2", "Q3", "Q4"],
      "datasets": [
        {
          "label": "Market Share",
          "data": [20, 22, 24, 26]
        }
      ]
    },
    "customerMetrics": {
      "labels": ["Q1", "Q2", "Q3", "Q4"],
      "datasets": [
        {
          "label": "CLV",
          "data": [2000, 2200, 2400, 2600]
        },
        {
          "label": "Churn Rate",
          "data": [5, 4.5, 4, 3.5]
        }
      ]
    }
  }
}
```

## 🔐 Authentication APIs

#### POST `/api/auth/login`
**Purpose**: User login

**Request Body**:
```javascript
{
  "username": "admin",
  "password": "password123"
}
```

**Response**:
```javascript
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin",
      "email": "admin@nexmax.com"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/logout`
**Purpose**: User logout

**Response**:
```javascript
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET `/api/auth/me`
**Purpose**: Get current user information

**Response**:
```javascript
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "role": "admin",
    "email": "admin@nexmax.com",
    "last_login": "2025-07-23T10:00:00Z"
  }
}
```

## 👥 User Management APIs

#### GET `/api/users`
**Purpose**: Fetch all users

**Query Parameters**:
```javascript
{
  page: number,     // Page number
  limit: number,    // Records per page
  role: string      // Filter by role (optional)
}
```

**Response**:
```javascript
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "username": "admin",
        "role": "admin",
        "email": "admin@nexmax.com",
        "created_date": "2025-01-01T00:00:00Z",
        "last_login": "2025-07-23T10:00:00Z",
        "is_active": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalRecords": 5,
      "recordsPerPage": 10
    }
  }
}
```

#### POST `/api/users`
**Purpose**: Create new user

**Request Body**:
```javascript
{
  "username": "newuser",
  "password": "password123",
  "role": "user",
  "email": "user@nexmax.com"
}
```

#### PUT `/api/users/:id`
**Purpose**: Update user

**Request Body**:
```javascript
{
  "username": "updateduser",
  "role": "manager",
  "email": "updated@nexmax.com",
  "is_active": true
}
```

#### DELETE `/api/users/:id`
**Purpose**: Delete user

**Response**:
```javascript
{
  "success": true,
  "message": "User deleted successfully"
}
```

## 🔧 Utility APIs

#### GET `/api/health`
**Purpose**: Health check endpoint

**Response**:
```javascript
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-07-23T10:00:00Z",
    "version": "1.0.0"
  }
}
```

#### GET `/api/database-status`
**Purpose**: Database connection status

**Response**:
```javascript
{
  "success": true,
  "data": {
    "connected": true,
    "tables": ["deposit_daily", "withdraw_daily", "exchange_rate"],
    "totalRecords": 87500
  }
}
```

## ⚠️ Error Handling

### Error Response Format
```javascript
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `DUPLICATE_KEY`: Unique key constraint violation
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `DATABASE_ERROR`: Database operation failed
- `EXPORT_ERROR`: Export operation failed

### Error Examples

#### Validation Error
```javascript
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "amount": "Amount must be greater than 0",
    "date": "Date is required"
  }
}
```

#### Duplicate Key Error
```javascript
{
  "success": false,
  "error": "Record with this unique key already exists",
  "code": "DUPLICATE_KEY",
  "details": {
    "uniquekey": "2025-07-23-MYR-VIP-10000"
  }
}
```

#### Authentication Error
```javascript
{
  "success": false,
  "error": "Invalid credentials",
  "code": "UNAUTHORIZED"
}
```

## 📊 Rate Limiting

### Limits
- **General APIs**: 100 requests per minute
- **Export APIs**: 10 requests per minute
- **Authentication APIs**: 5 requests per minute

### Rate Limit Response
```javascript
{
  "success": false,
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
```

## 🔒 Security

### Authentication
- **JWT Tokens**: Stateless authentication
- **Session Management**: Secure session handling
- **Password Hashing**: bcrypt encryption

### Authorization
- **Role-based Access**: Admin, Manager, User roles
- **API Permissions**: Granular endpoint access
- **Data Filtering**: User-specific data access

### Data Protection
- **Input Validation**: Server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization
- **CSRF Protection**: Token-based protection

---

*This API documentation provides comprehensive information about all API endpoints in the NEXMAX Dashboard, including request/response formats, error handling, and security considerations.* 