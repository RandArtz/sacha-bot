import {
  REST,
  Routes,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
const commandsPath = path.join(__dirname, "commands");

// Función recursiva para leer todas las carpetas
async function readCommands(dir: string) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      await readCommands(fullPath);
    } else if (file.name.endsWith(".ts") || file.name.endsWith(".js")) {
      try {
        const commandModule = await import(fullPath);
        const command = commandModule.default || commandModule;
        if (command.data) {
          commands.push(command.data.toJSON());
          console.log(`✅ ${command.data.name}`);
        }
      } catch (error) {
        console.error(`❌ Error loading ${file.name}:`, error);
      }
    }
  }
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);

(async () => {
  try {
    await readCommands(commandsPath);
    console.log(`📡 Total commands found: ${commands.length}`);

    console.log(`📡 Registrando ${commands.length} comandos...`);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
      body: commands,
    });
    console.log("✅ Comandos registrados");
  } catch (error) {
    console.error(error);
  }
})();
