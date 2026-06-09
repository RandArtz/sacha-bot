import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../types";

const answers = [
  "En mi opinión, sí. 🐭☕",
  "Es cierto, carnal. Aunque no me preguntes por qué. 🐭",
  "Es decididamente así. *toma café*",
  "Probablemente. O no. ¿Quién soy yo para juzgar? 🐭💢",
  "Buen pronóstico. *se ajusta los lentes*",
  "Todo apunta a que sí. Pero igual revisa los cables. 🐭🔧",
  "Sin duda. Como que el café es vida. 🐭☕",
  "Sí, wey. Y no le busques más. 🐭",
  "Sí, definitivamente. *asiente*",
  "Debes confiar en ello. O en mí. Yo no fallo. 🐭✨",
  "Respuesta vaga, vuelve a intentarlo. No soy adivina, carnal. 🐭💢",
  "Pregunta en otro momento. Ahora estoy soldando. 🐭🔧",
  "Será mejor que no te lo diga ahora. Por tu bien. 🐭🔪",
  "No puedo predecirlo ahora. Se me quemó el circuito. 🐭⚡",
  "Concéntrate y vuelve a preguntar. O tómate un café. 🐭☕",
  "No cuentes con ello. Como si yo contara con que Randy me va a limpiar algún día. 🐭",
  "Mi respuesta es no. Y punto. 🐭💢",
  "Mis fuentes me dicen que no. Mis fuentes soy yo. 🐭",
  "Las perspectivas no son buenas. Mejor ponte a hacer algo útil. 🐭🔧",
  "Muy dudoso. Como que Gemini te deje usar su API. 🐭💀",
];

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("La bola mágica responde tus preguntas 🎱")
    .addStringOption((option) =>
      option
        .setName("pregunta")
        .setDescription("Lo que quieras saber")
        .setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const question = interaction.options.getString("pregunta", true);
    const answer = answers[Math.floor(Math.random() * answers.length)];

    const embed = new EmbedBuilder()
      .setColor(0x670074)
      .setTitle("🎱 " + interaction.user.tag + " preguntó a la bola mágica...")
      .addFields(
        { name: "📝 Pregunta", value: question, inline: false },
        { name: "🔮 Respuesta de Sacha", value: answer, inline: false },
      )
      .setThumbnail(interaction.user.displayAvatarURL())
      .setFooter({ text: "La rata sabe cosas. O no. 🐭" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export = command;
