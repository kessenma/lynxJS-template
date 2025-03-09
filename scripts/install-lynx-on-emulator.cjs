#!/usr/bin/env node

const { execSync } = require("child_process");
const readline = require("readline");
const fs = require("fs");

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

// Function to prompt the user for the app file path
function promptForAppPath(callback) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question(`📂 Enter the full path to LynxExplorer '.app' file (or press Enter for default: ~/Downloads/LynxExplorer-arm64.app): `, (appPath) => {
        if (!appPath.trim()) {
            appPath = `${process.env.HOME}/Downloads/LynxExplorer-arm64.app`;
        }
        rl.close();

        if (!fs.existsSync(appPath)) {
            console.error("❌ Error: The file does not exist at the given path.");
            process.exit(1);
        }

        callback(appPath);
    });
}

// Function to install the app on the emulator
function installApp(appPath) {
    const bootedSimulator = getBootedSimulator();
    if (!bootedSimulator) {
        console.error("⚠️ No booted iOS simulator found. Run `npm run boot-ios-emulator` first.");
        process.exit(1);
    }

    console.log(`🚀 Installing LynxExplorer on simulator (${bootedSimulator})...`);
    try {
        execSync(`xcrun simctl install ${bootedSimulator} "${appPath}"`, { stdio: "inherit" });
        console.log("✅ Installation complete!");
    } catch (error) {
        console.error("❌ Failed to install the app:", error.message);
    }
}

// Run the script
promptForAppPath(installApp);