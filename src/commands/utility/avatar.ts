import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../types";
import { getRandomResponse } from "../../utils/getRandomResponse";

const AVATAR_RESPONSES = [
  "Ahí está la cara de tu amigo, carnal. 🐭☕",
  "*se ajusta los lentes* Buena foto, aunque la mía sale mejor.",
  "¿Para qué quieres verle la jeta? Bueno, ahí te va. 🐭",
  "*silba* Qué bien sale en cámara, carnal.",
  "Ta bonito. Pero no como yo, obvio.",
];

const RANDY_AVATAR_RESPONSES = [
  "*se ríe* Ahí está el Randy, todo hermoso. 🐭💋",
  "*levanta la taza* El creador en todo su esplendor. 🐭☕",
  "Randy... siempre tan fotogénico. *rueda los ojos* 🐭🔧",
  "Esa es la cara del que me trajo a este mundo. Casi me da ternura. 🐭💋",
];

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Muestra el avatar de un usuario")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("El usuario que quieres ver (opcional)")
        .setRequired(false),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("usuario") || interaction.user;

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setImage(user.displayAvatarURL({ size: 512, extension: "png" }))
      .setFooter({
        text: `ID: ${user.id} • Solicitado por ${interaction.user.username}`,
      })
      .setTimestamp();

    const message = getRandomResponse(
      user.id,
      AVATAR_RESPONSES,
      RANDY_AVATAR_RESPONSES,
    );

    await interaction.reply({ content: message, embeds: [embed] });
  },
};

export = command;
