/**
 * XOO DASHBOARD LOGIC
 * Centralized logic for XOO page analytics
 * 
 * @author NEXMAX Dashboard Team
 * @version 1.0.0
 * @date 2025-07-29
 */

import { pool } from '../database/postgresql.js';
import { formatCurrency, formatPercentage, calculateChange, formatNumber } from '../utils/formatters.js';

/**
 * XOO Dashboard Data Structure
 */
export class XOOLogic {
  constructor() {
    this.currency = 'MYR';
    this.year = '2025';
    this.month = 'July';
  }

  /**
   * Fetch all XOO dashboard data
   */
  async fetchXOOData(currency = 'MYR', year = '2025', month = 'July') {
    try {
      const [
        kpiData,
        chartData
      ] = await Promise.all([
        this.fetchKPIData(currency, year, month),
        this.fetchChartData(currency, year)
      ]);

      return {
        kpiData,
        chartData,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching XOO data:', error);
      throw error;
    }
  }

  /**
   * Fetch KPI Cards Data
   */
  async fetchKPIData(currency, year, month) {
    try {
      const query = `
        SELECT 
          SUM(total_revenue) as total_revenue,
          SUM(total_cost) as total_cost,
          COUNT(DISTINCT customer_id) as total_customers,
          AVG(transaction_value) as avg_transaction_value,
          COUNT(DISTINCT transaction_id) as total_transactions,
          SUM(commission_earned) as total_commission
        FROM xoo_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        AND EXTRACT(MONTH FROM date) = $3
      `;

      const result = await pool.query(query, [currency, year, month]);
      const data = result.rows[0];

      const totalRevenue = data.total_revenue || 0;
      const totalCost = data.total_cost || 0;
      const netProfit = totalRevenue - totalCost;
      const totalCustomers = data.total_customers || 0;
      const avgTransactionValue = data.avg_transaction_value || 0;
      const totalTransactions = data.total_transactions || 0;
      const totalCommission = data.total_commission || 0;

      return [
        {
          title: 'Total Revenue',
          value: formatCurrency(totalRevenue, currency),
          change: calculateChange(totalRevenue, 0),
          icon: '💰',
          color: 'green'
        },
        {
          title: 'Net Profit',
          value: formatCurrency(netProfit, currency),
          change: calculateChange(netProfit, 0),
          icon: '📈',
          color: 'blue'
        },
        {
          title: 'Total Customers',
          value: formatNumber(totalCustomers),
          change: calculateChange(totalCustomers, 0),
          icon: '👥',
          color: 'purple'
        },
        {
          title: 'Avg Transaction Value',
          value: formatCurrency(avgTransactionValue, currency),
          change: calculateChange(avgTransactionValue, 0),
          icon: '💳',
          color: 'orange'
        },
        {
          title: 'Total Transactions',
          value: formatNumber(totalTransactions),
          change: calculateChange(totalTransactions, 0),
          icon: '📊',
          color: 'cyan'
        },
        {
          title: 'Total Commission',
          value: formatCurrency(totalCommission, currency),
          change: calculateChange(totalCommission, 0),
          icon: '💎',
          color: 'gold'
        }
      ];
    } catch (error) {
      console.error('Error fetching XOO KPI data:', error);
      return this.getDefaultKPIData();
    }
  }

  /**
   * Fetch Chart Data
   */
  async fetchChartData(currency, year) {
    try {
      const [
        revenueByService,
        customerSegmentation,
        transactionVolume,
        profitMargins,
        monthlyPerformance
      ] = await Promise.all([
        this.fetchRevenueByService(currency, year),
        this.fetchCustomerSegmentation(currency, year),
        this.fetchTransactionVolume(currency, year),
        this.fetchProfitMargins(currency, year),
        this.fetchMonthlyPerformance(currency, year)
      ]);

      return {
        revenueByService,
        customerSegmentation,
        transactionVolume,
        profitMargins,
        monthlyPerformance
      };
    } catch (error) {
      console.error('Error fetching XOO chart data:', error);
      return this.getDefaultChartData();
    }
  }

  /**
   * Fetch Revenue by Service Type
   */
  async fetchRevenueByService(currency, year) {
    try {
      const query = `
        SELECT 
          service_type,
          SUM(revenue) as total_revenue,
          COUNT(DISTINCT customer_id) as customer_count,
          COUNT(DISTINCT transaction_id) as transaction_count
        FROM xoo_service_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY service_type
        ORDER BY total_revenue DESC
      `;

      const result = await pool.query(query, [currency, year]);
      
      const serviceTypes = result.rows.map(row => row.service_type);
      const revenues = result.rows.map(row => row.total_revenue || 0);
      const customerCounts = result.rows.map(row => row.customer_count || 0);
      const transactionCounts = result.rows.map(row => row.transaction_count || 0);

      return {
        categories: serviceTypes,
        revenues,
        customerCounts,
        transactionCounts
      };
    } catch (error) {
      console.error('Error fetching Revenue by Service:', error);
      return this.getDefaultRevenueByService();
    }
  }

  /**
   * Fetch Customer Segmentation
   */
  async fetchCustomerSegmentation(currency, year) {
    try {
      const query = `
        SELECT 
          customer_segment,
          COUNT(DISTINCT customer_id) as customer_count,
          SUM(total_value) as segment_value,
          AVG(transaction_frequency) as avg_frequency
        FROM xoo_customer_segments 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY customer_segment
        ORDER BY segment_value DESC
      `;

      const result = await pool.query(query, [currency, year]);
      
      const segments = result.rows.map(row => row.customer_segment);
      const customerCounts = result.rows.map(row => row.customer_count || 0);
      const segmentValues = result.rows.map(row => row.segment_value || 0);
      const avgFrequencies = result.rows.map(row => row.avg_frequency || 0);

      return {
        categories: segments,
        customerCounts,
        segmentValues,
        avgFrequencies
      };
    } catch (error) {
      console.error('Error fetching Customer Segmentation:', error);
      return this.getDefaultCustomerSegmentation();
    }
  }

  /**
   * Fetch Transaction Volume
   */
  async fetchTransactionVolume(currency, year) {
    try {
      const query = `
        SELECT 
          EXTRACT(MONTH FROM date) as month,
          COUNT(DISTINCT transaction_id) as transaction_count,
          SUM(transaction_value) as total_value,
          AVG(transaction_value) as avg_value
        FROM xoo_transactions 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY EXTRACT(MONTH FROM date)
        ORDER BY month
      `;

      const result = await pool.query(query, [currency, year]);
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const transactionCounts = [];
      const totalValues = [];
      const avgValues = [];

      result.rows.forEach(row => {
        const monthIndex = parseInt(row.month) - 1;
        transactionCounts[monthIndex] = row.transaction_count || 0;
        totalValues[monthIndex] = row.total_value || 0;
        avgValues[monthIndex] = row.avg_value || 0;
      });

      return {
        categories: months,
        transactionCounts,
        totalValues,
        avgValues
      };
    } catch (error) {
      console.error('Error fetching Transaction Volume:', error);
      return this.getDefaultTransactionVolume();
    }
  }

  /**
   * Fetch Profit Margins
   */
  async fetchProfitMargins(currency, year) {
    try {
      const query = `
        SELECT 
          service_category,
          SUM(revenue) as total_revenue,
          SUM(cost) as total_cost,
          ((SUM(revenue) - SUM(cost)) / SUM(revenue)) * 100 as profit_margin
        FROM xoo_profit_analysis 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY service_category
        ORDER BY profit_margin DESC
      `;

      const result = await pool.query(query, [currency, year]);
      
      const categories = result.rows.map(row => row.service_category);
      const revenues = result.rows.map(row => row.total_revenue || 0);
      const costs = result.rows.map(row => row.total_cost || 0);
      const margins = result.rows.map(row => row.profit_margin || 0);

      return {
        categories,
        revenues,
        costs,
        margins
      };
    } catch (error) {
      console.error('Error fetching Profit Margins:', error);
      return this.getDefaultProfitMargins();
    }
  }

  /**
   * Fetch Monthly Performance
   */
  async fetchMonthlyPerformance(currency, year) {
    try {
      const query = `
        SELECT 
          EXTRACT(MONTH FROM date) as month,
          SUM(revenue) as total_revenue,
          SUM(cost) as total_cost,
          COUNT(DISTINCT customer_id) as active_customers,
          COUNT(DISTINCT transaction_id) as total_transactions
        FROM xoo_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY EXTRACT(MONTH FROM date)
        ORDER BY month
      `;

      const result = await pool.query(query, [currency, year]);
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const revenueData = [];
      const costData = [];
      const customerData = [];
      const transactionData = [];

      result.rows.forEach(row => {
        const monthIndex = parseInt(row.month) - 1;
        revenueData[monthIndex] = row.total_revenue || 0;
        costData[monthIndex] = row.total_cost || 0;
        customerData[monthIndex] = row.active_customers || 0;
        transactionData[monthIndex] = row.total_transactions || 0;
      });

      return {
        categories: months,
        series: [
          { name: 'Revenue', data: revenueData },
          { name: 'Cost', data: costData },
          { name: 'Active Customers', data: customerData },
          { name: 'Transactions', data: transactionData }
        ]
      };
    } catch (error) {
      console.error('Error fetching Monthly Performance:', error);
      return this.getDefaultMonthlyPerformance();
    }
  }

  // Default data methods for fallback
  getDefaultKPIData() {
    return [
      { title: 'Total Revenue', value: '0', change: 0, icon: '💰', color: 'green' },
      { title: 'Net Profit', value: '0', change: 0, icon: '📈', color: 'blue' },
      { title: 'Total Customers', value: '0', change: 0, icon: '👥', color: 'purple' },
      { title: 'Avg Transaction Value', value: '0', change: 0, icon: '💳', color: 'orange' },
      { title: 'Total Transactions', value: '0', change: 0, icon: '📊', color: 'cyan' },
      { title: 'Total Commission', value: '0', change: 0, icon: '💎', color: 'gold' }
    ];
  }

  getDefaultChartData() {
    return {
      revenueByService: this.getDefaultRevenueByService(),
      customerSegmentation: this.getDefaultCustomerSegmentation(),
      transactionVolume: this.getDefaultTransactionVolume(),
      profitMargins: this.getDefaultProfitMargins(),
      monthlyPerformance: this.getDefaultMonthlyPerformance()
    };
  }

  getDefaultRevenueByService() {
    return {
      categories: ['Service A', 'Service B', 'Service C', 'Service D'],
      revenues: [0, 0, 0, 0],
      customerCounts: [0, 0, 0, 0],
      transactionCounts: [0, 0, 0, 0]
    };
  }

  getDefaultCustomerSegmentation() {
    return {
      categories: ['Premium', 'Standard', 'Basic', 'Trial'],
      customerCounts: [0, 0, 0, 0],
      segmentValues: [0, 0, 0, 0],
      avgFrequencies: [0, 0, 0, 0]
    };
  }

  getDefaultTransactionVolume() {
    return {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      transactionCounts: [0, 0, 0, 0, 0, 0, 0],
      totalValues: [0, 0, 0, 0, 0, 0, 0],
      avgValues: [0, 0, 0, 0, 0, 0, 0]
    };
  }

  getDefaultProfitMargins() {
    return {
      categories: ['Category A', 'Category B', 'Category C'],
      revenues: [0, 0, 0],
      costs: [0, 0, 0],
      margins: [0, 0, 0]
    };
  }

  getDefaultMonthlyPerformance() {
    return {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      series: [
        { name: 'Revenue', data: [0, 0, 0, 0, 0, 0, 0] },
        { name: 'Cost', data: [0, 0, 0, 0, 0, 0, 0] },
        { name: 'Active Customers', data: [0, 0, 0, 0, 0, 0, 0] },
        { name: 'Transactions', data: [0, 0, 0, 0, 0, 0, 0] }
      ]
    };
  }
}

export default XOOLogic; 