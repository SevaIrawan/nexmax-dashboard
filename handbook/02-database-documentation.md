# NEXMAX Dashboard - Database Documentation

## 🗄️ Database Overview

### Database System
- **Database**: PostgreSQL 14+
- **Host**: localhost
- **Port**: 5432
- **Database Name**: nexmax
- **Connection Pool**: 20 connections

## 📊 Database Schema

### 1. Transaction Tables

#### deposit_daily
```sql
CREATE TABLE deposit_daily (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    year INTEGER NOT NULL,
    month VARCHAR(20) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    line VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    uniquekey VARCHAR(255) UNIQUE NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
- `id`: Primary key (auto-increment)
- `date`: Tanggal transaksi
- `year`: Tahun transaksi
- `month`: Bulan transaksi
- `currency`: Mata uang (MYR, SGD, USD)
- `line`: Line bisnis
- `amount`: Jumlah deposit
- `uniquekey`: Unique identifier
- `created_date`: Timestamp pembuatan
- `modified_date`: Timestamp modifikasi

#### withdraw_daily
```sql
CREATE TABLE withdraw_daily (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    year INTEGER NOT NULL,
    month VARCHAR(20) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    line VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    uniquekey VARCHAR(255) UNIQUE NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### exchange_rate
```sql
CREATE TABLE exchange_rate (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    month VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    total_sgd_to_myr DECIMAL(10,4) NOT NULL,
    usd_to_myr DECIMAL(10,4) NOT NULL,
    uniquekey VARCHAR(255) UNIQUE NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### headcount
```sql
CREATE TABLE headcount (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    year INTEGER NOT NULL,
    month VARCHAR(20) NOT NULL,
    totalsgd DECIMAL(15,2) NOT NULL,
    totalmyr DECIMAL(15,2) NOT NULL,
    totalusc DECIMAL(15,2) NOT NULL,
    uniquekey VARCHAR(255) UNIQUE NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Business Flow Tables

#### new_register
```sql
CREATE TABLE new_register (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    year INTEGER NOT NULL,
    month VARCHAR(20) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    line VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    uniquekey VARCHAR(255) UNIQUE NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### new_depositor
```sql
CREATE TABLE new_depositor (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    year INTEGER NOT NULL,
    month VARCHAR(20) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    line VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    uniquekey VARCHAR(255) UNIQUE NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### member_report_daily
```sql
CREATE TABLE member_report_daily (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    year INTEGER NOT NULL,
    month VARCHAR(20) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    line VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    uniquekey VARCHAR(255) UNIQUE NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### adjusment_daily
```sql
CREATE TABLE adjusment_daily (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    year INTEGER NOT NULL,
    month VARCHAR(20) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    line VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    uniquekey VARCHAR(255) UNIQUE NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. User Management Tables

#### users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    email VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);
```

**Roles:**
- `admin`: Full access to all features
- `manager`: Access to reports and analytics
- `user`: Basic access to dashboard

## 🔍 Key Queries

### 1. Main Dashboard Queries

#### Total Deposit Amount
```sql
SELECT 
    COALESCE(SUM(amount), 0) as total_deposit
FROM deposit_daily 
WHERE currency = $1 
    AND year = $2 
    AND month = $3;
```

#### Total Withdraw Amount
```sql
SELECT 
    COALESCE(SUM(amount), 0) as total_withdraw
FROM withdraw_daily 
WHERE currency = $1 
    AND year = $2 
    AND month = $3;
```

#### Gross Profit Calculation
```sql
SELECT 
    (SELECT COALESCE(SUM(amount), 0) FROM deposit_daily 
     WHERE currency = $1 AND year = $2 AND month = $3) -
    (SELECT COALESCE(SUM(amount), 0) FROM withdraw_daily 
     WHERE currency = $1 AND year = $2 AND month = $3) as gross_profit;
```

### 2. Chart Data Queries

#### Line Chart Data (Monthly Trend)
```sql
SELECT 
    month,
    SUM(amount) as total_amount
FROM deposit_daily 
WHERE currency = $1 AND year = $2
GROUP BY month 
ORDER BY month;
```

#### Bar Chart Data (Comparison)
```sql
SELECT 
    line,
    SUM(amount) as total_amount
FROM deposit_daily 
WHERE currency = $1 AND year = $2 AND month = $3
GROUP BY line 
ORDER BY total_amount DESC;
```

### 3. Transaction Management Queries

#### Paginated Data with Filters
```sql
SELECT * FROM deposit_daily 
WHERE 1=1
    AND ($1 = 'ALL' OR currency = $1)
    AND ($2 = 'ALL' OR line = $2)
    AND ($3 = 'ALL' OR year = $3)
    AND ($4 = '' OR month = $4)
ORDER BY date DESC, year DESC, month DESC
LIMIT $5 OFFSET $6;
```

#### Slicer Options
```sql
-- Get unique currencies
SELECT DISTINCT currency FROM deposit_daily WHERE currency IS NOT NULL;

-- Get unique lines
SELECT DISTINCT line FROM deposit_daily WHERE line IS NOT NULL;

-- Get unique years
SELECT DISTINCT year FROM deposit_daily WHERE year IS NOT NULL;

-- Get unique months
SELECT DISTINCT month FROM deposit_daily WHERE month IS NOT NULL;
```

### 4. Business Flow Queries

#### PPC Service Module Data
```sql
-- New Customer Conversion Rate
SELECT 
    COUNT(*) as new_customers,
    (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM new_register WHERE year = $1 AND month = $2)) as conversion_rate
FROM new_depositor 
WHERE year = $1 AND month = $2;

-- Customer Group Join Volume
SELECT 
    SUM(amount) as group_join_volume
FROM member_report_daily 
WHERE year = $1 AND month = $2;
```

#### First Depositor Module Data
```sql
-- 2nd Deposit Rate (In Group)
SELECT 
    COUNT(*) as second_deposits,
    (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM new_depositor WHERE year = $1 AND month = $2)) as deposit_rate
FROM new_depositor 
WHERE year = $1 AND month = $2 AND line LIKE '%group%';
```

## 🔧 Database Indexes

### Performance Indexes
```sql
-- Date-based queries
CREATE INDEX idx_deposit_daily_date ON deposit_daily(date);
CREATE INDEX idx_withdraw_daily_date ON withdraw_daily(date);
CREATE INDEX idx_exchange_rate_date ON exchange_rate(date);

-- Currency and year queries
CREATE INDEX idx_deposit_currency_year ON deposit_daily(currency, year);
CREATE INDEX idx_withdraw_currency_year ON withdraw_daily(currency, year);

-- Line-based queries
CREATE INDEX idx_deposit_line ON deposit_daily(line);
CREATE INDEX idx_withdraw_line ON withdraw_daily(line);

-- Unique key lookups
CREATE INDEX idx_deposit_uniquekey ON deposit_daily(uniquekey);
CREATE INDEX idx_withdraw_uniquekey ON withdraw_daily(uniquekey);
```

## 📊 Data Relationships

### 1. Transaction Flow
```
deposit_daily ←→ withdraw_daily (via currency, date, line)
exchange_rate ←→ deposit_daily (via date, currency)
```

### 2. Business Flow Relationships
```
new_register ←→ new_depositor (via date, currency)
member_report_daily ←→ adjusment_daily (via date, currency)
```

### 3. User Access Control
```
users ←→ all_tables (via role-based permissions)
```

## 🔄 Data Maintenance

### 1. Backup Strategy
```sql
-- Daily backup
pg_dump nexmax > backup_$(date +%Y%m%d).sql

-- Weekly full backup
pg_dump --format=custom nexmax > weekly_backup_$(date +%Y%m%d).dump
```

### 2. Data Cleanup
```sql
-- Archive old data (older than 2 years)
INSERT INTO archive_deposit_daily 
SELECT * FROM deposit_daily 
WHERE date < CURRENT_DATE - INTERVAL '2 years';

DELETE FROM deposit_daily 
WHERE date < CURRENT_DATE - INTERVAL '2 years';
```

### 3. Data Validation
```sql
-- Check for duplicate uniquekeys
SELECT uniquekey, COUNT(*) 
FROM deposit_daily 
GROUP BY uniquekey 
HAVING COUNT(*) > 1;

-- Check for invalid dates
SELECT * FROM deposit_daily 
WHERE date > CURRENT_DATE OR date < '2020-01-01';
```

## 🚀 Performance Optimization

### 1. Query Optimization
- **Use indexes** for frequently queried columns
- **Limit result sets** with pagination
- **Use appropriate data types** for columns
- **Optimize JOIN operations** with proper indexes

### 2. Connection Management
- **Connection pooling** to reduce overhead
- **Proper connection cleanup** to prevent leaks
- **Monitor connection usage** and adjust pool size

### 3. Monitoring
- **Query performance monitoring** with slow query logs
- **Database size monitoring** and cleanup
- **Index usage monitoring** and optimization

## 🔒 Security Considerations

### 1. Data Protection
- **Encrypt sensitive data** at rest
- **Use parameterized queries** to prevent SQL injection
- **Implement row-level security** for multi-tenant data

### 2. Access Control
- **Role-based permissions** for database access
- **Audit logging** for all database operations
- **Regular security updates** for PostgreSQL

### 3. Backup Security
- **Encrypt backup files** before storage
- **Secure backup storage** with proper access controls
- **Test backup restoration** regularly

---

*This database documentation provides comprehensive information about the NEXMAX Dashboard database structure, queries, and maintenance procedures.* 