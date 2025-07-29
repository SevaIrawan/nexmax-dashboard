/**
 * BGO DASHBOARD LOGIC
 * Centralized logic for BGO page analytics
 * 
 * @author NEXMAX Dashboard Team
 * @version 1.0.0
 * @date 2025-07-29
 */

import { pool } from '../database/postgresql.js';
import { formatCurrency, formatPercentage, calculateChange, formatNumber } from '../utils/formatters.js';

/**
 * BGO Dashboard Data Structure
 */
export class BGOLogic {
  constructor() {
    this.currency = 'MYR';
    this.year = '2025';
    this.month = 'July';
  }

  /**
   * Fetch all BGO dashboard data
   */
  async fetchBGOData(currency = 'MYR', year = '2025', month = 'July') {
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
      console.error('Error fetching BGO data:', error);
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
          SUM(total_bets) as total_bets,
          SUM(total_wins) as total_wins,
          SUM(gross_gaming_revenue) as ggr,
          COUNT(DISTINCT player_id) as active_players,
          AVG(bet_amount) as avg_bet_amount,
          SUM(total_deposits) as total_deposits
        FROM bgo_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        AND EXTRACT(MONTH FROM date) = $3
      `;

      const result = await pool.query(query, [currency, year, month]);
      const data = result.rows[0];

      const totalBets = data.total_bets || 0;
      const totalWins = data.total_wins || 0;
      const ggr = data.ggr || 0;
      const activePlayers = data.active_players || 0;
      const avgBetAmount = data.avg_bet_amount || 0;
      const totalDeposits = data.total_deposits || 0;

      return [
        {
          title: 'Total Bets',
          value: formatCurrency(totalBets, currency),
          change: calculateChange(totalBets, 0),
          icon: '🎯',
          color: 'blue'
        },
        {
          title: 'Total Wins',
          value: formatCurrency(totalWins, currency),
          change: calculateChange(totalWins, 0),
          icon: '🏆',
          color: 'green'
        },
        {
          title: 'Gross Gaming Revenue',
          value: formatCurrency(ggr, currency),
          change: calculateChange(ggr, 0),
          icon: '💰',
          color: 'gold'
        },
        {
          title: 'Active Players',
          value: formatNumber(activePlayers),
          change: calculateChange(activePlayers, 0),
          icon: '👥',
          color: 'purple'
        },
        {
          title: 'Average Bet Amount',
          value: formatCurrency(avgBetAmount, currency),
          change: calculateChange(avgBetAmount, 0),
          icon: '📊',
          color: 'orange'
        },
        {
          title: 'Total Deposits',
          value: formatCurrency(totalDeposits, currency),
          change: calculateChange(totalDeposits, 0),
          icon: '💳',
          color: 'cyan'
        }
      ];
    } catch (error) {
      console.error('Error fetching BGO KPI data:', error);
      return this.getDefaultKPIData();
    }
  }

  /**
   * Fetch Chart Data
   */
  async fetchChartData(currency, year) {
    try {
      const [
        revenueByGame,
        playerActivityTrend,
        betSizeDistribution,
        winLossRatio
      ] = await Promise.all([
        this.fetchRevenueByGame(currency, year),
        this.fetchPlayerActivityTrend(currency, year),
        this.fetchBetSizeDistribution(currency, year),
        this.fetchWinLossRatio(currency, year)
      ]);

      return {
        revenueByGame,
        playerActivityTrend,
        betSizeDistribution,
        winLossRatio
      };
    } catch (error) {
      console.error('Error fetching BGO chart data:', error);
      return this.getDefaultChartData();
    }
  }

  /**
   * Fetch Revenue by Game Type
   */
  async fetchRevenueByGame(currency, year) {
    try {
      const query = `
        SELECT 
          game_type,
          SUM(gross_gaming_revenue) as total_revenue,
          COUNT(DISTINCT player_id) as player_count
        FROM bgo_game_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY game_type
        ORDER BY total_revenue DESC
      `;

      const result = await pool.query(query, [currency, year]);
      
      const gameTypes = result.rows.map(row => row.game_type);
      const revenues = result.rows.map(row => row.total_revenue || 0);
      const playerCounts = result.rows.map(row => row.player_count || 0);

      return {
        categories: gameTypes,
        revenues,
        playerCounts
      };
    } catch (error) {
      console.error('Error fetching Revenue by Game:', error);
      return this.getDefaultRevenueByGame();
    }
  }

  /**
   * Fetch Player Activity Trend
   */
  async fetchPlayerActivityTrend(currency, year) {
    try {
      const query = `
        SELECT 
          EXTRACT(MONTH FROM date) as month,
          COUNT(DISTINCT player_id) as active_players,
          SUM(total_bets) as total_bets,
          SUM(gross_gaming_revenue) as ggr
        FROM bgo_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY EXTRACT(MONTH FROM date)
        ORDER BY month
      `;

      const result = await pool.query(query, [currency, year]);
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const activePlayersData = [];
      const totalBetsData = [];
      const ggrData = [];

      result.rows.forEach(row => {
        const monthIndex = parseInt(row.month) - 1;
        activePlayersData[monthIndex] = row.active_players || 0;
        totalBetsData[monthIndex] = row.total_bets || 0;
        ggrData[monthIndex] = row.ggr || 0;
      });

      return {
        categories: months,
        series: [
          { name: 'Active Players', data: activePlayersData },
          { name: 'Total Bets', data: totalBetsData },
          { name: 'GGR', data: ggrData }
        ]
      };
    } catch (error) {
      console.error('Error fetching Player Activity Trend:', error);
      return this.getDefaultPlayerActivityTrend();
    }
  }

  /**
   * Fetch Bet Size Distribution
   */
  async fetchBetSizeDistribution(currency, year) {
    try {
      const query = `
        SELECT 
          CASE 
            WHEN bet_amount < 10 THEN 'Small (< $10)'
            WHEN bet_amount BETWEEN 10 AND 50 THEN 'Medium ($10-$50)'
            WHEN bet_amount BETWEEN 50 AND 100 THEN 'Large ($50-$100)'
            ELSE 'High Roller (> $100)'
          END as bet_size_category,
          COUNT(*) as bet_count,
          SUM(bet_amount) as total_amount
        FROM bgo_bet_details 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY bet_size_category
        ORDER BY total_amount DESC
      `;

      const result = await pool.query(query, [currency, year]);
      
      const categories = result.rows.map(row => row.bet_size_category);
      const betCounts = result.rows.map(row => row.bet_count || 0);
      const amounts = result.rows.map(row => row.total_amount || 0);

      return {
        categories,
        betCounts,
        amounts
      };
    } catch (error) {
      console.error('Error fetching Bet Size Distribution:', error);
      return this.getDefaultBetSizeDistribution();
    }
  }

  /**
   * Fetch Win/Loss Ratio
   */
  async fetchWinLossRatio(currency, year) {
    try {
      const query = `
        SELECT 
          SUM(CASE WHEN outcome = 'win' THEN 1 ELSE 0 END) as total_wins,
          SUM(CASE WHEN outcome = 'loss' THEN 1 ELSE 0 END) as total_losses,
          COUNT(*) as total_games
        FROM bgo_game_results 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
      `;

      const result = await pool.query(query, [currency, year]);
      const data = result.rows[0];

      const totalWins = data.total_wins || 0;
      const totalLosses = data.total_losses || 0;

      return {
        categories: ['Wins', 'Losses'],
        data: [totalWins, totalLosses]
      };
    } catch (error) {
      console.error('Error fetching Win/Loss Ratio:', error);
      return this.getDefaultWinLossRatio();
    }
  }

  // Default data methods for fallback
  getDefaultKPIData() {
    return [
      { title: 'Total Bets', value: '0', change: 0, icon: '🎯', color: 'blue' },
      { title: 'Total Wins', value: '0', change: 0, icon: '🏆', color: 'green' },
      { title: 'Gross Gaming Revenue', value: '0', change: 0, icon: '💰', color: 'gold' },
      { title: 'Active Players', value: '0', change: 0, icon: '👥', color: 'purple' },
      { title: 'Average Bet Amount', value: '0', change: 0, icon: '📊', color: 'orange' },
      { title: 'Total Deposits', value: '0', change: 0, icon: '💳', color: 'cyan' }
    ];
  }

  getDefaultChartData() {
    return {
      revenueByGame: this.getDefaultRevenueByGame(),
      playerActivityTrend: this.getDefaultPlayerActivityTrend(),
      betSizeDistribution: this.getDefaultBetSizeDistribution(),
      winLossRatio: this.getDefaultWinLossRatio()
    };
  }

  getDefaultRevenueByGame() {
    return {
      categories: ['Slots', 'Table Games', 'Live Casino', 'Sports', 'Virtual'],
      revenues: [0, 0, 0, 0, 0],
      playerCounts: [0, 0, 0, 0, 0]
    };
  }

  getDefaultPlayerActivityTrend() {
    return {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      series: [
        { name: 'Active Players', data: [0, 0, 0, 0, 0, 0, 0] },
        { name: 'Total Bets', data: [0, 0, 0, 0, 0, 0, 0] },
        { name: 'GGR', data: [0, 0, 0, 0, 0, 0, 0] }
      ]
    };
  }

  getDefaultBetSizeDistribution() {
    return {
      categories: ['Small (< $10)', 'Medium ($10-$50)', 'Large ($50-$100)', 'High Roller (> $100)'],
      betCounts: [0, 0, 0, 0],
      amounts: [0, 0, 0, 0]
    };
  }

  getDefaultWinLossRatio() {
    return {
      categories: ['Wins', 'Losses'],
      data: [0, 0]
    };
  }
}

export default BGOLogic; 