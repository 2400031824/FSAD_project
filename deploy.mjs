import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Supabase connection details
const client = new Client({
  host: 'kpirmwbrmahqbuvgryul.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'SriPhani06#$',
  ssl: { rejectUnauthorized: false }
});

async function deploySchema() {
  try {
    console.log('🚀 Connecting to Supabase PostgreSQL database...\n');
    
    await client.connect();
    console.log('✅ Connected successfully!\n');
    
    // Read schema.sql
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ schema.sql not found at:', schemaPath);
      process.exit(1);
    }
    
    const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');
    console.log('📄 Schema file loaded\n');
    console.log('⏳ Executing schema deployment (this may take 30-60 seconds)...\n');
    
    // Execute the entire schema as one statement
    await client.query(schemaSQL);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ DEPLOYMENT SUCCESSFUL!\n');
    console.log('Your Supabase database now has:');
    console.log('  ✅ 8 ENUM types');
    console.log('  ✅ 9 tables with foreign keys');
    console.log('  ✅ 40+ performance indexes');
    console.log('  ✅ 20+ RLS policies');
    console.log('  ✅ 7 automated triggers');
    console.log('  ✅ 4 analytics views\n');
    console.log('='.repeat(60));
    console.log('\n📋 NEXT STEPS:\n');
    console.log('1. Create Storage Buckets:');
    console.log('   - Go to Storage > New Bucket');
    console.log('   - Create: resumes, company_logos, offer_letters, profile_pictures, interview_documents\n');
    console.log('2. Create Auth Users:');
    console.log('   - Go to Authentication > Users');
    console.log('   - Create test users for STUDENT, RECRUITER, PLACEMENT_OFFICER, ADMIN\n');
    console.log('3. Load Sample Data:');
    console.log('   - Use database/seed.sql with actual user UUIDs\n');
    console.log('4. Update App Config:');
    console.log('   - Set VITE_SUPABASE_URL=https://kpirmwbrmahqbuvgryul.supabase.co');
    console.log('   - Set VITE_SUPABASE_ANON_KEY from Settings > API\n');
    
  } catch (error) {
    console.error('❌ Deployment failed:');
    console.error(error.message);
    
    if (error.message.includes('connect ECONNREFUSED')) {
      console.error('\n💡 Connection failed - check if:');
      console.error('   - Supabase project is active');
      console.error('   - Database password is correct');
      console.error('   - Your IP is whitelisted (or use Supabase IP whitelist)\n');
    }
    
    process.exit(1);
  } finally {
    await client.end();
    console.log('✅ Connection closed\n');
  }
}

deploySchema();
