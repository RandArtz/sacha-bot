import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../types";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Responde con Pong!"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply(
      "🏓 ¡Pong! ...aunque pa' ping me quedé dormida, ¿no? 🐭",
    );
  },
};

export = command;
