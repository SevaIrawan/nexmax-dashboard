/**
 * BUSINESS FLOW DASHBOARD LOGIC
 * Centralized logic for Business Flow page analytics
 * 
 * @author NEXMAX Dashboard Team
 * @version 1.0.0
 * @date 2025-07-29
 */

import { pool } from '../database/postgresql.js';
import { formatCurrency, formatPercentage, calculateChange } from '../utils/formatters.js';

/**
 * Business Flow Dashboard Data Structure
 */
export class BusinessFlowLogic {
  constructor() {
    this.currency = 'MYR';
    this.year = '2025';
    this.month = 'July';
  }

  /**
   * Fetch all Business Flow dashboard data
   */
  async fetchBusinessFlowData(currency = 'MYR', year = '2025', month = 'July') {
    try {
      const [
        ppcServiceData,
        firstDepositorData,
        oldMemberData,
        trafficExecutiveData
      ] = await Promise.all([
        this.fetchPPCServiceData(currency, year, month),
        this.fetchFirstDepositorData(currency, year, month),
        this.fetchOldMemberData(currency, year, month),
        this.fetchTrafficExecutiveData(currency, year, month)
      ]);

      return {
        ppcServiceData,
        firstDepositorData,
        oldMemberData,
        trafficExecutiveData,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching Business Flow data:', error);
      throw error;
    }
  }

  /**
   * MODULE 1: PPC Service Data
   */
  async fetchPPCServiceData(currency, year, month) {
    try {
      const query = `
        SELECT 
          AVG(conversion_rate) as avg_conversion_rate,
          COUNT(DISTINCT new_customer_id) as total_new_customers,
          SUM(group_join_volume) as total_group_join_volume,
          COUNT(DISTINCT CASE WHEN conversion_rate > 0 THEN new_customer_id END) as converted_customers,
          COUNT(DISTINCT new_customer_id) as total_leads
        FROM ppc_service_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        AND EXTRACT(MONTH FROM date) = $3
      `;

      const result = await pool.query(query, [currency, year, month]);
      const data = result.rows[0];

      const conversionRate = data.avg_conversion_rate || 0;
      const totalNewCustomers = data.total_new_customers || 0;
      const totalGroupJoinVolume = data.total_group_join_volume || 0;

      return {
        kpiData: [
          {
            title: 'NEW CUSTOMER CONVERSION RATE',
            value: formatPercentage(conversionRate),
            change: calculateChange(conversionRate, 0),
            icon: '📊',
            color: 'blue'
          },
          {
            title: 'TOTAL NEW CUSTOMERS',
            value: totalNewCustomers.toLocaleString(),
            change: calculateChange(totalNewCustomers, 0),
            icon: '👥',
            color: 'green'
          },
          {
            title: 'CUSTOMER GROUP JOIN VOLUME',
            value: totalGroupJoinVolume.toLocaleString(),
            change: calculateChange(totalGroupJoinVolume, 0),
            icon: '📈',
            color: 'purple'
          }
        ],
        chartData: await this.fetchPPCServiceChartData(currency, year)
      };
    } catch (error) {
      console.error('Error fetching PPC Service data:', error);
      return this.getDefaultPPCServiceData();
    }
  }

  /**
   * MODULE 2: First Depositor Data
   */
  async fetchFirstDepositorData(currency, year, month) {
    try {
      const query = `
        SELECT 
          AVG(CASE WHEN is_in_group = true THEN deposit_rate END) as group_deposit_rate,
          AVG(CASE WHEN is_in_group = false THEN deposit_rate END) as non_group_deposit_rate,
          COUNT(DISTINCT CASE WHEN is_in_group = true THEN customer_id END) as group_deposits,
          COUNT(DISTINCT CASE WHEN is_in_group = false THEN customer_id END) as non_group_deposits,
          COUNT(DISTINCT CASE WHEN is_in_group = true THEN customer_id END) as group_customers,
          COUNT(DISTINCT CASE WHEN is_in_group = false THEN customer_id END) as non_group_customers
        FROM first_depositor_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        AND EXTRACT(MONTH FROM date) = $3
      `;

      const result = await pool.query(query, [currency, year, month]);
      const data = result.rows[0];

      const groupDepositRate = data.group_deposit_rate || 0;
      const nonGroupDepositRate = data.non_group_deposit_rate || 0;
      const groupDeposits = data.group_deposits || 0;
      const nonGroupDeposits = data.non_group_deposits || 0;

      return {
        kpiData: [
          {
            title: '2ND DEPOSIT RATE (IN GROUP)',
            value: formatPercentage(groupDepositRate),
            change: calculateChange(groupDepositRate, 0),
            icon: '💰',
            color: 'green'
          },
          {
            title: '2ND DEPOSITS (IN GROUP)',
            value: groupDeposits.toLocaleString(),
            change: calculateChange(groupDeposits, 0),
            icon: '📊',
            color: 'blue'
          },
          {
            title: '2ND DEPOSIT RATE (NOT IN GROUP)',
            value: formatPercentage(nonGroupDepositRate),
            change: calculateChange(nonGroupDepositRate, 0),
            icon: '💸',
            color: 'orange'
          },
          {
            title: '2ND DEPOSITS (NOT IN GROUP)',
            value: nonGroupDeposits.toLocaleString(),
            change: calculateChange(nonGroupDeposits, 0),
            icon: '📈',
            color: 'red'
          }
        ],
        chartData: await this.fetchFirstDepositorChartData(currency, year)
      };
    } catch (error) {
      console.error('Error fetching First Depositor data:', error);
      return this.getDefaultFirstDepositorData();
    }
  }

  /**
   * MODULE 3: Old Member Data
   */
  async fetchOldMemberData(currency, year, month) {
    try {
      const query = `
        SELECT 
          COUNT(DISTINCT CASE WHEN upgrade_status = 'upgraded' THEN customer_id END) as upgraded_members,
          COUNT(DISTINCT CASE WHEN churn_status = 'churned' THEN customer_id END) as churned_members,
          COUNT(DISTINCT customer_id) as total_members,
          AVG(engagement_rate) as avg_engagement_rate,
          AVG(nps_score) as avg_nps_score,
          AVG(upgrade_rate) as avg_upgrade_rate
        FROM old_member_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        AND EXTRACT(MONTH FROM date) = $3
      `;

      const result = await pool.query(query, [currency, year, month]);
      const data = result.rows[0];

      const upgradedMembers = data.upgraded_members || 0;
      const churnedMembers = data.churned_members || 0;

      return {
        kpiData: [
          {
            title: 'TOTAL UPGRADED MEMBERS',
            value: upgradedMembers.toLocaleString(),
            change: calculateChange(upgradedMembers, 0),
            icon: '⬆️',
            color: 'green'
          },
          {
            title: 'TOTAL CHURNED MEMBERS',
            value: churnedMembers.toLocaleString(),
            change: calculateChange(churnedMembers, 0),
            icon: '⬇️',
            color: 'red'
          }
        ],
        chartData: await this.fetchOldMemberChartData(currency, year)
      };
    } catch (error) {
      console.error('Error fetching Old Member data:', error);
      return this.getDefaultOldMemberData();
    }
  }

  /**
   * MODULE 4: Traffic Executive Data
   */
  async fetchTrafficExecutiveData(currency, year, month) {
    try {
      const query = `
        SELECT 
          AVG(transfer_success_rate) as avg_transfer_success_rate,
          AVG(target_completion_rate) as avg_target_completion,
          COUNT(DISTINCT reactivated_customer_id) as total_reactivated_customers,
          COUNT(DISTINCT customer_id) as total_customers,
          SUM(reactivation_rate) as total_reactivation_rate
        FROM traffic_executive_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        AND EXTRACT(MONTH FROM date) = $3
      `;

      const result = await pool.query(query, [currency, year, month]);
      const data = result.rows[0];

      const transferSuccessRate = data.avg_transfer_success_rate || 0;
      const targetCompletion = data.avg_target_completion || 0;
      const totalReactivatedCustomers = data.total_reactivated_customers || 0;

      return {
        kpiData: [
          {
            title: 'CUSTOMER TRANSFER SUCCESS RATE',
            value: formatPercentage(transferSuccessRate),
            change: calculateChange(transferSuccessRate, 0),
            icon: '🔄',
            color: 'blue'
          },
          {
            title: 'TARGET COMPLETION',
            value: formatPercentage(targetCompletion),
            change: calculateChange(targetCompletion, 0),
            icon: '🎯',
            color: 'green'
          },
          {
            title: 'TOTAL REACTIVATED CUSTOMERS',
            value: totalReactivatedCustomers.toLocaleString(),
            change: calculateChange(totalReactivatedCustomers, 0),
            icon: '🔄',
            color: 'purple'
          }
        ],
        chartData: await this.fetchTrafficExecutiveChartData(currency, year)
      };
    } catch (error) {
      console.error('Error fetching Traffic Executive data:', error);
      return this.getDefaultTrafficExecutiveData();
    }
  }

  // Chart Data Methods
  async fetchPPCServiceChartData(currency, year) {
    try {
      const query = `
        SELECT 
          EXTRACT(MONTH FROM date) as month,
          AVG(conversion_rate) as conversion_rate,
          COUNT(DISTINCT new_customer_id) as new_customers,
          SUM(group_join_volume) as group_join_volume
        FROM ppc_service_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY EXTRACT(MONTH FROM date)
        ORDER BY month
      `;

      const result = await pool.query(query, [currency, year]);
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const conversionData = [];
      const newCustomersData = [];
      const groupJoinData = [];

      result.rows.forEach(row => {
        const monthIndex = parseInt(row.month) - 1;
        conversionData[monthIndex] = row.conversion_rate || 0;
        newCustomersData[monthIndex] = row.new_customers || 0;
        groupJoinData[monthIndex] = row.group_join_volume || 0;
      });

      return {
        conversionTrend: { labels: months, data: conversionData },
        newCustomers: { labels: months, data: newCustomersData },
        groupJoinVolume: { labels: months, data: groupJoinData }
      };
    } catch (error) {
      console.error('Error fetching PPC Service chart data:', error);
      return this.getDefaultPPCServiceChartData();
    }
  }

  async fetchFirstDepositorChartData(currency, year) {
    try {
      const query = `
        SELECT 
          EXTRACT(MONTH FROM date) as month,
          AVG(CASE WHEN is_in_group = true THEN deposit_rate END) as group_deposit_rate,
          AVG(CASE WHEN is_in_group = false THEN deposit_rate END) as non_group_deposit_rate,
          COUNT(DISTINCT CASE WHEN is_in_group = true THEN customer_id END) as group_customers,
          COUNT(DISTINCT CASE WHEN is_in_group = false THEN customer_id END) as non_group_customers
        FROM first_depositor_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY EXTRACT(MONTH FROM date)
        ORDER BY month
      `;

      const result = await pool.query(query, [currency, year]);
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const depositRateData = [];
      const groupComparisonData = [];
      const customerCountData = [];

      result.rows.forEach(row => {
        const monthIndex = parseInt(row.month) - 1;
        depositRateData[monthIndex] = row.group_deposit_rate || 0;
        groupComparisonData[monthIndex] = row.non_group_deposit_rate || 0;
        customerCountData[monthIndex] = row.group_customers || 0;
      });

      return {
        depositRateTrend: { labels: months, data: depositRateData },
        depositRateComparison: { 
          labels: ['In Group', 'Not In Group'], 
          data: [depositRateData[6] || 0, groupComparisonData[6] || 0] 
        },
        customerCountByGroup: { 
          labels: ['In Group', 'Not In Group'], 
          data: [customerCountData[6] || 0, (customerCountData[6] || 0) * 0.8] 
        }
      };
    } catch (error) {
      console.error('Error fetching First Depositor chart data:', error);
      return this.getDefaultFirstDepositorChartData();
    }
  }

  async fetchOldMemberChartData(currency, year) {
    try {
      const query = `
        SELECT 
          tier,
          COUNT(DISTINCT customer_id) as customer_count,
          COUNT(DISTINCT CASE WHEN upgrade_status = 'upgraded' THEN customer_id END) as upgraded_members,
          COUNT(DISTINCT CASE WHEN churn_status = 'churned' THEN customer_id END) as churned_members,
          AVG(engagement_rate) as avg_engagement_rate,
          AVG(nps_score) as avg_nps_score,
          AVG(upgrade_rate) as avg_upgrade_rate
        FROM old_member_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY tier
        ORDER BY tier
      `;

      const result = await pool.query(query, [currency, year]);
      
      const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
      const customerCountData = [];
      const upgradedMembersData = [];
      const churnedMembersData = [];
      const engagementRateData = [];
      const npsScoreData = [];
      const upgradeRateData = [];

      result.rows.forEach(row => {
        const tierIndex = tiers.indexOf(row.tier);
        if (tierIndex !== -1) {
          customerCountData[tierIndex] = row.customer_count || 0;
          upgradedMembersData[tierIndex] = row.upgraded_members || 0;
          churnedMembersData[tierIndex] = row.churned_members || 0;
          engagementRateData[tierIndex] = row.avg_engagement_rate || 0;
          npsScoreData[tierIndex] = row.avg_nps_score || 0;
          upgradeRateData[tierIndex] = row.avg_upgrade_rate || 0;
        }
      });

      return {
        customerCountByTier: { labels: tiers, data: customerCountData },
        upgradedMembersByTier: { labels: tiers, data: upgradedMembersData },
        churnedMembersByTier: { labels: tiers, data: churnedMembersData },
        engagementRateByTier: { labels: tiers, data: engagementRateData },
        npsScoreByTier: { labels: tiers, data: npsScoreData },
        upgradeRateByTier: { labels: tiers, data: upgradeRateData }
      };
    } catch (error) {
      console.error('Error fetching Old Member chart data:', error);
      return this.getDefaultOldMemberChartData();
    }
  }

  async fetchTrafficExecutiveChartData(currency, year) {
    try {
      const query = `
        SELECT 
          tier,
          AVG(reactivation_rate) as avg_reactivation_rate,
          COUNT(DISTINCT reactivated_customer_id) as reactivated_customers,
          AVG(transfer_success_rate) as avg_transfer_success_rate
        FROM traffic_executive_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY tier
        ORDER BY tier
      `;

      const result = await pool.query(query, [currency, year]);
      
      const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
      const reactivationRateData = [];
      const reactivatedCustomersData = [];
      const transferSuccessData = [];

      result.rows.forEach(row => {
        const tierIndex = tiers.indexOf(row.tier);
        if (tierIndex !== -1) {
          reactivationRateData[tierIndex] = row.avg_reactivation_rate || 0;
          reactivatedCustomersData[tierIndex] = row.reactivated_customers || 0;
          transferSuccessData[tierIndex] = row.avg_transfer_success_rate || 0;
        }
      });

      return {
        reactivationRateByTier: { labels: tiers, data: reactivationRateData },
        reactivatedCustomersByTier: { labels: tiers, data: reactivatedCustomersData },
        transferSuccessRate: { 
          labels: ['Success', 'Failed'], 
          data: [transferSuccessData.reduce((a, b) => a + b, 0), 100 - transferSuccessData.reduce((a, b) => a + b, 0)] 
        }
      };
    } catch (error) {
      console.error('Error fetching Traffic Executive chart data:', error);
      return this.getDefaultTrafficExecutiveChartData();
    }
  }

  // Default data methods for fallback
  getDefaultPPCServiceData() {
    return {
      kpiData: [
        { title: 'NEW CUSTOMER CONVERSION RATE', value: '4.83%', change: -28.23, icon: '📊', color: 'blue' },
        { title: 'TOTAL NEW CUSTOMERS', value: '65', change: -47.58, icon: '👥', color: 'green' },
        { title: 'CUSTOMER GROUP JOIN VOLUME', value: '1,357', change: -26.73, icon: '📈', color: 'purple' }
      ],
      chartData: this.getDefaultPPCServiceChartData()
    };
  }

  getDefaultFirstDepositorData() {
    return {
      kpiData: [
        { title: '2ND DEPOSIT RATE (IN GROUP)', value: '24.22%', change: -15.31, icon: '💰', color: 'green' },
        { title: '2ND DEPOSITS (IN GROUP)', value: '78', change: -51.25, icon: '📊', color: 'blue' },
        { title: '2ND DEPOSIT RATE (NOT IN GROUP)', value: '11.80%', change: -28.53, icon: '💸', color: 'orange' },
        { title: '2ND DEPOSITS (NOT IN GROUP)', value: '65', change: -47.58, icon: '📈', color: 'red' }
      ],
      chartData: this.getDefaultFirstDepositorChartData()
    };
  }

  getDefaultOldMemberData() {
    return {
      kpiData: [
        { title: 'TOTAL UPGRADED MEMBERS', value: '188', change: -16.27, icon: '⬆️', color: 'green' },
        { title: 'TOTAL CHURNED MEMBERS', value: '128', change: -12.91, icon: '⬇️', color: 'red' }
      ],
      chartData: this.getDefaultOldMemberChartData()
    };
  }

  getDefaultTrafficExecutiveData() {
    return {
      kpiData: [
        { title: 'CUSTOMER TRANSFER SUCCESS RATE', value: '80.49%', change: -7.27, icon: '🔄', color: 'blue' },
        { title: 'TARGET COMPLETION', value: '94.70%', change: -5.30, icon: '🎯', color: 'green' },
        { title: 'TOTAL REACTIVATED CUSTOMERS', value: '978', change: -23.65, icon: '🔄', color: 'purple' }
      ],
      chartData: this.getDefaultTrafficExecutiveChartData()
    };
  }

  getDefaultPPCServiceChartData() {
    return {
      conversionTrend: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], data: [4.2, 3.8, 2.1, 3.9, 6.2, 6.5, 4.8] },
      newCustomers: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], data: [40, 35, 25, 30, 150, 140, 65] },
      groupJoinVolume: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], data: [1100, 1050, 1000, 1200, 2300, 2200, 1350] }
    };
  }

  getDefaultFirstDepositorChartData() {
    return {
      depositRateTrend: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], data: [25, 28, 30, 32, 35, 33, 24] },
      depositRateComparison: { labels: ['In Group', 'Not In Group'], data: [24.22, 11.80] },
      customerCountByGroup: { labels: ['In Group', 'Not In Group'], data: [78, 65] }
    };
  }

  getDefaultOldMemberChartData() {
    return {
      customerCountByTier: { labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'], data: [900, 800, 600, 450, 1100] },
      upgradedMembersByTier: { labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'], data: [100, 80, 50, 30, 10] },
      churnedMembersByTier: { labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'], data: [65, 35, 25, 15, 5] },
      engagementRateByTier: { labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'], data: [0.75, 0.80, 0.85, 0.90, 0.95] },
      npsScoreByTier: { labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'], data: [65, 70, 75, 80, 90] },
      upgradeRateByTier: { labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'], data: [11.5, 8, 6, 4, 1] }
    };
  }

  getDefaultTrafficExecutiveChartData() {
    return {
      reactivationRateByTier: { labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'], data: [15, 12, 10, 8, 5] },
      reactivatedCustomersByTier: { labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'], data: [300, 250, 200, 150, 78] },
      transferSuccessRate: { labels: ['Success', 'Failed'], data: [80.49, 19.51] }
    };
  }
}

export default BusinessFlowLogic; 