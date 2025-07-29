/**
 * OS DASHBOARD LOGIC
 * Centralized logic for OS (Operating System) page analytics
 * 
 * @author NEXMAX Dashboard Team
 * @version 1.0.0
 * @date 2025-07-29
 */

import { pool } from '../database/postgresql.js';
import { formatCurrency, formatPercentage, calculateChange, formatNumber } from '../utils/formatters.js';

/**
 * OS Dashboard Data Structure
 */
export class OSLogic {
  constructor() {
    this.currency = 'MYR';
    this.year = '2025';
    this.month = 'July';
  }

  /**
   * Fetch all OS dashboard data
   */
  async fetchOSData(currency = 'MYR', year = '2025', month = 'July') {
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
      console.error('Error fetching OS data:', error);
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
          SUM(system_revenue) as total_revenue,
          SUM(operational_cost) as total_cost,
          COUNT(DISTINCT user_id) as total_users,
          AVG(system_uptime) as avg_uptime,
          COUNT(DISTINCT session_id) as total_sessions,
          AVG(response_time) as avg_response_time
        FROM os_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        AND EXTRACT(MONTH FROM date) = $3
      `;

      const result = await pool.query(query, [currency, year, month]);
      const data = result.rows[0];

      const totalRevenue = data.total_revenue || 0;
      const totalCost = data.total_cost || 0;
      const netProfit = totalRevenue - totalCost;
      const totalUsers = data.total_users || 0;
      const avgUptime = data.avg_uptime || 0;
      const totalSessions = data.total_sessions || 0;
      const avgResponseTime = data.avg_response_time || 0;

      return [
        {
          title: 'System Revenue',
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
          title: 'Total Users',
          value: formatNumber(totalUsers),
          change: calculateChange(totalUsers, 0),
          icon: '👥',
          color: 'purple'
        },
        {
          title: 'System Uptime',
          value: formatPercentage(avgUptime),
          change: calculateChange(avgUptime, 0),
          icon: '⚡',
          color: 'green'
        },
        {
          title: 'Total Sessions',
          value: formatNumber(totalSessions),
          change: calculateChange(totalSessions, 0),
          icon: '📊',
          color: 'orange'
        },
        {
          title: 'Avg Response Time',
          value: `${avgResponseTime.toFixed(2)}ms`,
          change: calculateChange(avgResponseTime, 0),
          icon: '⏱️',
          color: 'cyan'
        }
      ];
    } catch (error) {
      console.error('Error fetching OS KPI data:', error);
      return this.getDefaultKPIData();
    }
  }

  /**
   * Fetch Chart Data
   */
  async fetchChartData(currency, year) {
    try {
      const [
        systemPerformance,
        userActivity,
        resourceUtilization,
        errorAnalysis,
        monthlyTrends
      ] = await Promise.all([
        this.fetchSystemPerformance(currency, year),
        this.fetchUserActivity(currency, year),
        this.fetchResourceUtilization(currency, year),
        this.fetchErrorAnalysis(currency, year),
        this.fetchMonthlyTrends(currency, year)
      ]);

      return {
        systemPerformance,
        userActivity,
        resourceUtilization,
        errorAnalysis,
        monthlyTrends
      };
    } catch (error) {
      console.error('Error fetching OS chart data:', error);
      return this.getDefaultChartData();
    }
  }

  /**
   * Fetch System Performance
   */
  async fetchSystemPerformance(currency, year) {
    try {
      const query = `
        SELECT 
          system_component,
          AVG(cpu_usage) as avg_cpu_usage,
          AVG(memory_usage) as avg_memory_usage,
          AVG(disk_usage) as avg_disk_usage,
          AVG(network_usage) as avg_network_usage
        FROM os_system_performance 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY system_component
        ORDER BY avg_cpu_usage DESC
      `;

      const result = await pool.query(query, [currency, year]);
      
      const components = result.rows.map(row => row.system_component);
      const cpuUsage = result.rows.map(row => row.avg_cpu_usage || 0);
      const memoryUsage = result.rows.map(row => row.avg_memory_usage || 0);
      const diskUsage = result.rows.map(row => row.avg_disk_usage || 0);
      const networkUsage = result.rows.map(row => row.avg_network_usage || 0);

      return {
        categories: components,
        cpuUsage,
        memoryUsage,
        diskUsage,
        networkUsage
      };
    } catch (error) {
      console.error('Error fetching System Performance:', error);
      return this.getDefaultSystemPerformance();
    }
  }

  /**
   * Fetch User Activity
   */
  async fetchUserActivity(currency, year) {
    try {
      const query = `
        SELECT 
          EXTRACT(MONTH FROM date) as month,
          COUNT(DISTINCT user_id) as active_users,
          COUNT(DISTINCT session_id) as total_sessions,
          AVG(session_duration) as avg_session_duration,
          SUM(page_views) as total_page_views
        FROM os_user_activity 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY EXTRACT(MONTH FROM date)
        ORDER BY month
      `;

      const result = await pool.query(query, [currency, year]);
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const activeUsersData = [];
      const totalSessionsData = [];
      const avgSessionDurationData = [];
      const totalPageViewsData = [];

      result.rows.forEach(row => {
        const monthIndex = parseInt(row.month) - 1;
        activeUsersData[monthIndex] = row.active_users || 0;
        totalSessionsData[monthIndex] = row.total_sessions || 0;
        avgSessionDurationData[monthIndex] = row.avg_session_duration || 0;
        totalPageViewsData[monthIndex] = row.total_page_views || 0;
      });

      return {
        categories: months,
        series: [
          { name: 'Active Users', data: activeUsersData },
          { name: 'Total Sessions', data: totalSessionsData },
          { name: 'Page Views', data: totalPageViewsData }
        ]
      };
    } catch (error) {
      console.error('Error fetching User Activity:', error);
      return this.getDefaultUserActivity();
    }
  }

  /**
   * Fetch Resource Utilization
   */
  async fetchResourceUtilization(currency, year) {
    try {
      const query = `
        SELECT 
          resource_type,
          AVG(utilization_percentage) as avg_utilization,
          MAX(utilization_percentage) as max_utilization,
          MIN(utilization_percentage) as min_utilization
        FROM os_resource_utilization 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY resource_type
        ORDER BY avg_utilization DESC
      `;

      const result = await pool.query(query, [currency, year]);
      
      const resourceTypes = result.rows.map(row => row.resource_type);
      const avgUtilization = result.rows.map(row => row.avg_utilization || 0);
      const maxUtilization = result.rows.map(row => row.max_utilization || 0);
      const minUtilization = result.rows.map(row => row.min_utilization || 0);

      return {
        categories: resourceTypes,
        avgUtilization,
        maxUtilization,
        minUtilization
      };
    } catch (error) {
      console.error('Error fetching Resource Utilization:', error);
      return this.getDefaultResourceUtilization();
    }
  }

  /**
   * Fetch Error Analysis
   */
  async fetchErrorAnalysis(currency, year) {
    try {
      const query = `
        SELECT 
          error_type,
          COUNT(*) as error_count,
          AVG(resolution_time) as avg_resolution_time,
          COUNT(DISTINCT affected_user_id) as affected_users
        FROM os_error_logs 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY error_type
        ORDER BY error_count DESC
        LIMIT 10
      `;

      const result = await pool.query(query, [currency, year]);
      
      const errorTypes = result.rows.map(row => row.error_type);
      const errorCounts = result.rows.map(row => row.error_count || 0);
      const avgResolutionTimes = result.rows.map(row => row.avg_resolution_time || 0);
      const affectedUsers = result.rows.map(row => row.affected_users || 0);

      return {
        categories: errorTypes,
        errorCounts,
        avgResolutionTimes,
        affectedUsers
      };
    } catch (error) {
      console.error('Error fetching Error Analysis:', error);
      return this.getDefaultErrorAnalysis();
    }
  }

  /**
   * Fetch Monthly Trends
   */
  async fetchMonthlyTrends(currency, year) {
    try {
      const query = `
        SELECT 
          EXTRACT(MONTH FROM date) as month,
          SUM(system_revenue) as total_revenue,
          SUM(operational_cost) as total_cost,
          AVG(system_uptime) as avg_uptime,
          COUNT(DISTINCT user_id) as active_users
        FROM os_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY EXTRACT(MONTH FROM date)
        ORDER BY month
      `;

      const result = await pool.query(query, [currency, year]);
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const revenueData = [];
      const costData = [];
      const uptimeData = [];
      const usersData = [];

      result.rows.forEach(row => {
        const monthIndex = parseInt(row.month) - 1;
        revenueData[monthIndex] = row.total_revenue || 0;
        costData[monthIndex] = row.total_cost || 0;
        uptimeData[monthIndex] = row.avg_uptime || 0;
        usersData[monthIndex] = row.active_users || 0;
      });

      return {
        categories: months,
        series: [
          { name: 'Revenue', data: revenueData },
          { name: 'Cost', data: costData },
          { name: 'Uptime %', data: uptimeData },
          { name: 'Active Users', data: usersData }
        ]
      };
    } catch (error) {
      console.error('Error fetching Monthly Trends:', error);
      return this.getDefaultMonthlyTrends();
    }
  }

  // Default data methods for fallback
  getDefaultKPIData() {
    return [
      { title: 'System Revenue', value: '0', change: 0, icon: '💰', color: 'green' },
      { title: 'Net Profit', value: '0', change: 0, icon: '📈', color: 'blue' },
      { title: 'Total Users', value: '0', change: 0, icon: '👥', color: 'purple' },
      { title: 'System Uptime', value: '0.00%', change: 0, icon: '⚡', color: 'green' },
      { title: 'Total Sessions', value: '0', change: 0, icon: '📊', color: 'orange' },
      { title: 'Avg Response Time', value: '0.00ms', change: 0, icon: '⏱️', color: 'cyan' }
    ];
  }

  getDefaultChartData() {
    return {
      systemPerformance: this.getDefaultSystemPerformance(),
      userActivity: this.getDefaultUserActivity(),
      resourceUtilization: this.getDefaultResourceUtilization(),
      errorAnalysis: this.getDefaultErrorAnalysis(),
      monthlyTrends: this.getDefaultMonthlyTrends()
    };
  }

  getDefaultSystemPerformance() {
    return {
      categories: ['Web Server', 'Database', 'API Gateway', 'Cache'],
      cpuUsage: [0, 0, 0, 0],
      memoryUsage: [0, 0, 0, 0],
      diskUsage: [0, 0, 0, 0],
      networkUsage: [0, 0, 0, 0]
    };
  }

  getDefaultUserActivity() {
    return {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      series: [
        { name: 'Active Users', data: [0, 0, 0, 0, 0, 0, 0] },
        { name: 'Total Sessions', data: [0, 0, 0, 0, 0, 0, 0] },
        { name: 'Page Views', data: [0, 0, 0, 0, 0, 0, 0] }
      ]
    };
  }

  getDefaultResourceUtilization() {
    return {
      categories: ['CPU', 'Memory', 'Disk', 'Network'],
      avgUtilization: [0, 0, 0, 0],
      maxUtilization: [0, 0, 0, 0],
      minUtilization: [0, 0, 0, 0]
    };
  }

  getDefaultErrorAnalysis() {
    return {
      categories: ['Server Error', 'Database Error', 'Network Error', 'User Error'],
      errorCounts: [0, 0, 0, 0],
      avgResolutionTimes: [0, 0, 0, 0],
      affectedUsers: [0, 0, 0, 0]
    };
  }

  getDefaultMonthlyTrends() {
    return {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      series: [
        { name: 'Revenue', data: [0, 0, 0, 0, 0, 0, 0] },
        { name: 'Cost', data: [0, 0, 0, 0, 0, 0, 0] },
        { name: 'Uptime %', data: [0, 0, 0, 0, 0, 0, 0] },
        { name: 'Active Users', data: [0, 0, 0, 0, 0, 0, 0] }
      ]
    };
  }
}

export default OSLogic; 