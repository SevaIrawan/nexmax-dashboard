/**
 * DATABASE STRUCTURE READER
 * Automatic database structure detection for NEXMAX Dashboard
 * 
 * @author NEXMAX Dashboard Team
 * @version 1.0.0
 * @date 2025-07-29
 */

import { pool } from './postgresql.js';

/**
 * Read all tables in the database
 */
export async function getAllTables() {
  try {
    const query = `
      SELECT 
        schemaname,
        tablename,
        tableowner
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `;
    
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('❌ Error reading tables:', error);
    return [];
  }
}

/**
 * Read table structure (columns)
 */
export async function getTableStructure(tableName) {
  try {
    const query = `
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length,
        numeric_precision,
        numeric_scale
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = $1
      ORDER BY ordinal_position;
    `;
    
    const result = await pool.query(query, [tableName]);
    return result.rows;
  } catch (error) {
    console.error(`❌ Error reading table structure for ${tableName}:`, error);
    return [];
  }
}

/**
 * Read all tables with their structures
 */
export async function getDatabaseStructure() {
  try {
    console.log('🔍 Reading database structure...');
    
    const tables = await getAllTables();
    const databaseStructure = {};
    
    for (const table of tables) {
      const tableName = table.tablename;
      const columns = await getTableStructure(tableName);
      
      databaseStructure[tableName] = {
        owner: table.tableowner,
        columns: columns.map(col => ({
          name: col.column_name,
          type: col.data_type,
          nullable: col.is_nullable === 'YES',
          default: col.column_default,
          maxLength: col.character_maximum_length,
          precision: col.numeric_precision,
          scale: col.numeric_scale
        }))
      };
    }
    
    console.log(`✅ Found ${tables.length} tables in database`);
    return databaseStructure;
  } catch (error) {
    console.error('❌ Error reading database structure:', error);
    return {};
  }
}

/**
 * Get sample data from table
 */
export async function getTableSample(tableName, limit = 5) {
  try {
    const query = `SELECT * FROM ${tableName} LIMIT $1`;
    const result = await pool.query(query, [limit]);
    return result.rows;
  } catch (error) {
    console.error(`❌ Error getting sample data from ${tableName}:`, error);
    return [];
  }
}

/**
 * Get table row count
 */
export async function getTableCount(tableName) {
  try {
    const query = `SELECT COUNT(*) as count FROM ${tableName}`;
    const result = await pool.query(query);
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error(`❌ Error getting count for ${tableName}:`, error);
    return 0;
  }
}

/**
 * Generate complete database report
 */
export async function generateDatabaseReport() {
  try {
    console.log('📊 Generating database report...');
    
    const structure = await getDatabaseStructure();
    const report = {
      summary: {
        totalTables: Object.keys(structure).length,
        timestamp: new Date().toISOString(),
        database: process.env.POSTGRES_DB || 'crm_backend_data'
      },
      tables: {}
    };
    
    for (const [tableName, tableInfo] of Object.entries(structure)) {
      const rowCount = await getTableCount(tableName);
      const sampleData = await getTableSample(tableName, 3);
      
      report.tables[tableName] = {
        columns: tableInfo.columns,
        rowCount,
        sampleData,
        columnCount: tableInfo.columns.length
      };
    }
    
    console.log('✅ Database report generated successfully');
    return report;
  } catch (error) {
    console.error('❌ Error generating database report:', error);
    return null;
  }
}

/**
 * Check if table exists
 */
export async function tableExists(tableName) {
  try {
    const query = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      );
    `;
    
    const result = await pool.query(query, [tableName]);
    return result.rows[0].exists;
  } catch (error) {
    console.error(`❌ Error checking if table ${tableName} exists:`, error);
    return false;
  }
}

/**
 * Get foreign key relationships
 */
export async function getForeignKeys() {
  try {
    const query = `
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public';
    `;
    
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('❌ Error getting foreign keys:', error);
    return [];
  }
}

/**
 * Display database structure in readable format
 */
export function displayDatabaseStructure(structure) {
  console.log('\n📋 DATABASE STRUCTURE:');
  console.log('═'.repeat(50));
  
  for (const [tableName, tableInfo] of Object.entries(structure)) {
    console.log(`\n📊 Table: ${tableName.toUpperCase()}`);
    console.log('─'.repeat(30));
    
    tableInfo.columns.forEach(col => {
      const nullable = col.nullable ? 'NULL' : 'NOT NULL';
      const typeInfo = col.maxLength ? `${col.type}(${col.maxLength})` : col.type;
      console.log(`  • ${col.name.padEnd(20)} | ${typeInfo.padEnd(15)} | ${nullable}`);
    });
  }
  
  console.log('\n═'.repeat(50));
}

export default {
  getAllTables,
  getTableStructure,
  getDatabaseStructure,
  getTableSample,
  getTableCount,
  generateDatabaseReport,
  tableExists,
  getForeignKeys,
  displayDatabaseStructure
}; 