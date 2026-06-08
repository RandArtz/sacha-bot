import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../types";
import { getRandomResponse } from "../utils/getRandomResponse";
import { formatDate } from "../utils/formatDate";

const USER_RESPONSES = [
  "Ahí está la info del user, carnal. 🐭☕",
  "*se ajusta los lentes* Toma. 🐭🔧",
];

const RANDY_USER_RESPONSES = ["Ese es Randy, mi creador. Un crack. 🐭💋"];

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Info de un usuario")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("Usuario (opcional)")
        .setRequired(false),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("usuario") || interaction.user;
    const member = await interaction.guild?.members
      .fetch(user.id)
      .catch(() => null);

    if (!interaction.guild || !member) {
      await interaction.reply("❌ No encontré a ese user.");
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        {
          name: "📅 Creación",
          value: formatDate(user.createdAt),
          inline: true,
        },
        {
          name: "📥 Llegada",
          value: member.joinedAt ? formatDate(member.joinedAt) : "?",
          inline: true,
        },
        { name: "✏️ Apodo", value: member.nickname || "N/A", inline: true },
        {
          name: "📡 Estado",
          value: member.presence?.status || "offline",
          inline: true,
        },
        { name: "🤖 Bot", value: user.bot ? "Sí" : "No", inline: true },
      )
      .setFooter({ text: `ID: ${user.id}` });

    const message = getRandomResponse(
      user.id,
      USER_RESPONSES,
      RANDY_USER_RESPONSES,
    );

    await interaction.reply({ content: message, embeds: [embed] });
  },
};

export = command;
