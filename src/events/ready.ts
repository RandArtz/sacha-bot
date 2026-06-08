import { Client, REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";

module.exports = {
  name: "clientReady",
  once: true,
  async execute(client: Client) {
    console.log(`✅ ${client.user?.tag} is online!`);

    const commands: any[] = [];
    const commandsPath = path.join(__dirname, "../commands");
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(path.join(commandsPath, file));
      if (command.data) {
        commands.push(command.data.toJSON());
      }
    }

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);

    try {
      await rest.put(Routes.applicationCommands(client.user!.id), {
        body: commands,
      });
      console.log(`✅ Registered ${commands.length} commands`);
    } catch (error) {
      console.error("❌ Failed to register commands:", error);
    }
  },
};
