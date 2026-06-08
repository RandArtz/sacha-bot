import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../types";
import { getRandomResponse } from "../utils/getRandomResponse";

const SERVER_RESPONSES = [
  "Aquí está el chisme del server, carnal. 🐭☕",
  "*se ajusta los lentes* Ahí te va la info. 🐭🔧",
  "Qué bonito server, lastima que no es mío. 🐭💢",
];

const RANDY_SERVER_RESPONSES = [
  "Randy, tu server está decente. Para ser tuyo, está bien. 🐭💋",
  "*se ríe* Me gusta más mi taller, pero el tuyo también tiene lo suyo. 🐭☕",
];

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Muestra información del servidor"),

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;

    if (!guild) {
      await interaction.reply("❌ Esto solo funciona en un servidor.");
      return;
    }

    await guild.fetch();
    const owner = await guild.fetchOwner();

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setAuthor({ name: guild.name, iconURL: guild.iconURL() || undefined })
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: "👑 Dueño", value: `<@${owner.id}>`, inline: true },
        { name: "👥 Miembros", value: `${guild.memberCount}`, inline: true },
        {
          name: "📅 Creado",
          value: guild.createdAt.toLocaleDateString(),
          inline: true,
        },
        { name: "🏷️ Roles", value: `${guild.roles.cache.size}`, inline: true },
        {
          name: "💬 Canales",
          value: `${guild.channels.cache.size}`,
          inline: true,
        },
      )
      .setFooter({ text: `ID: ${guild.id}` })
      .setTimestamp();

    const message = getRandomResponse(
      interaction.user.id,
      SERVER_RESPONSES,
      RANDY_SERVER_RESPONSES,
    );

    await interaction.reply({ content: message, embeds: [embed] });
  },
};

export = command;
