import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  REST,
  Routes,
  MessageFlags,
} from "discord.js";
import { Command } from "../../types";
import { isRandy } from "../../utils/randy";
import fs from "fs";
import path from "path";

function loadCommandsRecursive(dir: string, commandsMap: Map<string, any>) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.resolve(dir, file.name);

    if (file.isDirectory()) {
      loadCommandsRecursive(fullPath, commandsMap);
    } else if (file.name.endsWith(".ts") || file.name.endsWith(".js")) {
      // Limpia del cache usando el path real, incluso si nunca se había requerido
      delete require.cache[fullPath];
      delete require.cache[fullPath.replace(/\.ts$/, ".js")];

      try {
        const commandModule = require(fullPath);
        const cmd = commandModule.default || commandModule;
        if (cmd.data && cmd.execute) {
          commandsMap.set(cmd.data.name, cmd);
        }
      } catch (err) {
        console.error(`❌ Error cargando comando ${fullPath}:`, err);
      }
    }
  }
}

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Recarga y re-registra todos los comandos. Solo Randy. 🔄"),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!isRandy(interaction.user.id)) {
      await interaction.reply({
        content:
          "❌ Eso solo lo hace Randy, carnal. No te pases de listo. 🐭💢",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    } catch {
      console.warn("⚠️ /reload: Interacción expiró antes de deferir.");
      return;
    }

    const client = interaction.client;
    client.commands.clear();

    const commandsPath = path.join(__dirname, "../../commands");
    loadCommandsRecursive(commandsPath, client.commands as any);

    const commands = client.commands.map((cmd: any) => cmd.data.toJSON());
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);

    try {
      await rest.put(Routes.applicationCommands(client.user!.id), {
        body: commands,
      });
      try {
        await interaction.editReply(
          `✅ ${commands.length} comandos recargados y registrados en Discord. 🐭🔧`,
        );
      } catch {
        console.warn(
          "⚠️ /reload: No se pudo responder (interacción inválida).",
        );
      }
    } catch (error) {
      console.error("❌ /reload error:", error);
      try {
        await interaction.editReply(
          "❌ Falló el registro en Discord. Revisa la consola.",
        );
      } catch {
        // Si el defer falló silenciosamente, no podemos responder.
      }
    }
  },
};

export = command;
