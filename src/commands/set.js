import { ChannelType, SlashCommandBuilder } from 'discord.js';

const setCommand = new SlashCommandBuilder()
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
  );

export default setCommand.toJSON();