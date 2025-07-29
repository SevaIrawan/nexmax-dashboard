/**
 * OVERVIEW DASHBOARD LOGIC
 * Centralized logic for Overview page analytics
 * 
 * @author NEXMAX Dashboard Team
 * @version 1.0.0
 * @date 2025-07-29
 */

import { pool } from '../database/postgresql.js';
import { formatCurrency, formatPercentage, calculateChange } from '../utils/formatters.js';

/**
 * Overview Dashboard Data Structure
 */
export class OverviewLogic {
  constructor() {
    this.currency = 'MYR';
    this.year = '2025';
    this.month = 'July';
  }

  /**
   * Fetch all Overview dashboard data
   */
  async fetchOverviewData(currency = 'MYR', year = '2025', month = 'July') {
    try {
      const [
        kpiData,
        retentionChurnData,
        clvFrequencyData,
        growthProfitabilityData,
        operationalEfficiencyData
      ] = await Promise.all([
        this.fetchKPIData(currency, year, month),
        this.fetchRetentionChurnData(currency, year),
        this.fetchCLVFrequencyData(currency, year),
        this.fetchGrowthProfitabilityData(currency, year),
        this.fetchOperationalEfficiencyData(currency, year)
      ]);

      return {
        kpiData,
        retentionChurnData,
        clvFrequencyData,
        growthProfitabilityData,
        operationalEfficiencyData,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching Overview data:', error);
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
          SUM(deposit_amount) as total_deposits,
          SUM(withdraw_amount) as total_withdrawals,
          COUNT(DISTINCT customer_id) as new_depositors,
          COUNT(DISTINCT CASE WHEN is_active = true THEN customer_id END) as active_members,
          SUM(CASE WHEN transaction_type = 'add' THEN amount ELSE 0 END) as add_transactions,
          SUM(CASE WHEN transaction_type = 'deduct' THEN amount ELSE 0 END) as deduct_transactions
        FROM transactions 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM transaction_date) = $2
        AND EXTRACT(MONTH FROM transaction_date) = $3
      `;

      const result = await pool.query(query, [currency, year, month]);
      const data = result.rows[0];

      return [
        {
          title: 'Total Deposits',
          value: formatCurrency(data.total_deposits || 0, currency),
          change: calculateChange(data.total_deposits, 0), // TODO: Compare with previous month
          icon: '💰',
          color: 'green'
        },
        {
          title: 'Total Withdrawals',
          value: formatCurrency(data.total_withdrawals || 0, currency),
          change: calculateChange(data.total_withdrawals, 0),
          icon: '💸',
          color: 'red'
        },
        {
          title: 'New Depositors',
          value: (data.new_depositors || 0).toLocaleString(),
          change: calculateChange(data.new_depositors, 0),
          icon: '👥',
          color: 'blue'
        },
        {
          title: 'Active Members',
          value: (data.active_members || 0).toLocaleString(),
          change: calculateChange(data.active_members, 0),
          icon: '✅',
          color: 'green'
        }
      ];
    } catch (error) {
      console.error('Error fetching KPI data:', error);
      return this.getDefaultKPIData();
    }
  }

  /**
   * Fetch Retention vs Churn Data
   */
  async fetchRetentionChurnData(currency, year) {
    try {
      const query = `
        SELECT 
          EXTRACT(MONTH FROM transaction_date) as month,
          COUNT(DISTINCT customer_id) as retained_customers,
          COUNT(DISTINCT CASE WHEN churn_date IS NOT NULL THEN customer_id END) as churned_customers
        FROM transactions 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM transaction_date) = $2
        GROUP BY EXTRACT(MONTH FROM transaction_date)
        ORDER BY month
      `;

      const result = await pool.query(query, [currency, year]);
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const retentionData = [];
      const churnData = [];

      result.rows.forEach(row => {
        const monthIndex = parseInt(row.month) - 1;
        retentionData[monthIndex] = row.retained_customers || 0;
        churnData[monthIndex] = row.churned_customers || 0;
      });

      return {
        categories: months,
        retentionData,
        churnData
      };
    } catch (error) {
      console.error('Error fetching Retention/Churn data:', error);
      return this.getDefaultRetentionChurnData();
    }
  }

  /**
   * Fetch CLV vs Purchase Frequency Data
   */
  async fetchCLVFrequencyData(currency, year) {
    try {
      const query = `
        SELECT 
          EXTRACT(MONTH FROM transaction_date) as month,
          AVG(customer_lifetime_value) as avg_clv,
          AVG(purchase_frequency) as avg_frequency
        FROM customer_analytics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM transaction_date) = $2
        GROUP BY EXTRACT(MONTH FROM transaction_date)
        ORDER BY month
      `;

      const result = await pool.query(query, [currency, year]);
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const clvData = [];
      const frequencyData = [];

      result.rows.forEach(row => {
        const monthIndex = parseInt(row.month) - 1;
        clvData[monthIndex] = row.avg_clv || 0;
        frequencyData[monthIndex] = row.avg_frequency || 0;
      });

      return {
        categories: months,
        clvData,
        frequencyData
      };
    } catch (error) {
      console.error('Error fetching CLV/Frequency data:', error);
      return this.getDefaultCLVFrequencyData();
    }
  }

  /**
   * Fetch Growth vs Profitability Data
   */
  async fetchGrowthProfitabilityData(currency, year) {
    try {
      const query = `
        SELECT 
          EXTRACT(MONTH FROM transaction_date) as month,
          SUM(revenue) as total_revenue,
          SUM(cost) as total_cost,
          SUM(revenue - cost) as net_profit,
          COUNT(DISTINCT customer_id) as new_customers
        FROM business_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM transaction_date) = $2
        GROUP BY EXTRACT(MONTH FROM transaction_date)
        ORDER BY month
      `;

      const result = await pool.query(query, [currency, year]);
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const netProfitData = [];
      const newCustomerData = [];

      result.rows.forEach(row => {
        const monthIndex = parseInt(row.month) - 1;
        netProfitData[monthIndex] = row.net_profit || 0;
        newCustomerData[monthIndex] = row.new_customers || 0;
      });

      return {
        categories: months,
        series: [
          { name: 'Net Profit', data: netProfitData },
          { name: 'New Customers', data: newCustomerData }
        ]
      };
    } catch (error) {
      console.error('Error fetching Growth/Profitability data:', error);
      return this.getDefaultGrowthProfitabilityData();
    }
  }

  /**
   * Fetch Operational Efficiency Data
   */
  async fetchOperationalEfficiencyData(currency, year) {
    try {
      const query = `
        SELECT 
          EXTRACT(MONTH FROM transaction_date) as month,
          SUM(revenue) as total_revenue,
          SUM(operational_cost) as total_cost
        FROM operational_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM transaction_date) = $2
        GROUP BY EXTRACT(MONTH FROM transaction_date)
        ORDER BY month
      `;

      const result = await pool.query(query, [currency, year]);
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const revenueData = [];
      const costData = [];

      result.rows.forEach(row => {
        const monthIndex = parseInt(row.month) - 1;
        revenueData[monthIndex] = row.total_revenue || 0;
        costData[monthIndex] = row.total_cost || 0;
      });

      return {
        categories: months,
        series: [
          { name: 'Total Revenue', data: revenueData },
          { name: 'Total Cost', data: costData }
        ]
      };
    } catch (error) {
      console.error('Error fetching Operational Efficiency data:', error);
      return this.getDefaultOperationalEfficiencyData();
    }
  }

  // Default data methods for fallback
  getDefaultKPIData() {
    return [
      { title: 'Total Deposits', value: '0', change: 0, icon: '💰', color: 'green' },
      { title: 'Total Withdrawals', value: '0', change: 0, icon: '💸', color: 'red' },
      { title: 'New Depositors', value: '0', change: 0, icon: '👥', color: 'blue' },
      { title: 'Active Members', value: '0', change: 0, icon: '✅', color: 'green' }
    ];
  }

  getDefaultRetentionChurnData() {
    return {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      retentionData: [0, 0, 0, 0, 0, 0, 0],
      churnData: [0, 0, 0, 0, 0, 0, 0]
    };
  }

  getDefaultCLVFrequencyData() {
    return {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      clvData: [0, 0, 0, 0, 0, 0, 0],
      frequencyData: [0, 0, 0, 0, 0, 0, 0]
    };
  }

  getDefaultGrowthProfitabilityData() {
    return {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      series: [
        { name: 'Net Profit', data: [0, 0, 0, 0, 0, 0, 0] },
        { name: 'New Customers', data: [0, 0, 0, 0, 0, 0, 0] }
      ]
    };
  }

  getDefaultOperationalEfficiencyData() {
    return {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      series: [
        { name: 'Total Revenue', data: [0, 0, 0, 0, 0, 0, 0] },
        { name: 'Total Cost', data: [0, 0, 0, 0, 0, 0, 0] }
      ]
    };
  }
}

export default OverviewLogic; 