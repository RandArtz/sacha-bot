import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Message,
} from "discord.js";
import { Command } from "../types";
import { askApi } from "../utils/api";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Pregúntale a Sacha")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("Tu pregunta")
        .setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const question = interaction.options.getString("question", true);

    const response = await askApi(
      question,
      interaction.user.id,
      interaction.user.username,
      interaction as unknown as Message,
    );

    await interaction.editReply(response);
  },
};

export = command;
