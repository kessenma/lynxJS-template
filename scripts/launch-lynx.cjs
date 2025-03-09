#!/usr/bin/env node

const { execSync } = require("child_process");

// Function to get the currently booted simulator
function getBootedSimulator() {
    try {
        const output = execSync("xcrun simctl list devices booted", { encoding: "utf-8" });
        const match = output.match(/\(([\w-]+)\) \(Booted\)/);
        return match ? match[1] : null;
    } catch (error) {
        console.error("❌ Error fetching booted simulator:", error.message);
        process.exit(1);
    }
}

// Function to launch LynxExplorer
function launchLynx() {
    const bootedSimulator = getBootedSimulator();
    if (!bootedSimulator) {
        console.error("⚠️ No booted iOS simulator found. Run `npm run boot-ios-emulator` first.");
        process.exit(1);
    }

    console.log(`🚀 Launching LynxExplorer on simulator (${bootedSimulator})...`);
    try {
        execSync(`xcrun simctl launch ${bootedSimulator} com.lynx.LynxExplorer`, { stdio: "inherit" });
        console.log("✅ LynxExplorer launched!");
    } catch (error) {
        console.error("❌ Failed to launch LynxExplorer:", error.message);
    }
}

// Run the script
launchLynx();