/**
 * S&R DASHBOARD LOGIC  
 * Centralized logic for Sports & Racing page analytics
 * 
 * @author NEXMAX Dashboard Team
 * @version 1.0.0
 * @date 2025-07-29
 */

import { pool } from '../database/postgresql.js';
import { formatCurrency, formatPercentage, calculateChange, formatNumber } from '../utils/formatters.js';

/**
 * S&R Dashboard Data Structure
 */
export class SRLogic {
  constructor() {
    this.currency = 'MYR';
    this.year = '2025';
    this.month = 'July';
  }

  /**
   * Fetch all S&R dashboard data
   */
  async fetchSRData(currency = 'MYR', year = '2025', month = 'July') {
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
      console.error('Error fetching S&R data:', error);
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
          SUM(total_stakes) as total_stakes,
          COUNT(DISTINCT player_id) as active_players,
          AVG(odds) as avg_odds,
          COUNT(DISTINCT CASE WHEN status = 'won' THEN bet_id END) as winning_bets,
          COUNT(DISTINCT bet_id) as total_bet_count
        FROM sr_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        AND EXTRACT(MONTH FROM date) = $3
      `;

      const result = await pool.query(query, [currency, year, month]);
      const data = result.rows[0];

      const totalBets = data.total_bets || 0;
      const totalWins = data.total_wins || 0;
      const totalStakes = data.total_stakes || 0;
      const activePlayers = data.active_players || 0;
      const avgOdds = data.avg_odds || 0;
      const winningBets = data.winning_bets || 0;
      const totalBetCount = data.total_bet_count || 0;
      const winRate = totalBetCount > 0 ? (winningBets / totalBetCount) * 100 : 0;

      return [
        {
          title: 'Total Bets Value',
          value: formatCurrency(totalBets, currency),
          change: calculateChange(totalBets, 0),
          icon: '💰',
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
          title: 'Total Stakes',
          value: formatCurrency(totalStakes, currency),
          change: calculateChange(totalStakes, 0),
          icon: '💸',
          color: 'purple'
        },
        {
          title: 'Active Players',
          value: formatNumber(activePlayers),
          change: calculateChange(activePlayers, 0),
          icon: '👥',
          color: 'orange'
        },
        {
          title: 'Average Odds',
          value: avgOdds.toFixed(2),
          change: calculateChange(avgOdds, 0),
          icon: '📊',
          color: 'cyan'
        },
        {
          title: 'Win Rate',
          value: formatPercentage(winRate),
          change: calculateChange(winRate, 0),
          icon: '🎯',
          color: 'gold'
        }
      ];
    } catch (error) {
      console.error('Error fetching S&R KPI data:', error);
      return this.getDefaultKPIData();
    }
  }

  /**
   * Fetch Chart Data
   */
  async fetchChartData(currency, year) {
    try {
      const [
        sportsBetting,
        racingBetting,
        popularSports,
        betTypeDistribution,
        monthlyTrends
      ] = await Promise.all([
        this.fetchSportsBetting(currency, year),
        this.fetchRacingBetting(currency, year),
        this.fetchPopularSports(currency, year),
        this.fetchBetTypeDistribution(currency, year),
        this.fetchMonthlyTrends(currency, year)
      ]);

      return {
        sportsBetting,
        racingBetting,
        popularSports,
        betTypeDistribution,
        monthlyTrends
      };
    } catch (error) {
      console.error('Error fetching S&R chart data:', error);
      return this.getDefaultChartData();
    }
  }

  /**
   * Fetch Sports Betting Data
   */
  async fetchSportsBetting(currency, year) {
    try {
      const query = `
        SELECT 
          sport_type,
          SUM(total_bets) as total_bets,
          COUNT(DISTINCT player_id) as player_count,
          AVG(odds) as avg_odds
        FROM sr_sports_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY sport_type
        ORDER BY total_bets DESC
      `;

      const result = await pool.query(query, [currency, year]);
      
      const sportTypes = result.rows.map(row => row.sport_type);
      const totalBets = result.rows.map(row => row.total_bets || 0);
      const playerCounts = result.rows.map(row => row.player_count || 0);
      const avgOdds = result.rows.map(row => row.avg_odds || 0);

      return {
        categories: sportTypes,
        totalBets,
        playerCounts,
        avgOdds
      };
    } catch (error) {
      console.error('Error fetching Sports Betting:', error);
      return this.getDefaultSportsBetting();
    }
  }

  /**
   * Fetch Racing Betting Data
   */
  async fetchRacingBetting(currency, year) {
    try {
      const query = `
        SELECT 
          race_type,
          SUM(total_bets) as total_bets,
          COUNT(DISTINCT player_id) as player_count,
          COUNT(DISTINCT race_id) as race_count
        FROM sr_racing_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY race_type
        ORDER BY total_bets DESC
      `;

      const result = await pool.query(query, [currency, year]);
      
      const raceTypes = result.rows.map(row => row.race_type);
      const totalBets = result.rows.map(row => row.total_bets || 0);
      const playerCounts = result.rows.map(row => row.player_count || 0);
      const raceCounts = result.rows.map(row => row.race_count || 0);

      return {
        categories: raceTypes,
        totalBets,
        playerCounts,
        raceCounts
      };
    } catch (error) {
      console.error('Error fetching Racing Betting:', error);
      return this.getDefaultRacingBetting();
    }
  }

  /**
   * Fetch Popular Sports
   */
  async fetchPopularSports(currency, year) {
    try {
      const query = `
        SELECT 
          sport_name,
          COUNT(DISTINCT bet_id) as bet_count,
          SUM(total_bets) as total_revenue
        FROM sr_popular_sports 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY sport_name
        ORDER BY bet_count DESC
        LIMIT 10
      `;

      const result = await pool.query(query, [currency, year]);
      
      const sportNames = result.rows.map(row => row.sport_name);
      const betCounts = result.rows.map(row => row.bet_count || 0);
      const revenues = result.rows.map(row => row.total_revenue || 0);

      return {
        categories: sportNames,
        betCounts,
        revenues
      };
    } catch (error) {
      console.error('Error fetching Popular Sports:', error);
      return this.getDefaultPopularSports();
    }
  }

  /**
   * Fetch Bet Type Distribution
   */
  async fetchBetTypeDistribution(currency, year) {
    try {
      const query = `
        SELECT 
          bet_type,
          COUNT(*) as bet_count,
          SUM(bet_amount) as total_amount
        FROM sr_bet_types 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY bet_type
        ORDER BY bet_count DESC
      `;

      const result = await pool.query(query, [currency, year]);
      
      const betTypes = result.rows.map(row => row.bet_type);
      const betCounts = result.rows.map(row => row.bet_count || 0);
      const amounts = result.rows.map(row => row.total_amount || 0);

      return {
        categories: betTypes,
        betCounts,
        amounts
      };
    } catch (error) {
      console.error('Error fetching Bet Type Distribution:', error);
      return this.getDefaultBetTypeDistribution();
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
          SUM(total_bets) as total_bets,
          SUM(total_wins) as total_wins,
          COUNT(DISTINCT player_id) as active_players
        FROM sr_metrics 
        WHERE currency = $1 
        AND EXTRACT(YEAR FROM date) = $2
        GROUP BY EXTRACT(MONTH FROM date)
        ORDER BY month
      `;

      const result = await pool.query(query, [currency, year]);
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const totalBetsData = [];
      const totalWinsData = [];
      const activePlayersData = [];

      result.rows.forEach(row => {
        const monthIndex = parseInt(row.month) - 1;
        totalBetsData[monthIndex] = row.total_bets || 0;
        totalWinsData[monthIndex] = row.total_wins || 0;
        activePlayersData[monthIndex] = row.active_players || 0;
      });

      return {
        categories: months,
        series: [
          { name: 'Total Bets', data: totalBetsData },
          { name: 'Total Wins', data: totalWinsData },
          { name: 'Active Players', data: activePlayersData }
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
      { title: 'Total Bets Value', value: '0', change: 0, icon: '💰', color: 'blue' },
      { title: 'Total Wins', value: '0', change: 0, icon: '🏆', color: 'green' },
      { title: 'Total Stakes', value: '0', change: 0, icon: '💸', color: 'purple' },
      { title: 'Active Players', value: '0', change: 0, icon: '👥', color: 'orange' },
      { title: 'Average Odds', value: '0.00', change: 0, icon: '📊', color: 'cyan' },
      { title: 'Win Rate', value: '0.00%', change: 0, icon: '🎯', color: 'gold' }
    ];
  }

  getDefaultChartData() {
    return {
      sportsBetting: this.getDefaultSportsBetting(),
      racingBetting: this.getDefaultRacingBetting(),
      popularSports: this.getDefaultPopularSports(),
      betTypeDistribution: this.getDefaultBetTypeDistribution(),
      monthlyTrends: this.getDefaultMonthlyTrends()
    };
  }

  getDefaultSportsBetting() {
    return {
      categories: ['Football', 'Basketball', 'Tennis', 'Baseball', 'Hockey'],
      totalBets: [0, 0, 0, 0, 0],
      playerCounts: [0, 0, 0, 0, 0],
      avgOdds: [0, 0, 0, 0, 0]
    };
  }

  getDefaultRacingBetting() {
    return {
      categories: ['Horse Racing', 'Greyhound', 'Virtual Racing'],
      totalBets: [0, 0, 0],
      playerCounts: [0, 0, 0],
      raceCounts: [0, 0, 0]
    };
  }

  getDefaultPopularSports() {
    return {
      categories: ['Football', 'Basketball', 'Tennis', 'Baseball', 'Hockey'],
      betCounts: [0, 0, 0, 0, 0],
      revenues: [0, 0, 0, 0, 0]
    };
  }

  getDefaultBetTypeDistribution() {
    return {
      categories: ['Single', 'Multiple', 'System', 'Live'],
      betCounts: [0, 0, 0, 0],
      amounts: [0, 0, 0, 0]
    };
  }

  getDefaultMonthlyTrends() {
    return {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      series: [
        { name: 'Total Bets', data: [0, 0, 0, 0, 0, 0, 0] },
        { name: 'Total Wins', data: [0, 0, 0, 0, 0, 0, 0] },
        { name: 'Active Players', data: [0, 0, 0, 0, 0, 0, 0] }
      ]
    };
  }
}

export default SRLogic; 