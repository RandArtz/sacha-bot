import { Client, GatewayIntentBits, Collection } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import "./types";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

client.commands = new Collection();

function loadCommands(dir: string) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      loadCommands(fullPath);
    } else if (file.name.endsWith(".ts") || file.name.endsWith(".js")) {
      try {
        const commandModule = require(fullPath);
        const command = commandModule.default || commandModule;
        if (command.data && command.execute) {
          client.commands.set(command.data.name, command);
          console.log(`✅ Loaded command: ${command.data.name}`);
        }
      } catch (err) {
        console.error(`❌ Error requiring ${fullPath}:`, err);
      }
    }
  }
}

function main() {
  const commandsPath = path.join(__dirname, "commands");
  loadCommands(commandsPath);

  const eventsPath = path.join(__dirname, "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));

    if (event.once) {
      client.once(event.name, (...args: any[]) =>
        event.execute(...args, client),
      );
    } else {
      client.on(event.name, (...args: any[]) => event.execute(...args, client));
    }
    console.log(`✅ Loaded event: ${event.name}`);
  }

  const token = process.env.TOKEN;

  if (!token) {
    console.error("❌ No token in .env file");
    process.exit(1);
  }

  client.login(token);
}

main();
