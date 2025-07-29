/**
 * STRATEGIC EXECUTIVE DASHBOARD LOGIC
 * Centralized logic for Strategic Executive page analytics
 * 
 * @author NEXMAX Dashboard Team
 * @version 1.0.0
 * @date 2025-07-29
 */

import { pool } from '../database/postgresql.js';
import { formatCurrency, formatPercentage, calculateChange } from '../utils/formatters.js';

/**
 * Strategic Executive Dashboard Data Structure
 */
export class StrategicExecutiveLogic {
  constructor() {
    this.currency = 'MYR';
    this.year = '2025';
    this.month = 'July';
  }

  /**
   * Fetch all Strategic Executive dashboard data
   */
  async fetchStrategicExecutiveData(currency = 'MYR', year = '2025', month = 'July') {
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
      console.error('Error fetching Strategic Executive data:', error);
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
          SUM(revenue) as total_revenue,
          SUM(cost) as total_cost,
          SUM(revenue - cost) as net_profit,
          COUNT(DISTINCT customer_id) as total_customers,
          AVG(customer_lifetime_value) as avg_clv,
          COUNT(DISTINCT CASE WHEN is_active = true THEN customer_id END) as active_customers
        FROM strategic_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        AND EXTRACT(MONTH FROM date) = $3
      `;

      const result = await pool.query(query, [currency, year, month]);
      const data = result.rows[0];

      const totalRevenue = data.total_revenue || 0;
      const totalCost = data.total_cost || 0;
      const netProfit = data.net_profit || 0;
      const totalCustomers = data.total_customers || 0;
      const avgCLV = data.avg_clv || 0;
      const activeCustomers = data.active_customers || 0;

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
          value: totalCustomers.toLocaleString(),
          change: calculateChange(totalCustomers, 0),
          icon: '👥',
          color: 'purple'
        },
        {
          title: 'Avg Customer Lifetime Value',
          value: formatCurrency(avgCLV, currency),
          change: calculateChange(avgCLV, 0),
          icon: '💎',
          color: 'orange'
        },
        {
          title: 'Active Customers',
          value: activeCustomers.toLocaleString(),
          change: calculateChange(activeCustomers, 0),
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
   * Fetch Chart Data
   */
  async fetchChartData(currency, year) {
    try {
      const [
        ggrUserTrend,
        ggrPureUserTrend,
        customerValueTrend,
        customerCountTrend,
        customerVolumeDept
      ] = await Promise.all([
        this.fetchGGRUserTrend(currency, year),
        this.fetchGGRPureUserTrend(currency, year),
        this.fetchCustomerValueTrend(currency, year),
        this.fetchCustomerCountTrend(currency, year),
        this.fetchCustomerVolumeDept(currency, year)
      ]);

      return {
        ggrUserTrend,
        ggrPureUserTrend,
        customerValueTrend,
        customerCountTrend,
        customerVolumeDept
      };
    } catch (error) {
      console.error('Error fetching chart data:', error);
      return this.getDefaultChartData();
    }
  }

  /**
   * Fetch GGR User Trend
   */
  async fetchGGRUserTrend(currency, year) {
    try {
      const query = `
        SELECT 
          EXTRACT(MONTH FROM date) as month,
          SUM(ggr_amount) as ggr_amount,
          COUNT(DISTINCT user_id) as user_count
        FROM ggr_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY EXTRACT(MONTH FROM date)
        ORDER BY month
      `;

      const result = await pool.query(query, [currency, year]);
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const ggrData = [];
      const userData = [];

      result.rows.forEach(row => {
        const monthIndex = parseInt(row.month) - 1;
        ggrData[monthIndex] = row.ggr_amount || 0;
        userData[monthIndex] = row.user_count || 0;
      });

      return {
        categories: months,
        series: [
          { name: 'GGR Amount', data: ggrData },
          { name: 'User Count', data: userData }
        ]
      };
    } catch (error) {
      console.error('Error fetching GGR User Trend:', error);
      return this.getDefaultGGRUserTrend();
    }
  }

  /**
   * Fetch GGR Pure User Trend
   */
  async fetchGGRPureUserTrend(currency, year) {
    try {
      const query = `
        SELECT 
          EXTRACT(MONTH FROM date) as month,
          SUM(pure_ggr_amount) as pure_ggr_amount,
          COUNT(DISTINCT pure_user_id) as pure_user_count
        FROM ggr_pure_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY EXTRACT(MONTH FROM date)
        ORDER BY month
      `;

      const result = await pool.query(query, [currency, year]);
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const pureGgrData = [];
      const pureUserData = [];

      result.rows.forEach(row => {
        const monthIndex = parseInt(row.month) - 1;
        pureGgrData[monthIndex] = row.pure_ggr_amount || 0;
        pureUserData[monthIndex] = row.pure_user_count || 0;
      });

      return {
        categories: months,
        series: [
          { name: 'Pure GGR Amount', data: pureGgrData },
          { name: 'Pure User Count', data: pureUserData }
        ]
      };
    } catch (error) {
      console.error('Error fetching GGR Pure User Trend:', error);
      return this.getDefaultGGRPureUserTrend();
    }
  }

  /**
   * Fetch Customer Value per Headcount Trend
   */
  async fetchCustomerValueTrend(currency, year) {
    try {
      const query = `
        SELECT 
          EXTRACT(MONTH FROM date) as month,
          AVG(customer_value_per_headcount) as avg_customer_value,
          COUNT(DISTINCT headcount_id) as headcount_count
        FROM customer_value_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY EXTRACT(MONTH FROM date)
        ORDER BY month
      `;

      const result = await pool.query(query, [currency, year]);
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const customerValueData = [];
      const headcountData = [];

      result.rows.forEach(row => {
        const monthIndex = parseInt(row.month) - 1;
        customerValueData[monthIndex] = row.avg_customer_value || 0;
        headcountData[monthIndex] = row.headcount_count || 0;
      });

      return {
        categories: months,
        series: [
          { name: 'Customer Value per Headcount', data: customerValueData },
          { name: 'Headcount Count', data: headcountData }
        ]
      };
    } catch (error) {
      console.error('Error fetching Customer Value Trend:', error);
      return this.getDefaultCustomerValueTrend();
    }
  }

  /**
   * Fetch Customer Count vs Headcount Trend
   */
  async fetchCustomerCountTrend(currency, year) {
    try {
      const query = `
        SELECT 
          EXTRACT(MONTH FROM date) as month,
          COUNT(DISTINCT customer_id) as customer_count,
          COUNT(DISTINCT headcount_id) as headcount_count
        FROM customer_headcount_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY EXTRACT(MONTH FROM date)
        ORDER BY month
      `;

      const result = await pool.query(query, [currency, year]);
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const customerCountData = [];
      const headcountCountData = [];

      result.rows.forEach(row => {
        const monthIndex = parseInt(row.month) - 1;
        customerCountData[monthIndex] = row.customer_count || 0;
        headcountCountData[monthIndex] = row.headcount_count || 0;
      });

      return {
        categories: months,
        series: [
          { name: 'Customer Count', data: customerCountData },
          { name: 'Headcount Count', data: headcountCountData }
        ]
      };
    } catch (error) {
      console.error('Error fetching Customer Count Trend:', error);
      return this.getDefaultCustomerCountTrend();
    }
  }

  /**
   * Fetch Customer Volume by Department
   */
  async fetchCustomerVolumeDept(currency, year) {
    try {
      const query = `
        SELECT 
          department,
          COUNT(DISTINCT customer_id) as customer_count,
          SUM(volume) as total_volume
        FROM customer_volume_dept_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY department
        ORDER BY total_volume DESC
      `;

      const result = await pool.query(query, [currency, year]);
      
      const departments = result.rows.map(row => row.department);
      const customerCounts = result.rows.map(row => row.customer_count);
      const volumes = result.rows.map(row => row.total_volume);

      return {
        categories: departments,
        series: [
          { name: 'Customer Count', data: customerCounts },
          { name: 'Total Volume', data: volumes }
        ]
      };
    } catch (error) {
      console.error('Error fetching Customer Volume by Department:', error);
      return this.getDefaultCustomerVolumeDept();
    }
  }

  // Default data methods for fallback
  getDefaultKPIData() {
    return [
      { title: 'Total Revenue', value: '0', change: 0, icon: '💰', color: 'green' },
      { title: 'Net Profit', value: '0', change: 0, icon: '📈', color: 'blue' },
      { title: 'Total Customers', value: '0', change: 0, icon: '👥', color: 'purple' },
      { title: 'Avg Customer Lifetime Value', value: '0', change: 0, icon: '💎', color: 'orange' },
      { title: 'Active Customers', value: '0', change: 0, icon: '✅', color: 'green' }
    ];
  }

  getDefaultChartData() {
    return {
      ggrUserTrend: this.getDefaultGGRUserTrend(),
      ggrPureUserTrend: this.getDefaultGGRPureUserTrend(),
      customerValueTrend: this.getDefaultCustomerValueTrend(),
      customerCountTrend: this.getDefaultCustomerCountTrend(),
      customerVolumeDept: this.getDefaultCustomerVolumeDept()
    };
  }

  getDefaultGGRUserTrend() {
    return {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      series: [
        { name: 'GGR Amount', data: [0, 0, 0, 0, 0, 0, 0] },
        { name: 'User Count', data: [0, 0, 0, 0, 0, 0, 0] }
      ]
    };
  }

  getDefaultGGRPureUserTrend() {
    return {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      series: [
        { name: 'Pure GGR Amount', data: [0, 0, 0, 0, 0, 0, 0] },
        { name: 'Pure User Count', data: [0, 0, 0, 0, 0, 0, 0] }
      ]
    };
  }

  getDefaultCustomerValueTrend() {
    return {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      series: [
        { name: 'Customer Value per Headcount', data: [0, 0, 0, 0, 0, 0, 0] },
        { name: 'Headcount Count', data: [0, 0, 0, 0, 0, 0, 0] }
      ]
    };
  }

  getDefaultCustomerCountTrend() {
    return {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      series: [
        { name: 'Customer Count', data: [0, 0, 0, 0, 0, 0, 0] },
        { name: 'Headcount Count', data: [0, 0, 0, 0, 0, 0, 0] }
      ]
    };
  }

  getDefaultCustomerVolumeDept() {
    return {
      categories: ['Sales', 'Marketing', 'Support', 'Operations'],
      series: [
        { name: 'Customer Count', data: [0, 0, 0, 0] },
        { name: 'Total Volume', data: [0, 0, 0, 0] }
      ]
    };
  }
}

export default StrategicExecutiveLogic; 