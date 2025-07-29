/**
 * POSTGRESQL DATABASE CONNECTION
 * Centralized database connection for NEXMAX Dashboard
 * 
 * @author NEXMAX Dashboard Team
 * @version 1.0.0
 * @date 2025-07-29
 */

import pkg from 'pg';
const { Pool } = pkg;

/**
 * PostgreSQL Connection Pool Configuration
 */
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgre',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'crm_backend_data',
  password: process.env.POSTGRES_PASSWORD || 'CRM_Backend',
  port: process.env.POSTGRES_PORT || 5432,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

/**
 * Database Connection Health Check
 */
export async function checkDatabaseConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

/**
 * Execute Query with Error Handling
 */
export async function executeQuery(query, params = []) {
  try {
    const client = await pool.connect();
    const result = await client.query(query, params);
    client.release();
    return result;
  } catch (error) {
    console.error('❌ Query execution failed:', error.message);
    console.error('Query:', query);
    console.error('Params:', params);
    throw error;
  }
}

/**
 * Get Database Statistics
 */
export async function getDatabaseStats() {
  try {
    const stats = await executeQuery(`
      SELECT 
        schemaname,
        tablename,
        attname,
        n_distinct,
        correlation
      FROM pg_stats 
      WHERE schemaname = 'public'
      ORDER BY tablename, attname
    `);
    
    return {
      totalTables: stats.rows.length,
      tables: stats.rows
    };
  } catch (error) {
    console.error('❌ Failed to get database stats:', error.message);
    return { totalTables: 0, tables: [] };
  }
}

/**
 * Test Database Tables
 */
export async function testDatabaseTables() {
  const tables = [
    'transactions',
    'customer_analytics',
    'business_metrics',
    'operational_metrics',
    'ppc_service_metrics',
    'first_depositor_metrics',
    'old_member_metrics',
    'traffic_executive_metrics',
    'strategic_metrics',
    'ggr_metrics',
    'ggr_pure_metrics',
    'customer_value_metrics',
    'customer_headcount_metrics',
    'customer_volume_dept_metrics'
  ];

  const results = {};
  
  for (const table of tables) {
    try {
      const result = await executeQuery(`SELECT COUNT(*) FROM ${table}`);
      results[table] = {
        exists: true,
        count: parseInt(result.rows[0].count)
      };
    } catch (error) {
      results[table] = {
        exists: false,
        count: 0,
        error: error.message
      };
    }
  }

  return results;
}

/**
 * Initialize Database Tables (if needed)
 */
export async function initializeDatabaseTables() {
  const createTablesQueries = [
    // Transactions table
    `CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      customer_id VARCHAR(50),
      transaction_date DATE,
      deposit_amount DECIMAL(15,2),
      withdraw_amount DECIMAL(15,2),
      transaction_type VARCHAR(20),
      amount DECIMAL(15,2),
      currency VARCHAR(3),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Customer Analytics table
    `CREATE TABLE IF NOT EXISTS customer_analytics (
      id SERIAL PRIMARY KEY,
      customer_id VARCHAR(50),
      transaction_date DATE,
      customer_lifetime_value DECIMAL(15,2),
      purchase_frequency DECIMAL(5,2),
      currency VARCHAR(3),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Business Metrics table
    `CREATE TABLE IF NOT EXISTS business_metrics (
      id SERIAL PRIMARY KEY,
      transaction_date DATE,
      revenue DECIMAL(15,2),
      cost DECIMAL(15,2),
      customer_id VARCHAR(50),
      currency VARCHAR(3),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Operational Metrics table
    `CREATE TABLE IF NOT EXISTS operational_metrics (
      id SERIAL PRIMARY KEY,
      transaction_date DATE,
      revenue DECIMAL(15,2),
      operational_cost DECIMAL(15,2),
      currency VARCHAR(3),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // PPC Service Metrics table
    `CREATE TABLE IF NOT EXISTS ppc_service_metrics (
      id SERIAL PRIMARY KEY,
      date DATE,
      new_customer_id VARCHAR(50),
      conversion_rate DECIMAL(5,2),
      group_join_volume INTEGER,
      currency VARCHAR(3),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // First Depositor Metrics table
    `CREATE TABLE IF NOT EXISTS first_depositor_metrics (
      id SERIAL PRIMARY KEY,
      date DATE,
      customer_id VARCHAR(50),
      deposit_rate DECIMAL(5,2),
      is_in_group BOOLEAN,
      currency VARCHAR(3),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Old Member Metrics table
    `CREATE TABLE IF NOT EXISTS old_member_metrics (
      id SERIAL PRIMARY KEY,
      date DATE,
      customer_id VARCHAR(50),
      tier VARCHAR(20),
      upgrade_status VARCHAR(20),
      churn_status VARCHAR(20),
      engagement_rate DECIMAL(5,2),
      nps_score INTEGER,
      upgrade_rate DECIMAL(5,2),
      currency VARCHAR(3),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Traffic Executive Metrics table
    `CREATE TABLE IF NOT EXISTS traffic_executive_metrics (
      id SERIAL PRIMARY KEY,
      date DATE,
      customer_id VARCHAR(50),
      tier VARCHAR(20),
      reactivation_rate DECIMAL(5,2),
      reactivated_customer_id VARCHAR(50),
      transfer_success_rate DECIMAL(5,2),
      target_completion_rate DECIMAL(5,2),
      currency VARCHAR(3),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Strategic Metrics table
    `CREATE TABLE IF NOT EXISTS strategic_metrics (
      id SERIAL PRIMARY KEY,
      date DATE,
      revenue DECIMAL(15,2),
      cost DECIMAL(15,2),
      customer_id VARCHAR(50),
      customer_lifetime_value DECIMAL(15,2),
      is_active BOOLEAN,
      currency VARCHAR(3),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // GGR Metrics table
    `CREATE TABLE IF NOT EXISTS ggr_metrics (
      id SERIAL PRIMARY KEY,
      date DATE,
      ggr_amount DECIMAL(15,2),
      user_id VARCHAR(50),
      currency VARCHAR(3),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // GGR Pure Metrics table
    `CREATE TABLE IF NOT EXISTS ggr_pure_metrics (
      id SERIAL PRIMARY KEY,
      date DATE,
      pure_ggr_amount DECIMAL(15,2),
      pure_user_id VARCHAR(50),
      currency VARCHAR(3),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Customer Value Metrics table
    `CREATE TABLE IF NOT EXISTS customer_value_metrics (
      id SERIAL PRIMARY KEY,
      date DATE,
      customer_value_per_headcount DECIMAL(15,2),
      headcount_id VARCHAR(50),
      currency VARCHAR(3),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Customer Headcount Metrics table
    `CREATE TABLE IF NOT EXISTS customer_headcount_metrics (
      id SERIAL PRIMARY KEY,
      date DATE,
      customer_id VARCHAR(50),
      headcount_id VARCHAR(50),
      currency VARCHAR(3),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Customer Volume Department Metrics table
    `CREATE TABLE IF NOT EXISTS customer_volume_dept_metrics (
      id SERIAL PRIMARY KEY,
      date DATE,
      customer_id VARCHAR(50),
      department VARCHAR(50),
      volume DECIMAL(15,2),
      currency VARCHAR(3),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  try {
    for (const query of createTablesQueries) {
      await executeQuery(query);
    }
    console.log('✅ Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize database tables:', error.message);
    return false;
  }
}

export { pool };
export default pool; 