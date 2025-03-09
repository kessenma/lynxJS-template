#!/usr/bin/env node

const { execSync } = require("child_process");
const readline = require("readline");

// Fetch all iOS simulators
function getSimulators() {
    try {
        console.log("📡 Fetching iOS simulators...");
        const output = execSync("xcrun simctl list devices available", { encoding: "utf-8" });
        const lines = output.split("\n");
        const simulators = [];

        lines.forEach((line) => {
            // Improved regex to ignore headers (e.g., "-- iOS 17.2 --") and extract the correct name & UDID
            const match = line.match(/^\s*(.+?) \(([\w-]+)\) \((Shutdown|Booted)?\)\s*$/);
            if (match) {
                const name = match[1].trim();
                const udid = match[2].trim();
                const state = match[3] ? match[3].trim() : "Unknown";

                simulators.push({ name, udid, state });
            }
        });

        if (simulators.length === 0) {
            console.log("⚠️ No iOS simulators found.");
            process.exit(1);
        }

        console.log(`✅ Found ${simulators.length} iOS simulators.`);
        return simulators;
    } catch (error) {
        console.error("❌ Error fetching simulators:", error.message);
        process.exit(1);
    }
}

// Prompt user to select a simulator
function selectSimulator(simulators) {
    if (simulators.length === 0) {
        console.log("⚠️ No iOS simulators found.");
        return;
    }

    console.log("\nAvailable iOS Simulators:");
    simulators.forEach((sim, index) => {
        console.log(`${index + 1}. ${sim.name} (${sim.udid}) - [${sim.state}]`);
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question("\nSelect a simulator number to boot: ", (answer) => {
        const index = parseInt(answer, 10) - 1;
        if (index >= 0 && index < simulators.length) {
            const selectedSim = simulators[index];

            console.log(`\n🚀 Booting ${selectedSim.name} (${selectedSim.udid})...`);

            try {
                execSync(`xcrun simctl boot "${selectedSim.udid}"`, { stdio: "inherit" });
                console.log(`✅ Successfully booted ${selectedSim.name}!`);
                execSync("open -a Simulator", { stdio: "inherit" }); // Open Simulator.app
            } catch (error) {
                console.error(`❌ Failed to boot the simulator: ${error.message}`);
            }
        } else {
            console.log("❌ Invalid selection. Exiting...");
        }
        rl.close();
    });
}

// Run script
const simulators = getSimulators();
selectSimulator(simulators);