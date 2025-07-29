# NEXMAX Dashboard - Business Logic Documentation

## 🧮 Business Logic Overview

### Core Business Rules
NEXMAX Dashboard mengimplementasikan logika bisnis yang kompleks untuk analisis finansial, manajemen transaksi, dan perhitungan KPI. Semua formula dan perhitungan telah distandarisasi untuk konsistensi data.

## 💰 Financial Calculations

### 1. Profit Calculations

#### Gross Profit
```javascript
// Formula: Gross Profit = Total Revenue - Total Cost
const calculateGrossProfit = (revenue, cost) => {
  return revenue - cost;
};

// Implementation
const grossProfit = totalRevenue - totalCost;
```

#### Net Profit
```javascript
// Formula: Net Profit = Gross Profit - Operating Expenses
const calculateNetProfit = (grossProfit, operatingExpenses) => {
  return grossProfit - operatingExpenses;
};

// Implementation with additional factors
const netProfit = grossProfit - operatingExpenses - taxes - depreciation;
```

#### Profit Margin
```javascript
// Formula: Profit Margin = (Net Profit / Total Revenue) × 100
const calculateProfitMargin = (netProfit, totalRevenue) => {
  return (netProfit / totalRevenue) * 100;
};

// Implementation
const profitMargin = (netProfit / totalRevenue) * 100;
```

### 2. Revenue Calculations

#### Total Revenue
```javascript
// Formula: Total Revenue = Sum of all deposits
const calculateTotalRevenue = (deposits) => {
  return deposits.reduce((sum, deposit) => sum + deposit.amount, 0);
};

// Implementation with currency conversion
const totalRevenue = deposits.reduce((sum, deposit) => {
  const convertedAmount = convertCurrency(deposit.amount, deposit.currency, 'MYR');
  return sum + convertedAmount;
}, 0);
```

#### Revenue Growth Rate
```javascript
// Formula: Growth Rate = ((Current Period - Previous Period) / Previous Period) × 100
const calculateRevenueGrowth = (currentRevenue, previousRevenue) => {
  if (previousRevenue === 0) return 0;
  return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
};

// Implementation
const revenueGrowth = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
```

### 3. Cost Calculations

#### Total Cost
```javascript
// Formula: Total Cost = Sum of all withdrawals
const calculateTotalCost = (withdrawals) => {
  return withdrawals.reduce((sum, withdrawal) => sum + withdrawal.amount, 0);
};

// Implementation with currency conversion
const totalCost = withdrawals.reduce((sum, withdrawal) => {
  const convertedAmount = convertCurrency(withdrawal.amount, withdrawal.currency, 'MYR');
  return sum + convertedAmount;
}, 0);
```

#### Cost Efficiency Ratio
```javascript
// Formula: Cost Efficiency = (Total Revenue / Total Cost) × 100
const calculateCostEfficiency = (totalRevenue, totalCost) => {
  if (totalCost === 0) return 0;
  return (totalRevenue / totalCost) * 100;
};

// Implementation
const costEfficiency = (totalRevenue / totalCost) * 100;
```

## 👥 Customer Metrics

### 1. Customer Acquisition

#### New Customer Conversion Rate
```javascript
// Formula: Conversion Rate = (New Customers / Total Visitors) × 100
const calculateConversionRate = (newCustomers, totalVisitors) => {
  if (totalVisitors === 0) return 0;
  return (newCustomers / totalVisitors) * 100;
};

// Implementation for PPC Service Module
const conversionRate = (newCustomers / totalVisitors) * 100;
```

#### Customer Acquisition Cost (CAC)
```javascript
// Formula: CAC = Total Marketing Cost / Number of New Customers
const calculateCAC = (marketingCost, newCustomers) => {
  if (newCustomers === 0) return 0;
  return marketingCost / newCustomers;
};

// Implementation
const cac = marketingCost / newCustomers;
```

### 2. Customer Retention

#### Customer Retention Rate
```javascript
// Formula: Retention Rate = ((Total Customers - New Customers) / Previous Period Customers) × 100
const calculateRetentionRate = (totalCustomers, newCustomers, previousCustomers) => {
  if (previousCustomers === 0) return 0;
  const retainedCustomers = totalCustomers - newCustomers;
  return (retainedCustomers / previousCustomers) * 100;
};

// Implementation
const retentionRate = ((totalCustomers - newCustomers) / previousCustomers) * 100;
```

#### Churn Rate
```javascript
// Formula: Churn Rate = (Lost Customers / Total Customers) × 100
const calculateChurnRate = (lostCustomers, totalCustomers) => {
  if (totalCustomers === 0) return 0;
  return (lostCustomers / totalCustomers) * 100;
};

// Implementation
const churnRate = (lostCustomers / totalCustomers) * 100;
```

### 3. Customer Lifetime Value (CLV)

#### Basic CLV
```javascript
// Formula: CLV = Average Purchase Value × Purchase Frequency × Customer Lifespan
const calculateCLV = (avgPurchaseValue, purchaseFrequency, customerLifespan) => {
  return avgPurchaseValue * purchaseFrequency * customerLifespan;
};

// Implementation
const clv = avgPurchaseValue * purchaseFrequency * customerLifespan;
```

#### Advanced CLV with Discount Rate
```javascript
// Formula: CLV = Σ(Revenue per period / (1 + Discount Rate)^period)
const calculateAdvancedCLV = (revenuePerPeriod, discountRate, periods) => {
  let clv = 0;
  for (let period = 1; period <= periods; period++) {
    clv += revenuePerPeriod / Math.pow(1 + discountRate, period);
  }
  return clv;
};

// Implementation
const advancedCLV = revenuePerPeriod.reduce((sum, revenue, period) => {
  return sum + (revenue / Math.pow(1 + discountRate, period + 1));
}, 0);
```

## 💳 Transaction Analysis

### 1. Deposit Analysis

#### Average Deposit Amount
```javascript
// Formula: Average Deposit = Total Deposit Amount / Number of Deposits
const calculateAverageDeposit = (totalAmount, numberOfDeposits) => {
  if (numberOfDeposits === 0) return 0;
  return totalAmount / numberOfDeposits;
};

// Implementation
const avgDeposit = totalDepositAmount / numberOfDeposits;
```

#### Deposit Frequency
```javascript
// Formula: Deposit Frequency = Number of Deposits / Number of Customers
const calculateDepositFrequency = (numberOfDeposits, numberOfCustomers) => {
  if (numberOfCustomers === 0) return 0;
  return numberOfDeposits / numberOfCustomers;
};

// Implementation
const depositFrequency = numberOfDeposits / numberOfCustomers;
```

### 2. Withdrawal Analysis

#### Withdrawal Rate
```javascript
// Formula: Withdrawal Rate = (Total Withdrawals / Total Deposits) × 100
const calculateWithdrawalRate = (totalWithdrawals, totalDeposits) => {
  if (totalDeposits === 0) return 0;
  return (totalWithdrawals / totalDeposits) * 100;
};

// Implementation
const withdrawalRate = (totalWithdrawals / totalDeposits) * 100;
```

#### Net Cash Flow
```javascript
// Formula: Net Cash Flow = Total Deposits - Total Withdrawals
const calculateNetCashFlow = (totalDeposits, totalWithdrawals) => {
  return totalDeposits - totalWithdrawals;
};

// Implementation
const netCashFlow = totalDeposits - totalWithdrawals;
```

## 📊 Business Flow Calculations

### 1. PPC Service Module

#### New Customer Conversion Rate
```javascript
// Formula: Conversion Rate = (New Customers / Total PPC Clicks) × 100
const calculatePPCConversionRate = (newCustomers, totalClicks) => {
  if (totalClicks === 0) return 0;
  return (newCustomers / totalClicks) * 100;
};

// Implementation
const ppcConversionRate = (newCustomers / totalClicks) * 100;
```

#### Customer Group Join Volume
```javascript
// Formula: Group Join Volume = Sum of all group join transactions
const calculateGroupJoinVolume = (groupTransactions) => {
  return groupTransactions.reduce((sum, transaction) => {
    return sum + transaction.amount;
  }, 0);
};

// Implementation
const groupJoinVolume = groupTransactions.reduce((sum, transaction) => {
  return sum + transaction.amount;
}, 0);
```

### 2. First Depositor Module

#### 2nd Deposit Rate (In Group)
```javascript
// Formula: 2nd Deposit Rate = (2nd Deposits in Group / Total 1st Deposits) × 100
const calculate2ndDepositRateInGroup = (secondDepositsInGroup, totalFirstDeposits) => {
  if (totalFirstDeposits === 0) return 0;
  return (secondDepositsInGroup / totalFirstDeposits) * 100;
};

// Implementation
const secondDepositRateInGroup = (secondDepositsInGroup / totalFirstDeposits) * 100;
```

#### 2nd Deposit Rate (Not In Group)
```javascript
// Formula: 2nd Deposit Rate = (2nd Deposits Not In Group / Total 1st Deposits) × 100
const calculate2ndDepositRateNotInGroup = (secondDepositsNotInGroup, totalFirstDeposits) => {
  if (totalFirstDeposits === 0) return 0;
  return (secondDepositsNotInGroup / totalFirstDeposits) * 100;
};

// Implementation
const secondDepositRateNotInGroup = (secondDepositsNotInGroup / totalFirstDeposits) * 100;
```

### 3. Old Member Module

#### Upgrade Rate by Tier
```javascript
// Formula: Upgrade Rate = (Upgraded Members / Total Members in Tier) × 100
const calculateUpgradeRateByTier = (upgradedMembers, totalMembersInTier) => {
  if (totalMembersInTier === 0) return 0;
  return (upgradedMembers / totalMembersInTier) * 100;
};

// Implementation for each tier
const upgradeRates = {
  bronze: (upgradedBronze / totalBronze) * 100,
  silver: (upgradedSilver / totalSilver) * 100,
  gold: (upgradedGold / totalGold) * 100,
  platinum: (upgradedPlatinum / totalPlatinum) * 100,
  diamond: (upgradedDiamond / totalDiamond) * 100
};
```

#### Churn Rate by Tier
```javascript
// Formula: Churn Rate = (Churned Members / Total Members in Tier) × 100
const calculateChurnRateByTier = (churnedMembers, totalMembersInTier) => {
  if (totalMembersInTier === 0) return 0;
  return (churnedMembers / totalMembersInTier) * 100;
};

// Implementation for each tier
const churnRates = {
  bronze: (churnedBronze / totalBronze) * 100,
  silver: (churnedSilver / totalSilver) * 100,
  gold: (churnedGold / totalGold) * 100,
  platinum: (churnedPlatinum / totalPlatinum) * 100,
  diamond: (churnedDiamond / totalDiamond) * 100
};
```

### 4. Traffic Executive Module

#### Customer Transfer Success Rate
```javascript
// Formula: Transfer Success Rate = (Successful Transfers / Total Transfer Attempts) × 100
const calculateTransferSuccessRate = (successfulTransfers, totalTransferAttempts) => {
  if (totalTransferAttempts === 0) return 0;
  return (successfulTransfers / totalTransferAttempts) * 100;
};

// Implementation
const transferSuccessRate = (successfulTransfers / totalTransferAttempts) * 100;
```

#### Customer Reactivation Rate
```javascript
// Formula: Reactivation Rate = (Reactivated Customers / Total Inactive Customers) × 100
const calculateReactivationRate = (reactivatedCustomers, totalInactiveCustomers) => {
  if (totalInactiveCustomers === 0) return 0;
  return (reactivatedCustomers / totalInactiveCustomers) * 100;
};

// Implementation
const reactivationRate = (reactivatedCustomers / totalInactiveCustomers) * 100;
```

## 🔄 Currency Conversion

### 1. Exchange Rate Calculations

#### SGD to MYR Conversion
```javascript
// Formula: MYR Amount = SGD Amount × SGD to MYR Rate
const convertSGDToMYR = (sgdAmount, exchangeRate) => {
  return sgdAmount * exchangeRate;
};

// Implementation
const myrAmount = sgdAmount * sgdToMyrRate;
```

#### USD to MYR Conversion
```javascript
// Formula: MYR Amount = USD Amount × USD to MYR Rate
const convertUSDToMYR = (usdAmount, exchangeRate) => {
  return usdAmount * exchangeRate;
};

// Implementation
const myrAmount = usdAmount * usdToMyrRate;
```

### 2. Multi-Currency Aggregation
```javascript
// Convert all currencies to MYR for consistent reporting
const aggregateMultiCurrency = (transactions) => {
  return transactions.reduce((total, transaction) => {
    let convertedAmount = transaction.amount;
    
    switch (transaction.currency) {
      case 'SGD':
        convertedAmount = transaction.amount * getExchangeRate('SGD', 'MYR');
        break;
      case 'USD':
        convertedAmount = transaction.amount * getExchangeRate('USD', 'MYR');
        break;
      case 'MYR':
      default:
        convertedAmount = transaction.amount;
    }
    
    return total + convertedAmount;
  }, 0);
};

// Implementation
const totalInMYR = aggregateMultiCurrency(transactions);
```

## 📈 Trend Analysis

### 1. Moving Averages

#### Simple Moving Average
```javascript
// Formula: SMA = (Sum of n periods) / n
const calculateSMA = (data, period) => {
  if (data.length < period) return null;
  
  const sum = data.slice(-period).reduce((acc, val) => acc + val, 0);
  return sum / period;
};

// Implementation
const sma = calculateSMA(revenueData, 7); // 7-day moving average
```

#### Exponential Moving Average
```javascript
// Formula: EMA = (Current Value × Multiplier) + (Previous EMA × (1 - Multiplier))
const calculateEMA = (data, period) => {
  const multiplier = 2 / (period + 1);
  let ema = data[0];
  
  for (let i = 1; i < data.length; i++) {
    ema = (data[i] * multiplier) + (ema * (1 - multiplier));
  }
  
  return ema;
};

// Implementation
const ema = calculateEMA(revenueData, 7);
```

### 2. Growth Rate Calculations

#### Month-over-Month Growth
```javascript
// Formula: MoM Growth = ((Current Month - Previous Month) / Previous Month) × 100
const calculateMoMGrowth = (currentMonth, previousMonth) => {
  if (previousMonth === 0) return 0;
  return ((currentMonth - previousMonth) / previousMonth) * 100;
};

// Implementation
const momGrowth = ((currentMonth - previousMonth) / previousMonth) * 100;
```

#### Year-over-Year Growth
```javascript
// Formula: YoY Growth = ((Current Year - Previous Year) / Previous Year) × 100
const calculateYoYGrowth = (currentYear, previousYear) => {
  if (previousYear === 0) return 0;
  return ((currentYear - previousYear) / previousYear) * 100;
};

// Implementation
const yoyGrowth = ((currentYear - previousYear) / previousYear) * 100;
```

## 🎯 KPI Calculations

### 1. Financial KPIs

#### Return on Investment (ROI)
```javascript
// Formula: ROI = ((Net Profit - Investment) / Investment) × 100
const calculateROI = (netProfit, investment) => {
  if (investment === 0) return 0;
  return ((netProfit - investment) / investment) * 100;
};

// Implementation
const roi = ((netProfit - investment) / investment) * 100;
```

#### Revenue per Customer
```javascript
// Formula: Revenue per Customer = Total Revenue / Number of Customers
const calculateRevenuePerCustomer = (totalRevenue, numberOfCustomers) => {
  if (numberOfCustomers === 0) return 0;
  return totalRevenue / numberOfCustomers;
};

// Implementation
const revenuePerCustomer = totalRevenue / numberOfCustomers;
```

### 2. Operational KPIs

#### Customer Satisfaction Score
```javascript
// Formula: CSAT = (Satisfied Customers / Total Respondents) × 100
const calculateCSAT = (satisfiedCustomers, totalRespondents) => {
  if (totalRespondents === 0) return 0;
  return (satisfiedCustomers / totalRespondents) * 100;
};

// Implementation
const csat = (satisfiedCustomers / totalRespondents) * 100;
```

#### Net Promoter Score (NPS)
```javascript
// Formula: NPS = % Promoters - % Detractors
const calculateNPS = (promoters, passives, detractors) => {
  const total = promoters + passives + detractors;
  if (total === 0) return 0;
  
  const promoterPercentage = (promoters / total) * 100;
  const detractorPercentage = (detractors / total) * 100;
  
  return promoterPercentage - detractorPercentage;
};

// Implementation
const nps = ((promoters / total) * 100) - ((detractors / total) * 100);
```

## 🔧 Data Validation Rules

### 1. Transaction Validation
```javascript
// Validate deposit amounts
const validateDepositAmount = (amount) => {
  return amount > 0 && amount <= 1000000; // Max 1M
};

// Validate withdrawal amounts
const validateWithdrawalAmount = (amount, availableBalance) => {
  return amount > 0 && amount <= availableBalance;
};

// Validate exchange rates
const validateExchangeRate = (rate) => {
  return rate > 0 && rate < 100; // Reasonable range
};
```

### 2. Date Validation
```javascript
// Validate transaction dates
const validateTransactionDate = (date) => {
  const transactionDate = new Date(date);
  const currentDate = new Date();
  const minDate = new Date('2020-01-01');
  
  return transactionDate >= minDate && transactionDate <= currentDate;
};

// Validate date ranges
const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return start <= end && (end - start) <= (365 * 24 * 60 * 60 * 1000); // Max 1 year
};
```

### 3. Currency Validation
```javascript
// Validate currency codes
const validateCurrency = (currency) => {
  const validCurrencies = ['MYR', 'SGD', 'USD'];
  return validCurrencies.includes(currency);
};

// Validate currency conversion
const validateCurrencyConversion = (fromCurrency, toCurrency, rate) => {
  if (fromCurrency === toCurrency) {
    return rate === 1;
  }
  return rate > 0;
};
```

## 📊 Statistical Calculations

### 1. Descriptive Statistics
```javascript
// Calculate mean
const calculateMean = (data) => {
  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
};

// Calculate median
const calculateMedian = (data) => {
  const sorted = data.sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
};

// Calculate standard deviation
const calculateStandardDeviation = (data) => {
  const mean = calculateMean(data);
  const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
  const variance = calculateMean(squaredDiffs);
  return Math.sqrt(variance);
};
```

### 2. Percentile Calculations
```javascript
// Calculate percentile
const calculatePercentile = (data, percentile) => {
  const sorted = data.sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  
  if (Number.isInteger(index)) {
    return sorted[index];
  }
  
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
};

// Implementation
const p95 = calculatePercentile(data, 95);
const p99 = calculatePercentile(data, 99);
```

## 🔄 Business Rules Engine

### 1. Rule Definitions
```javascript
// Business rules configuration
const businessRules = {
  // Minimum transaction amounts
  minDepositAmount: 10,
  minWithdrawalAmount: 50,
  
  // Maximum transaction amounts
  maxDepositAmount: 1000000,
  maxWithdrawalAmount: 500000,
  
  // Conversion rate limits
  maxConversionRate: 10,
  minConversionRate: 0.1,
  
  // Customer limits
  maxDailyTransactions: 10,
  maxMonthlyTransactions: 100
};
```

### 2. Rule Validation
```javascript
// Validate business rules
const validateBusinessRules = (transaction) => {
  const rules = businessRules;
  const violations = [];
  
  // Check minimum amounts
  if (transaction.type === 'deposit' && transaction.amount < rules.minDepositAmount) {
    violations.push(`Deposit amount must be at least ${rules.minDepositAmount}`);
  }
  
  if (transaction.type === 'withdrawal' && transaction.amount < rules.minWithdrawalAmount) {
    violations.push(`Withdrawal amount must be at least ${rules.minWithdrawalAmount}`);
  }
  
  // Check maximum amounts
  if (transaction.type === 'deposit' && transaction.amount > rules.maxDepositAmount) {
    violations.push(`Deposit amount cannot exceed ${rules.maxDepositAmount}`);
  }
  
  if (transaction.type === 'withdrawal' && transaction.amount > rules.maxWithdrawalAmount) {
    violations.push(`Withdrawal amount cannot exceed ${rules.maxWithdrawalAmount}`);
  }
  
  return violations;
};
```

### 3. Automated Calculations
```javascript
// Auto-calculate derived fields
const calculateDerivedFields = (transaction) => {
  // Auto-calculate year and month from date
  const date = new Date(transaction.date);
  transaction.year = date.getFullYear();
  transaction.month = date.toLocaleString('en-US', { month: 'long' });
  
  // Auto-generate unique key
  transaction.uniquekey = generateUniqueKey(transaction);
  
  // Auto-calculate timestamps
  transaction.created_date = new Date().toISOString();
  transaction.modified_date = new Date().toISOString();
  
  return transaction;
};

// Generate unique key
const generateUniqueKey = (transaction) => {
  const { date, currency, line, amount } = transaction;
  return `${date}-${currency}-${line}-${amount}`;
};
```

---

*This business logic documentation provides comprehensive information about all calculations, formulas, and business rules implemented in the NEXMAX Dashboard.* 