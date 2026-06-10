const { spawn } = require("child_process");
const fs = require("fs");

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { stdio: "inherit", shell: true });
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed with code ${code}`));
    });
    proc.on("error", reject);
  });
}

async function start() {
  if (fs.existsSync(".git")) {
    try {
      await runCommand("git", ["pull"]);
    } catch (e) {}
  }

  try {
    await runCommand("npm", ["install"]);
  } catch (e) {}

  const bot = spawn("npx", ["--yes", "ts-node", "src/index.ts"], {
    stdio: "inherit",
    shell: true,
  });

  bot.on("exit", (code) => {
    process.exit(code);
  });
}

start();
