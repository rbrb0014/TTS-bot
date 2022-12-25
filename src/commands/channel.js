import { SlashCommandBuilder } from 'discord.js';

const channelsCommand = new SlashCommandBuilder()
  .setName('channels')
  .setDescription('channels cmd')
  .addChannelOption((option) =>
    option
      .setName('channels')
      .setDescription('channels')
      .setRequired(true)
  )
  .addBooleanOption((option) =>
    option
      .setName('deletemsgs')
      .setDescription('Delete the messages')
      .setRequired(true)
  ).addIntegerOption((option) =>
    option
      .setName('age')
      .setDescription('Enter your age')
  ).addAttachmentOption((option) =>
    option
      .setName('file')
      .setDescription('file')//파일 붙이기
  );

export default channelsCommand.toJSON();