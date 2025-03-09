#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const readline = require("readline");

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

// Function to boot an emulator
function bootEmulator(callback) {
    const bootedSimulator = getBootedSimulator();
    if (bootedSimulator) {
        console.log(`✅ Simulator already booted: ${bootedSimulator}`);
        callback(bootedSimulator);
        return;
    }

    console.log("🚀 Booting iOS emulator...");
    try {
        execSync("npm run boot-ios-emulator", { stdio: "inherit" });
        setTimeout(() => callback(getBootedSimulator()), 5000); // Wait for boot
    } catch (error) {
        console.error("❌ Failed to boot the emulator:", error.message);
        process.exit(1);
    }
}

// Function to prompt for app path
function promptForAppPath(callback) {
    const defaultPath = `${process.env.HOME}/Downloads/LynxExplorer-arm64.app`;
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question(`📂 Enter the full path to LynxExplorer '.app' file (or press Enter for default: ${defaultPath}): `, (appPath) => {
        rl.close();

        if (!appPath.trim()) {
            appPath = defaultPath;
        }

        if (!fs.existsSync(appPath)) {
            console.error("❌ Error: The file does not exist at the given path.");
            process.exit(1);
        }

        callback(appPath);
    });
}

// Function to install LynxExplorer
function installLynx(bootedSimulator, appPath, callback) {
    console.log(`🚀 Installing LynxExplorer on simulator (${bootedSimulator})...`);
    try {
        execSync(`xcrun simctl install ${bootedSimulator} "${appPath}"`, { stdio: "inherit" });
        console.log("✅ Installation complete!");
        callback();
    } catch (error) {
        console.error("❌ Failed to install the app:", error.message);
        process.exit(1);
    }
}

// Function to launch LynxExplorer
function launchLynx(bootedSimulator) {
    console.log(`🚀 Launching LynxExplorer on simulator (${bootedSimulator})...`);
    try {
        execSync(`xcrun simctl launch ${bootedSimulator} com.lynx.LynxExplorer`, { stdio: "inherit" });
        console.log("✅ LynxExplorer launched!");
    } catch (error) {
        console.error("❌ Failed to launch LynxExplorer:", error.message);
    }
}

// **Main Function**
bootEmulator((bootedSimulator) => {
    promptForAppPath((appPath) => {
        installLynx(bootedSimulator, appPath, () => {
            launchLynx(bootedSimulator);
        });
    });
});