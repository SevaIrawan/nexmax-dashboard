/**
 * NEXMAX DASHBOARD LOGIC INDEX
 * Centralized export for all dashboard logic modules
 * 
 * @author NEXMAX Dashboard Team
 * @version 1.0.0
 * @date 2025-07-29
 */

// Dashboard Logic Imports
import OverviewLogic from './dashboard/overview-logic.js';
import BusinessFlowLogic from './dashboard/business-flow-logic.js';
import StrategicExecutiveLogic from './dashboard/strategic-executive-logic.js';
import BGOLogic from './dashboard/bgo-logic.js';
import SRLogic from './dashboard/sr-logic.js';
import XOOLogic from './dashboard/xoo-logic.js';
import OSLogic from './dashboard/os-logic.js';

// Database Logic Imports
import { 
  pool, 
  checkDatabaseConnection, 
  executeQuery, 
  getDatabaseStats, 
  testDatabaseTables, 
  initializeDatabaseTables 
} from './database/postgresql.js';

import {
  getAllTables,
  getTableStructure,
  getDatabaseStructure,
  getTableSample,
  getTableCount,
  generateDatabaseReport,
  tableExists,
  getForeignKeys,
  displayDatabaseStructure
} from './database/database-reader.js';

// Utility Imports
import {
  formatCurrency,
  formatPercentage,
  formatNumber,
  calculateChange,
  formatChange,
  formatDate,
  formatTime,
  formatFileSize,
  formatDuration,
  formatPhoneNumber,
  formatCreditCard,
  truncateText,
  capitalizeFirst,
  toTitleCase,
  formatDecimal,
  formatLargeNumber
} from './utils/formatters.js';

/**
 * Dashboard Logic Classes
 */
export const DashboardLogic = {
  Overview: OverviewLogic,
  BusinessFlow: BusinessFlowLogic,
  StrategicExecutive: StrategicExecutiveLogic,
  BGO: BGOLogic,
  SR: SRLogic,
  XOO: XOOLogic,
  OS: OSLogic
};

/**
 * Database Connection and Utilities
 */
export const Database = {
  pool,
  checkConnection: checkDatabaseConnection,
  executeQuery,
  getStats: getDatabaseStats,
  testTables: testDatabaseTables,
  initializeTables: initializeDatabaseTables,
  // Database Structure Reader
  getAllTables,
  getTableStructure,
  getDatabaseStructure,
  getTableSample,
  getTableCount,
  generateReport: generateDatabaseReport,
  tableExists,
  getForeignKeys,
  displayStructure: displayDatabaseStructure
};

/**
 * Formatting Utilities
 */
export const Formatters = {
  currency: formatCurrency,
  percentage: formatPercentage,
  number: formatNumber,
  change: calculateChange,
  changeFormat: formatChange,
  date: formatDate,
  time: formatTime,
  fileSize: formatFileSize,
  duration: formatDuration,
  phoneNumber: formatPhoneNumber,
  creditCard: formatCreditCard,
  truncateText,
  capitalizeFirst,
  toTitleCase,
  decimal: formatDecimal,
  largeNumber: formatLargeNumber
};

/**
 * Quick Access Logic Instances
 */
export const Logic = {
  overview: new OverviewLogic(),
  businessFlow: new BusinessFlowLogic(),
  strategicExecutive: new StrategicExecutiveLogic(),
  bgo: new BGOLogic(),
  sr: new SRLogic(),
  xoo: new XOOLogic(),
  os: new OSLogic()
};

/**
 * Initialize All Dashboard Data
 * @param {string} currency - Currency code (MYR, USD, etc.)
 * @param {string} year - Year (2025, 2024, etc.)
 * @param {string} month - Month (January, February, etc.)
 * @returns {Promise<Object>} All dashboard data
 */
export async function initializeAllDashboards(currency = 'MYR', year = '2025', month = 'July') {
  try {
    console.log('🚀 Initializing all dashboard data...');
    
    const [
      overviewData,
      businessFlowData,
      strategicExecutiveData,
      bgoData,
      srData,
      xooData,
      osData
    ] = await Promise.all([
      Logic.overview.fetchOverviewData(currency, year, month),
      Logic.businessFlow.fetchBusinessFlowData(currency, year, month),
      Logic.strategicExecutive.fetchStrategicExecutiveData(currency, year, month),
      Logic.bgo.fetchBGOData(currency, year, month),
      Logic.sr.fetchSRData(currency, year, month),
      Logic.xoo.fetchXOOData(currency, year, month),
      Logic.os.fetchOSData(currency, year, month)
    ]);

    console.log('✅ All dashboard data initialized successfully');

    return {
      overview: overviewData,
      businessFlow: businessFlowData,
      strategicExecutive: strategicExecutiveData,
      bgo: bgoData,
      sr: srData,
      xoo: xooData,
      os: osData,
      meta: {
        currency,
        year,
        month,
        generatedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    };
  } catch (error) {
    console.error('❌ Failed to initialize dashboard data:', error);
    throw error;
  }
}

/**
 * Test Database Connection for All Logic
 * @returns {Promise<Object>} Connection test results
 */
export async function testAllConnections() {
  try {
    console.log('🔍 Testing database connections...');
    
    const connectionTest = await Database.checkConnection();
    const tableTests = await Database.testTables();
    const databaseStats = await Database.getStats();

    console.log('✅ Database connection tests completed');

    return {
      connectionStatus: connectionTest,
      tableStatus: tableTests,
      databaseStats,
      testTime: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    throw error;
  }
}

/**
 * Initialize Database Tables
 * @returns {Promise<boolean>} Initialization success status
 */
export async function setupDatabase() {
  try {
    console.log('🛠️ Setting up database tables...');
    
    const result = await Database.initializeTables();
    
    if (result) {
      console.log('✅ Database setup completed successfully');
    } else {
      console.log('❌ Database setup failed');
    }

    return result;
  } catch (error) {
    console.error('❌ Database setup error:', error);
    throw error;
  }
}

/**
 * Get System Health Status
 * @returns {Promise<Object>} System health information
 */
export async function getSystemHealth() {
  try {
    const connectionTest = await Database.checkConnection();
    const tableTests = await Database.testTables();
    
    const healthStatus = {
      database: connectionTest ? 'healthy' : 'unhealthy',
      tables: Object.values(tableTests).every(table => table.exists) ? 'healthy' : 'partial',
      logic: 'healthy',
      timestamp: new Date().toISOString()
    };

    return healthStatus;
  } catch (error) {
    console.error('❌ System health check failed:', error);
    return {
      database: 'unhealthy',
      tables: 'unhealthy',
      logic: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Default export
export default {
  DashboardLogic,
  Database,
  Formatters,
  Logic,
  initializeAllDashboards,
  testAllConnections,
  setupDatabase,
  getSystemHealth
}; 