import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Your Supabase credentials
const SUPABASE_URL = "https://kpirmwbrmahqbuvgryul.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwaXJtd2JybWfhxc2MgaWF0IjoxNzQwODgwNzM4LCJpYXRfaW50IjoyMDAwZDQxLCJkc2tfdmVyc2lvbiI6IjEifQ.kpirmwbrmahqbuvgryul"; // Will be set via env var

// Create Supabase client with service role key for deploy
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function deploySchema() {
  try {
    console.log("🚀 Starting Supabase schema deployment...\n");
    console.log(`📍 Project URL: ${SUPABASE_URL}\n`);

    // Read schema.sql file
    const schemaPath = path.join(__dirname, "database", "schema.sql");

    if (!fs.existsSync(schemaPath)) {
      console.error("❌ schema.sql not found at:", schemaPath);
      process.exit(1);
    }

    const schemaSQL = fs.readFileSync(schemaPath, "utf-8");
    console.log("✅ Schema file loaded\n");

    // Split by semicolon and filter empty statements
    const statements = schemaSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`📊 Found ${statements.length} SQL statements to execute\n`);

    // Execute statements
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ";";

      try {
        const { error } = await supabase.rpc("exec_sql", {
          sql: statement,
        });

        if (error) {
          console.error(`❌ Statement ${i + 1} failed:`);
          console.error(`   ${statement.substring(0, 80)}...`);
          console.error(`   Error: ${error.message}\n`);
          errorCount++;
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Error executing statement ${i + 1}:`, err.message);
        errorCount++;
      }

      // Show progress
      if ((i + 1) % 10 === 0) {
        console.log(`   [${i + 1}/${statements.length}]\n`);
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("📈 Deployment Summary:");
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📋 Total: ${statements.length}`);
    console.log("=".repeat(50) + "\n");

    if (errorCount === 0) {
      console.log("🎉 Deployment completed successfully!\n");
      console.log("Next steps:");
      console.log("1. Create 5 storage buckets in Supabase dashboard:");
      console.log("   - resumes (Private)");
      console.log("   - company_logos (Public)");
      console.log("   - offer_letters (Private)");
      console.log("   - profile_pictures (Public)");
      console.log("   - interview_documents (Private)\n");
      console.log("2. Create test users in Authentication tab");
      console.log("3. Load sample data using database/seed.sql\n");
    } else {
      console.log(
        "⚠️  Some statements failed. Check errors above and rerun.\n"
      );
    }
  } catch (error) {
    console.error("❌ Fatal error during deployment:");
    console.error(error.message);
    process.exit(1);
  }
}

// Deploy
deploySchema().catch(console.error);
