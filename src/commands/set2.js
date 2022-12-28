const { ChannelType, SlashCommandBuilder } = require('discord.js');
let tts_channel = null;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set')
    .setDescription('TTS settings')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('channel')
        .setDescription('set channel to speak on')
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('channel to speak on')
            .addChannelTypes(ChannelType.GuildText)
        )
    ),
  execute: async (interaction) => {
    tts_channel = interaction.options.getChannel('channel');
    await interaction.reply({ content: `TTS activated in ${tts_channel}.` });
  },
  getTtsChannel: () => { return tts_channel },
}