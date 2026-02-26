#!/usr/bin/env node
// Build script for Vite client only
import { build as viteBuild } from "vite";

async function buildClient() {
  console.log("building client...");
  try {
    await viteBuild();
    console.log("✅ Build complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

buildClient();
