import { Client, REST, Routes } from "discord.js";

module.exports = {
  name: "clientReady",
  once: true,
  async execute(client: Client) {
    console.log(`✅ ${client.user?.tag} is online!`);

    const commands = client.commands.map((cmd: any) => cmd.data.toJSON());

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
