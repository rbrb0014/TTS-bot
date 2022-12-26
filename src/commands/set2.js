import { ChannelType, SlashCommandBuilder } from 'discord.js';

export default {
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
    return interaction.reply('pong!');
  }
}