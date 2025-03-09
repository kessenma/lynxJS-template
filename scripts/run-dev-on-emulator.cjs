#!/usr/bin/env node

const { execSync } = require("child_process");
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

// Function to build the ReactLynx app
function buildApp(callback) {
    console.log("⚙️  Building your ReactLynx app...");
    try {
        execSync("npm run build", { stdio: "inherit" });
        console.log("✅ Build complete!");
        callback();
    } catch (error) {
        console.error("❌ Failed to build the app:", error.message);
        process.exit(1);
    }
}

// Function to start the dev server and open the app in Safari on the emulator
function startDevServer() {
    console.log("🚀 Running the ReactLynx app...");

    // Start the server in the background
    const devProcess = execSync("npm run dev", { stdio: "inherit" });

    console.log("🌍 Opening the app in Safari on the iOS emulator...");
    try {
        // Open Safari on the emulator with the app URL
        const bootedSimulator = getBootedSimulator();
        execSync(`xcrun simctl openurl ${bootedSimulator} http://localhost:3002/main.lynx.bundle?fullscreen=true`, { stdio: "inherit" });
        console.log("✅ App launched successfully in the iOS emulator!");
    } catch (error) {
        console.error("❌ Failed to open the app in Safari:", error.message);
    }
}

// **Main Function**
bootEmulator(() => {
    buildApp(() => {
        startDevServer();
    });
});