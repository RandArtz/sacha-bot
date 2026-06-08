import { Interaction, MessageFlags } from "discord.js";

module.exports = {
  name: "interactionCreate",
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    let options = "";
    if (interaction.options.data.length > 0) {
      options = interaction.options.data
        .map((option) => `${option.name}:${option.value}`)
        .join(", ");
    }

    // Log completo
    console.log(
      `[CMD] ${interaction.user.tag} (${interaction.user.id}) -> /${interaction.commandName} ${options}`,
    );

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.warn(`⚠️ Command not found: ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`❌ Error executing ${interaction.commandName}:`, error);

      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";

      const reply = `❌ Valió queso: **${errorMessage}**. \n\nO la rata se enredó en los cables o fue Gemini que volvió a hacer de las suyas. 🙄🐭`;

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: reply,
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: reply,
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
